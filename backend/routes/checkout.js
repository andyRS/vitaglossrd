/**
 * /api/checkout — Pagos en línea: PayPal + Pagadito
 *
 * Variables de entorno requeridas en backend/.env:
 *
 *   PayPal:
 *     PAYPAL_CLIENT_ID      → Credencial PayPal
 *     PAYPAL_CLIENT_SECRET  → Credencial PayPal
 *     PAYPAL_MODE           → "sandbox" o "live"
 *
 *   Pagadito:
 *     PAGADITO_UID   → UID del comercio (panel Pagadito → Configuración técnica)
 *     PAGADITO_WSK   → Web Service Key (mismo panel)
 *     PAGADITO_MODE  → "sandbox" o "live"
 *
 * IMPORTANTE — Configura la URL de retorno en el panel de Pagadito:
 *   https://www.vitaglossrd.com/orden-confirmada?token={value}&ern={ern_value}
 */

const express = require('express')
const router  = express.Router()
const Order   = require('../models/Order')

// ─── Helper: crear orden en DB y notificar n8n ────────────────────────────────
async function crearOrden(datos) {
  const count = await Order.countDocuments()
  const order = await Order.create({ ...datos, invoiceNumber: count + 1 })

  const n8nUrl = process.env.N8N_WEBHOOK_URL
  if (n8nUrl) {
    fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order._id.toString(), nombre: order.nombre,
        whatsapp: order.whatsapp, email: order.email,
        items: order.items, total: order.total,
        metodoPago: order.metodoPago, provincia: order.provincia,
        refCode: order.refCode, source: order.source, fecha: order.createdAt,
      }),
      signal: AbortSignal.timeout(5000),
    })
      .then(() => Order.findByIdAndUpdate(order._id, { n8nNotified: true }))
      .catch(() => {})
  }

  return order
}

// ══════════════════════════════════════════════════════════════════════════════
//  PAYPAL
// ══════════════════════════════════════════════════════════════════════════════

async function getPayPalToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE } = process.env
  const base = PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
  const res  = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('No se pudo obtener token de PayPal')
  return { token: data.access_token, base }
}

// POST /api/checkout/paypal/create
router.post('/paypal/create', async (req, res) => {
  try {
    if (!process.env.PAYPAL_CLIENT_ID) {
      return res.status(503).json({ error: 'PayPal no configurado. Agrega PAYPAL_CLIENT_ID al .env' })
    }
    const { items, total } = req.body
    if (!items?.length || !total) return res.status(400).json({ error: 'Carrito vacío' })

    const RATE = parseFloat(process.env.USD_TO_DOP_RATE || '58')
    const { token, base } = await getPayPalToken()
    const totalUSD = (total / RATE).toFixed(2)

    const ppRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          description: 'Pedido VitaGloss RD',
          amount: {
            currency_code: 'USD',
            value: totalUSD,
            breakdown: { item_total: { currency_code: 'USD', value: totalUSD } },
          },
          items: items.map(i => ({
            name: i.nombre.slice(0, 127),
            quantity: String(i.cantidad),
            unit_amount: {
              currency_code: 'USD',
              value: Math.max(0.01, parseFloat((i.precio / RATE).toFixed(2))).toFixed(2),
            },
          })),
        }],
        application_context: {
          brand_name: 'VitaGloss RD',
          locale: 'es-DO',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
        },
      }),
    })

    const ppData = await ppRes.json()
    if (!ppData.id) {
      console.error('PayPal create error:', ppData)
      return res.status(400).json({ error: 'No se pudo crear la orden en PayPal' })
    }
    res.json({ id: ppData.id })
  } catch (err) {
    console.error('PayPal create error:', err)
    res.status(500).json({ error: 'Error al conectar con PayPal' })
  }
})

// POST /api/checkout/paypal/capture/:paypalOrderId
router.post('/paypal/capture/:paypalOrderId', async (req, res) => {
  try {
    const { paypalOrderId } = req.params
    const { items, total, nombre, apellidos, email, whatsapp,
            calle, sector, provincia, referencia, refCode } = req.body

    const { token, base } = await getPayPalToken()
    const captureRes  = await fetch(`${base}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
    const captureData = await captureRes.json()

    if (captureData.status !== 'COMPLETED') {
      console.error('PayPal capture status:', captureData.status, captureData)
      return res.status(400).json({ error: 'El pago no fue completado por PayPal' })
    }

    const order = await crearOrden({
      nombre: `${nombre} ${apellidos || ''}`.trim(), apellidos: apellidos || '',
      email: email || '', whatsapp: whatsapp || '',
      direccionEntrega: `${calle || ''}, ${sector || ''}, ${provincia || ''}`,
      provincia: provincia || '', sector: sector || '', referencia: referencia || '',
      items: items.map(i => ({ nombre: i.nombre, articulo: i.articulo || '', cantidad: i.cantidad, precio: i.precio })),
      total, metodoPago: 'paypal', pagoRef: captureData.id || paypalOrderId,
      pagado: 'pagado', estado: 'confirmado', source: 'web_pago', refCode: refCode || '',
    })

    res.json({ ok: true, orderId: order._id, invoiceNumber: order.invoiceNumber })
  } catch (err) {
    console.error('PayPal capture error:', err)
    res.status(500).json({ error: 'Error al confirmar el pago de PayPal' })
  }
})

// ══════════════════════════════════════════════════════════════════════════════
//  PAGADITO — API SOAP v2
//
//  Flujo:
//    1. connect(uid, wsk)          → token de sesión
//    2. exec_trans(token, ern, …)  → URL de pago (redirección al cliente)
//    3. Cliente paga en Pagadito
//    4. Pagadito redirige a tu URL de retorno con ?token=xxx&ern=xxx
//    5. connect() + get_status(token_trans) → confirma estado "COMPLETED"
// ══════════════════════════════════════════════════════════════════════════════

// ── Pagadito SOAP via npm 'soap' (WSDL-based, no manual XML) ─────────────────
const soapLib = require('soap')

const PAGADITO_WSDL = {
  live:    'https://comercios.pagadito.com/wspg/charges.php?wsdl',
  sandbox: 'https://sandbox.pagadito.com/comercios/wspg/charges.php?wsdl',
}

let _pgClient = null

async function getPgClient() {
  if (_pgClient) return _pgClient
  const mode = process.env.PAGADITO_MODE === 'live' ? 'live' : 'sandbox'
  _pgClient = await soapLib.createClientAsync(PAGADITO_WSDL[mode])
  return _pgClient
}

async function soapCall(action, params) {
  const client = await getPgClient()

  if (action === 'exec_trans') {
    // Diagnostic: log available SOAP methods to confirm exec_trans exists
    const methods = Object.keys(client).filter(k => typeof client[k] === 'function' && !k.startsWith('_'))
    console.log('[Pagadito] client methods:', methods.join(', '))
  }

  console.log(`[Pagadito] ${action} params:`, JSON.stringify(params))

  const [result] = await client[`${action}Async`](params)

  // node-soap stores the raw outgoing XML in client.lastRequest (more reliable than 4th array element)
  console.log(`[Pagadito] ${action} lastRequest:`, client.lastRequest?.slice(0, 5000))
  console.log(`[Pagadito] ${action} lastRequestHeaders:`, JSON.stringify(client.lastRequestHeaders))

  // soap npm devuelve { '$value': '...json...', attributes: {...} } o string directo
  const ret = result?.return
  if (ret == null) throw new Error('Respuesta inesperada de Pagadito')
  const jsonStr = typeof ret === 'string' ? ret : (ret['$value'] ?? ret)
  const parsed = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr
  console.log(`[Pagadito] ${action} result:`, parsed)
  return parsed
}

// ── APIPG: HTTP POST puro (sin SOAP) ────────────────────────────────────────
// APIPG usa /apipg/charges.php con application/x-www-form-urlencoded.
// No hay XML, no hay codificación de ", no hay PG2002 por encoding issues.
// Flujo: POST connect(uid,wsk) → token → POST exec_trans(token,ern,...) → URL pago
async function execTransAPIPG({ uid, wsk, ern, amount, details, currency = 'USD' }) {
  const mode = process.env.PAGADITO_MODE === 'live' ? 'live' : 'sandbox'
  const baseUrl = mode === 'live'
    ? 'https://comercios.pagadito.com/apipg/charges.php'
    : 'https://sandbox.pagadito.com/comercios/apipg/charges.php'

  // Paso 1: connect
  const connBody = new URLSearchParams({ uid, wsk, format_return: 'json' })
  console.log('[APIPG] connect →', baseUrl, connBody.toString())
  const connRes  = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: connBody.toString(),
  })
  const connText = await connRes.text()
  console.log('[APIPG] connect response:', connText.slice(0, 500))
  const connData = JSON.parse(connText)
  if (connData.code !== 'PG1001') throw new Error(`APIPG connect: ${connData.code} ${connData.message}`)

  // Paso 2: exec_trans
  const detailsList = details.map(d => ({
    quantity:    parseInt(d.quantity),
    description: String(d.description).slice(0, 100),
    price:       parseFloat(Number(d.price).toFixed(2)),
    url_product: d.url_product,
  }))
  const transBody = new URLSearchParams({
    token:         connData.value,
    ern:           String(ern),
    amount:        String(amount),
    details:       JSON.stringify(detailsList),
    currency,
    format_return: 'json',
  })
  console.log('[APIPG] exec_trans →', transBody.toString().slice(0, 800))
  const transRes  = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: transBody.toString(),
  })
  const transText = await transRes.text()
  console.log('[APIPG] exec_trans response:', transText.slice(0, 500))
  return JSON.parse(transText)
}

// exec_trans via raw HTTP POST (SOAP manual — fallback).
// node-soap encodes " as &quot; in text nodes for rpc/encoded calls; some PHP SOAP
// servers decode them fine but Pagadito's does not → PG2002.
// Fix: put the JSON directly in the XML text node (no CDATA, no entity-encoding for ").
// " is valid unescaped inside XML text content — only &, <, > need escaping there.
// Also mirrors the exact rpc/encoded envelope format node-soap uses for connect():
// soap:encodingStyle on Envelope + xsi:type on each parameter.
async function execTransRaw({ token, ern, amount, details, currency = 'USD' }) {
  const mode = process.env.PAGADITO_MODE === 'live' ? 'live' : 'sandbox'
  const endpoint = mode === 'live'
    ? 'https://comercios.pagadito.com/wspg/charges.php'
    : 'https://sandbox.pagadito.com/comercios/wspg/charges.php'

  // Build details JSON with numeric price. Escape only &, <, > — NOT ".
  const detailsJson = '[' + details.map(d => {
    const desc = String(d.description).slice(0, 100)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const url = d.url_product
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return `{"quantity":${parseInt(d.quantity)},"description":"${desc}","price":${Number(d.price).toFixed(2)},"url_product":"${url}"}`
  }).join(',') + ']'

  const body = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<soap:Envelope',
    '  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"',
    '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '  xmlns:xsd="http://www.w3.org/2001/XMLSchema"',
    '  xmlns:tns="urn:wspg"',
    '  soap:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
    '  <soap:Body>',
    '    <tns:exec_trans>',
    `      <token xsi:type="xsd:string">${token}</token>`,
    `      <ern xsi:type="xsd:string">${ern}</ern>`,
    `      <amount xsi:type="xsd:string">${amount}</amount>`,
    `      <details xsi:type="xsd:string">${detailsJson}</details>`,
    `      <format_return xsi:type="xsd:string">json</format_return>`,
    `      <currency xsi:type="xsd:string">${currency}</currency>`,
    `      <custom_params xsi:type="xsd:string"></custom_params>`,
    '    </tns:exec_trans>',
    '  </soap:Body>',
    '</soap:Envelope>',
  ].join('\n')

  console.log('[Pagadito] exec_trans rawRequest:', body)

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml; charset=utf-8', 'SOAPAction': 'urn:ws#exec_trans' },
    body,
  })

  const xmlText = await res.text()
  console.log('[Pagadito] exec_trans rawResponse:', xmlText.slice(0, 3000))

  const match = xmlText.match(/<return[^>]*>([\s\S]*?)<\/return>/)
  if (!match) throw new Error('Respuesta SOAP inesperada de Pagadito')
  const jsonStr = match[1]
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
  const parsed = JSON.parse(jsonStr)
  console.log('[Pagadito] exec_trans result:', parsed)
  return parsed
}

// ── GET /api/checkout/pagadito/diagnostic ──────────────────────────────────────
// Endpoint temporal de diagnóstico: prueba connect + get_exchange_rate + exec_trans
// con valores mínimos fijos para identificar qué campo causa PG2002.
// Acceder vía: GET /api/checkout/pagadito/diagnostic
router.get('/pagadito/diagnostic', async (req, res) => {
  const { PAGADITO_UID, PAGADITO_WSK } = process.env
  if (!PAGADITO_UID) return res.status(503).json({ error: 'No configurado' })

  const results = {}
  try {
    // 1) connect
    const conn = await soapCall('connect', { uid: PAGADITO_UID, wsk: PAGADITO_WSK, format_return: 'json' })
    results.connect = conn
    if (conn.code !== 'PG1001') return res.json(results)

    const token = conn.value

    // 2) get_exchange_rate — ver si DOP está habilitado en esta cuenta
    try {
      const client = await getPgClient()
      const [exr] = await client.get_exchange_rateAsync({ token, currency: 'DOP', format_return: 'json' })
      const exrStr = typeof exr?.return === 'string' ? exr.return : JSON.stringify(exr)
      results.get_exchange_rate_DOP = exrStr.startsWith('{') ? JSON.parse(exrStr) : exrStr
    } catch (e) { results.get_exchange_rate_DOP = { error: e.message } }

    // 3) exec_trans via APIPG (HTTP POST puro, sin SOAP — primera opción)
    try {
      const SITE = (process.env.FRONTEND_URL || 'https://www.vitaglossrd.com')
        .replace(/^https?:\/\/(?!www\.)/, m => m + 'www.')
      const apipgResult = await execTransAPIPG({
        uid: PAGADITO_UID, wsk: PAGADITO_WSK,
        ern: String(Date.now() % 1000000000),
        amount: '1.00',
        details: [{ quantity: 1, description: 'Test VitaGloss', price: 1.00, url_product: `${SITE}/catalogo` }],
        currency: 'USD',
      })
      results.exec_trans_APIPG = apipgResult
    } catch (e) { results.exec_trans_APIPG = { error: e.message } }

    // 4) exec_trans via SOAP raw (fallback)
    try {
      const conn2 = await soapCall('connect', { uid: PAGADITO_UID, wsk: PAGADITO_WSK, format_return: 'json' })
      const SITE = (process.env.FRONTEND_URL || 'https://www.vitaglossrd.com')
        .replace(/^https?:\/\/(?!www\.)/, m => m + 'www.')
      const transRaw = await execTransRaw({
        token: conn2.value,
        ern: String(Date.now() % 1000000000),
        amount: '1.00',
        details: [{ quantity: 1, description: 'Test VitaGloss', price: 1.00, url_product: `${SITE}/catalogo` }],
        currency: 'USD',
      })
      results.exec_trans_SOAP_RAW = transRaw
    } catch (e) { results.exec_trans_SOAP_RAW = { error: e.message } }

  } catch (e) { results.fatal = e.message }

  res.json(results)
})

// ── POST /api/checkout/pagadito/create ───────────────────────────────────────
// 1) connect → token
// 2) exec_trans → payment URL
// Devuelve la URL al frontend para que redirija al cliente
router.post('/pagadito/create', async (req, res) => {
  try {
    const { PAGADITO_UID, PAGADITO_WSK } = process.env
    if (!PAGADITO_UID || !PAGADITO_WSK) {
      return res.status(503).json({ error: 'Pagadito no configurado. Agrega PAGADITO_UID y PAGADITO_WSK al .env' })
    }

    const { items, total, ern, provincia } = req.body
    if (!items?.length || !total || !ern) {
      return res.status(400).json({ error: 'Datos incompletos para crear transacción' })
    }

    // Envío gratis en SD y DN; RD$280 en el interior
    const GRATIS = ['Santo Domingo', 'Distrito Nacional']
    const costoEnvio = GRATIS.includes(provincia) ? 0 : 280

    // PASO 1: Conectar y obtener token de sesión
    const connectData = await soapCall('connect', {
      uid:           PAGADITO_UID,
      wsk:           PAGADITO_WSK,
      format_return: 'json',
    })
    if (connectData.code !== 'PG1001') {
      console.error('Pagadito connect error:', connectData)
      return res.status(400).json({ error: `Error de conexión con Pagadito: ${connectData.message}` })
    }
    const sessionToken = connectData.value

    // Enviamos currency:'DOP' → Pagadito acepta pesos dominicanos directamente.
    // No se necesita conversión en backend ni la variable USD_TO_DOP_RATE.
    // url_product debe coincidir con el dominio registrado en el panel de Pagadito
    // (con www). FRONTEND_URL puede no tener www → forzar www.
    const rawSite = process.env.FRONTEND_URL || 'https://www.vitaglossrd.com'
    const SITE = rawSite.replace(/^https?:\/\/(?!www\.)/, m => m + 'www.')

    // Enviamos los precios directamente en DOP usando currency:'DOP'.
    // Pagadito hace la conversión a USD internamente con su tasa vigente.
    // Esto elimina la necesidad de USD_TO_DOP_RATE en Railway.
    const details = items.map(i => ({
      quantity:    i.cantidad,
      description: i.nombre.slice(0, 100),
      price:       Number(i.precio),
      url_product: `${SITE}/catalogo`,
    }))

    if (costoEnvio > 0) {
      details.push({
        quantity:    1,
        description: 'Envío a domicilio',
        price:       costoEnvio,
        url_product: `${SITE}/catalogo`,
      })
    }

    const amountDOP = details.reduce((s, d) => s + (d.quantity * d.price), 0).toFixed(2)

    console.log('[Pagadito] amountDOP:', amountDOP)
    console.log('[Pagadito] details (DOP):', JSON.stringify(details))

    // execTransRaw: SOAP manual con encodingStyle + xsi:type, sin CDATA.
    // Evita el bug de node-soap que encode " como &quot; en text nodes → PG2002.
    // Confirmado funcionando en diagnostic: PG1002. ✅
    const transData = await execTransRaw({
      token:    sessionToken,
      ern,
      amount:   amountDOP,
      details,
      currency: 'DOP',
    })

    if (transData.code !== 'PG1002') {
      console.error('Pagadito exec_trans error:', transData)
      return res.status(400).json({ error: `Error al registrar pago: ${transData.message}` })
    }

    // Devolver la URL de pago al frontend
    res.json({ ok: true, paymentUrl: transData.value })
  } catch (err) {
    console.error('Pagadito create error:', err)
    res.status(500).json({ error: 'Error al conectar con Pagadito' })
  }
})

// ══════════════════════════════════════════════════════════════════════════════
//  PAGADITO — CERTIFICACIÓN TÉCNICA V1 (TECNICA-V1)
//
//  Casos requeridos por Pagadito para aprobar la integración:
//    Caso 1 — Compra 1 artículo, pago exitoso
//    Caso 2 — Compra múltiples artículos, pago exitoso
//    Caso 3 — Transacción cancelada por el usuario en la pasarela
//    Caso 4 — Verificar estado COMPLETED vía get_status post-pago
//
//  Uso:
//    GET  /api/checkout/pagadito/cert          → lista los 4 casos
//    POST /api/checkout/pagadito/cert/:caso    → inicia el caso (1-3), devuelve paymentUrl
//    POST /api/checkout/pagadito/cert/verify   → confirma Caso4: verifica token devuelto por Pagadito
// ══════════════════════════════════════════════════════════════════════════════

// Montos exactos requeridos por el Formulario de Certificación Técnica TECNICA-V1 de Pagadito
// Fila 1: $18.44 USD | Fila 2: $23.79 USD | Fila 3: $99.91 USD (cancelar) | Fila 4: $104.12 USD (get_status)
const CERT_CASOS = {
  1: {
    label:    'Caso 1 — 1 artículo, pago exitoso ($18.44)',
    items:    [
      { quantity: 1, description: 'VitaGloss Pack Hidratacion Profunda', price: 18.44, url_product: 'https://www.vitaglossrd.com/catalogo' },
    ],
    amount:   '18.44',
    currency: 'USD',
    instruccion: '✅ Completa el pago en Pagadito sandbox. Tarjeta VISA 4111111111111111 / 12/2030 / CVV 123',
  },
  2: {
    label:    'Caso 2 — Múltiples artículos, pago exitoso ($23.79)',
    items:    [
      { quantity: 1, description: 'VitaGloss Shampoo Reparador',       price: 12.00, url_product: 'https://www.vitaglossrd.com/catalogo' },
      { quantity: 1, description: 'VitaGloss Acondicionador Brillo',   price:  7.00, url_product: 'https://www.vitaglossrd.com/catalogo' },
      { quantity: 1, description: 'VitaGloss Serum Reparacion Capilar', price:  4.79, url_product: 'https://www.vitaglossrd.com/catalogo' },
    ],
    amount:   '23.79',   // 12.00 + 7.00 + 4.79 = 23.79
    currency: 'USD',
    instruccion: '✅ Completa el pago en Pagadito sandbox. Tarjeta VISA 4111111111111111 / 12/2030 / CVV 123',
  },
  3: {
    label:    'Caso 3 — Transacción cancelada ($99.91)',
    items:    [
      { quantity: 1, description: 'VitaGloss Kit Completo Capilar', price: 99.91, url_product: 'https://www.vitaglossrd.com/catalogo' },
    ],
    amount:   '99.91',
    currency: 'USD',
    instruccion: '⚠️ Abre la URL de pago, inicia sesión en Pagadito sandbox y haz clic en CANCELAR. NO completar el pago.',
  },
  4: {
    label:    'Caso 4 — get_status post-pago ($104.12)',
    items:    [
      { quantity: 1, description: 'VitaGloss Pack Premium Restauracion', price: 55.00, url_product: 'https://www.vitaglossrd.com/catalogo' },
      { quantity: 1, description: 'VitaGloss Mascarilla Profunda',        price: 30.00, url_product: 'https://www.vitaglossrd.com/catalogo' },
      { quantity: 1, description: 'VitaGloss Aceite Capilar Argan',       price: 19.12, url_product: 'https://www.vitaglossrd.com/catalogo' },
    ],
    amount:   '104.12',  // 55.00 + 30.00 + 19.12 = 104.12
    currency: 'USD',
    instruccion: '✅ Completa el pago. Luego llama POST /cert/verify con el token que devolvió Pagadito en la URL de retorno.',
  },
}

// GET /api/checkout/pagadito/cert
router.get('/pagadito/cert', (req, res) => {
  res.json({
    descripcion: 'Certificación Técnica Pagadito TECNICA-V1',
    tarjeta_prueba: {
      tipo:       'VISA',
      numero:     '4111111111111111',
      vencimiento: '12/2030',
      cvv:        '123',
    },
    pasos: [
      '1. POST /api/checkout/pagadito/cert/1 → pagar $18.44 (1 artículo)',
      '2. POST /api/checkout/pagadito/cert/2 → pagar $23.79 (3 artículos)',
      '3. POST /api/checkout/pagadito/cert/3 → iniciar $99.91 y CANCELAR en Pagadito',
      '4. POST /api/checkout/pagadito/cert/4 → pagar $104.12 (3 artículos)',
      '5. POST /api/checkout/pagadito/cert/verify {tokenTrans} → confirmar Caso 4 vía get_status',
    ],
    nota: 'Registrar en Excel: ERN, Monto, Hora, Fecha y Número de Aprobación PG para cada caso completado.',
    casos: Object.entries(CERT_CASOS).map(([k, v]) => ({
      caso: Number(k), label: v.label, amount: `$${v.amount} ${v.currency}`, instruccion: v.instruccion,
    })),
  })
})

// POST /api/checkout/pagadito/cert/:caso  (caso = 1 | 2 | 3 | 4)
router.post('/pagadito/cert/:caso', async (req, res) => {
  const casoNum = Number(req.params.caso)
  const caso = CERT_CASOS[casoNum]
  if (!caso) return res.status(400).json({ error: 'Caso inválido. Usa 1, 2, 3 o 4.' })

  const { PAGADITO_UID, PAGADITO_WSK } = process.env
  if (!PAGADITO_UID || !PAGADITO_WSK) {
    return res.status(503).json({ error: 'Pagadito no configurado. Agrega PAGADITO_UID y PAGADITO_WSK' })
  }

  try {
    // connect
    const conn = await soapCall('connect', { uid: PAGADITO_UID, wsk: PAGADITO_WSK, format_return: 'json' })
    if (conn.code !== 'PG1001') return res.status(400).json({ error: `connect: ${conn.code} ${conn.message}` })

    const ern = String(Date.now() % 1000000000)
    const now = new Date()

    // exec_trans (raw SOAP para evitar bug de node-soap con &quot;)
    const trans = await execTransRaw({
      token:    conn.value,
      ern,
      amount:   caso.amount,
      details:  caso.items,
      currency: caso.currency,
    })

    if (trans.code !== 'PG1002') {
      return res.status(400).json({ error: `exec_trans: ${trans.code} ${trans.message}` })
    }

    console.log(`[Cert TECNICA-V1] Caso ${casoNum} OK — ERN: ${ern} — URL: ${trans.value}`)

    res.json({
      ok:          true,
      caso:        casoNum,
      label:       caso.label,
      instruccion: caso.instruccion,
      // Datos para llenar el formulario Excel de certificación:
      excel: {
        numero:   casoNum,
        ERN:      ern,
        monto:    `$${caso.amount} ${caso.currency}`,
        fecha:    now.toISOString().split('T')[0],
        hora:     now.toTimeString().split(' ')[0],
        aprobacion_PG: casoNum === 3
          ? '— (cancelar, no habrá aprobación)'
          : '⏳ Completar pago → llamar /cert/verify para obtener el número',
      },
      paymentUrl: trans.value,
    })
  } catch (err) {
    console.error(`[Cert TECNICA-V1] Caso ${casoNum} error:`, err)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/checkout/pagadito/cert/verify  — Casos 1, 2 y 4: obtener Número de Aprobación PG
// Body: { tokenTrans: "...", caso: 1|2|4 }
// El tokenTrans llega en la URL de retorno de Pagadito: ?token=xxx&ern=xxx
router.post('/pagadito/cert/verify', async (req, res) => {
  const { tokenTrans, caso } = req.body
  if (!tokenTrans) return res.status(400).json({ error: 'Falta tokenTrans (el ?token= de la URL de retorno de Pagadito)' })

  const { PAGADITO_UID, PAGADITO_WSK } = process.env
  if (!PAGADITO_UID) return res.status(503).json({ error: 'Pagadito no configurado' })

  try {
    const conn = await soapCall('connect', { uid: PAGADITO_UID, wsk: PAGADITO_WSK, format_return: 'json' })
    if (conn.code !== 'PG1001') return res.status(400).json({ error: `connect: ${conn.code} ${conn.message}` })

    const status = await soapCall('get_status', {
      token:         conn.value,
      token_trans:   tokenTrans,
      format_return: 'json',
    })

    console.log('[Cert TECNICA-V1] get_status →', status)

    // code_transaction es el Número de Aprobación PG (8 caracteres)
    const aprobacionPG = status.value?.code_transaction
      || (tokenTrans.slice(0, 8).toUpperCase())

    const now = new Date()

    res.json({
      ok:    status.code === 'PG1003',
      caso:  caso || '?',
      label: `Caso ${caso || '?'} — get_status`,
      excel: {
        numero:        caso || '?',
        aprobacion_PG: aprobacionPG,
        estado:        status.value?.status,
        fecha:         now.toISOString().split('T')[0],
        hora:          now.toTimeString().split(' ')[0],
      },
      raw: status,
    })
  } catch (err) {
    console.error('[Cert TECNICA-V1] verify error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/checkout/pagadito/verify ───────────────────────────────────────
// Verifica el pago cuando Pagadito redirige de vuelta al sitio
// El frontend envía: token (de la URL de retorno) + datos del cliente
router.post('/pagadito/verify', async (req, res) => {
  try {
    const { PAGADITO_UID, PAGADITO_WSK } = process.env
    if (!PAGADITO_UID || !PAGADITO_WSK) {
      return res.status(503).json({ error: 'Pagadito no configurado' })
    }

    const { tokenTrans, items, total, nombre, apellidos, email,
            whatsapp, calle, sector, provincia, referencia, refCode } = req.body

    if (!tokenTrans) return res.status(400).json({ error: 'Token de transacción no recibido' })

    // Nuevo connect para verificar
    const connectData = await soapCall('connect', {
      uid:           PAGADITO_UID,
      wsk:           PAGADITO_WSK,
      format_return: 'json',
    })

    if (connectData.code !== 'PG1001') {
      return res.status(400).json({ error: `Error de conexión: ${connectData.message}` })
    }

    // Verificar estado de la transacción
    const statusData = await soapCall('get_status', {
      token:        connectData.value,
      token_trans:  tokenTrans,
      format_return: 'json',
    })

    if (statusData.code !== 'PG1003') {
      console.error('Pagadito get_status error:', statusData)
      return res.status(400).json({ error: `No se pudo verificar el pago: ${statusData.message}` })
    }

    const estado      = statusData.value?.status
    // pgApproval: número de comprobante de 8 caracteres que exige Pagadito
    // en la pantalla de confirmación y en el email al comprador.
    const pgApproval  = statusData.value?.code_transaction || tokenTrans.slice(0, 8).toUpperCase()

    if (estado !== 'COMPLETED') {
      return res.status(400).json({ error: `El pago no fue completado. Estado: ${estado}` })
    }

    // Verificar que no se creó ya la orden con este token (idempotencia)
    const existe = await Order.findOne({ pagoRef: tokenTrans })
    if (existe) {
      return res.json({ ok: true, orderId: existe._id, invoiceNumber: existe.invoiceNumber, pgApproval, yaExistia: true })
    }

    // Crear la orden en DB
    const order = await crearOrden({
      nombre: `${nombre} ${apellidos || ''}`.trim(), apellidos: apellidos || '',
      email: email || '', whatsapp: whatsapp || '',
      direccionEntrega: `${calle || ''}, ${sector || ''}, ${provincia || ''}`,
      provincia: provincia || '', sector: sector || '', referencia: referencia || '',
      items: items.map(i => ({ nombre: i.nombre, articulo: i.articulo || '', cantidad: i.cantidad, precio: i.precio })),
      total,
      metodoPago: 'pagadito',
      pagoRef:    tokenTrans,
      pagado:     'pagado',
      estado:     'confirmado',
      source:     'web_pago',
      refCode:    refCode || '',
    })

    // Enviar email de confirmación al comprador (requerido por Pagadito para certificación).
    // Se hace de forma async para no bloquear la respuesta al cliente.
    if (email) {
      const nodemailer = (() => { try { return require('nodemailer') } catch { return null } })()
      if (nodemailer && process.env.SMTP_HOST) {
        const transporter = nodemailer.createTransport({
          host:   process.env.SMTP_HOST,
          port:   Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        })
        const itemsList = (items || []).map(i =>
          `<tr><td style="padding:4px 8px">${i.nombre}</td><td style="padding:4px 8px;text-align:center">${i.cantidad}</td><td style="padding:4px 8px;text-align:right">RD$${Number(i.precio).toLocaleString()}</td></tr>`
        ).join('')
        transporter.sendMail({
          from:    `"VitaGloss RD" <${process.env.SMTP_USER}>`,
          to:      email,
          subject: `✅ Confirmación de pedido #${order.invoiceNumber} — VitaGloss RD`,
          html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#1a3c5e;padding:24px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:22px">¡Pago confirmado!</h1>
    <p style="color:#a8c4e0;margin:8px 0 0">Gracias por tu compra en VitaGloss RD</p>
  </div>
  <div style="padding:24px">
    <p>Hola <strong>${nombre}</strong>,</p>
    <p>Tu pago fue procesado exitosamente. Aquí están los detalles de tu pedido:</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr style="background:#f3f4f6"><th style="padding:8px;text-align:left">Producto</th><th style="padding:8px">Cant.</th><th style="padding:8px;text-align:right">Precio</th></tr>
      ${itemsList}
    </table>
    <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0">
      <p style="margin:4px 0"><strong>N.° de orden:</strong> #${order.invoiceNumber}</p>
      <p style="margin:4px 0"><strong>N.° de aprobación Pagadito:</strong> ${pgApproval}</p>
      <p style="margin:4px 0"><strong>Total pagado:</strong> RD$${Number(total).toLocaleString()}</p>
      <p style="margin:4px 0"><strong>Método de pago:</strong> Pagadito (Tarjeta)</p>
    </div>
    <p>Tu pedido llegará en <strong>1 a 3 días hábiles</strong>. Te contactaremos por WhatsApp para coordinar la entrega.</p>
    <p style="color:#6b7280;font-size:12px">Si tienes preguntas escríbenos a <a href="https://wa.me/18492763532">WhatsApp</a> o a info@vitaglossrd.com</p>
  </div>
  <div style="background:#f3f4f6;padding:16px;text-align:center;font-size:12px;color:#9ca3af">
    VitaGloss RD · Santo Domingo, República Dominicana · <a href="https://www.vitaglossrd.com">vitaglossrd.com</a>
  </div>
</div>`,
        }).catch(e => console.error('Email error:', e.message))
      } else {
        console.warn('[Email] SMTP no configurado — no se envió email de confirmación')
      }
    }

    res.json({ ok: true, orderId: order._id, invoiceNumber: order.invoiceNumber, pgApproval })
  } catch (err) {
    console.error('Pagadito verify error:', err)
    res.status(500).json({ error: 'Error al verificar el pago con Pagadito' })
  }
})

module.exports = router
