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

// exec_trans via raw fetch — soap npm entity-encodes &quot; inside text nodes,
// Pagadito's server doesn't decode them → PG2002. Build the envelope manually
// so the JSON string is sent with literal " characters (valid XML text node).
async function execTransRaw({ token, ern, amount, details, currency = 'DOP' }) {
  const mode = process.env.PAGADITO_MODE === 'live' ? 'live' : 'sandbox'
  const endpoint = mode === 'live'
    ? 'https://comercios.pagadito.com/wspg/charges.php'
    : 'https://sandbox.pagadito.com/comercios/wspg/charges.php'

  // Build detailsJson manually so price appears as a JSON numeric literal with
  // decimal point (e.g. 1169.00) — NOT as a quoted string ("1169.00") and NOT
  // as a bare integer (1169). PHP's json_decode decodes 1169.00 as float, which
  // passes Pagadito's is_float() validation. JSON.stringify can't produce this
  // because JS has no distinction between 1169 and 1169.0.
  const detailsJson = '[' + details.map(d =>
    `{"quantity":${parseInt(d.quantity)},"description":${JSON.stringify(String(d.description).slice(0, 100))},"price":${Number(d.price).toFixed(2)},"url_product":${JSON.stringify(d.url_product)}}`
  ).join(',') + ']'
  // Use same namespace prefix ("soap:") as the npm soap library uses for connect(),
  // because Pagadito's server likely parses envelopes with string/regex matching
  // and expects <soap:Envelope>/<soap:Body>, not <soapenv:Envelope>/<soapenv:Body>.
  const body = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tns="urn:https://comercios.pagadito.com/wspg/charges"><soap:Body><tns:exec_trans><token>${token}</token><ern>${ern}</ern><amount>${amount}</amount><details>${detailsJson}</details><currency>${currency}</currency><custom_param></custom_param><format_return>json</format_return></tns:exec_trans></soap:Body></soap:Envelope>`

  console.log('[Pagadito] exec_trans rawRequest:', body)

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml; charset=utf-8', 'SOAPAction': '' },
    body,
  })

  const xmlText = await res.text()
  console.log('[Pagadito] exec_trans rawResponse:', xmlText.slice(0, 2000))

  const match = xmlText.match(/<return[^>]*>([\s\S]*?)<\/return>/)
  if (!match) throw new Error('Respuesta SOAP inesperada de Pagadito')
  // Pagadito entity-encodes the JSON in its response — decode before parsing
  const jsonStr = match[1]
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
  const parsed = JSON.parse(jsonStr)
  console.log('[Pagadito] exec_trans result:', parsed)
  return parsed
}

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

    // Líneas de detalle — estructura exacta del SDK PHP de Pagadito:
    // quantity (int), description (string), price (float), url_product (string, requerido)
    const SITE = process.env.FRONTEND_URL || 'https://www.vitaglossrd.com'
    const details = items.map(i => ({
      quantity:    i.cantidad,
      description: i.nombre.slice(0, 100),
      price:       parseFloat(Number(i.precio).toFixed(2)),
      url_product: `${SITE}/catalogo`,
    }))

    if (costoEnvio > 0) {
      details.push({
        quantity:    1,
        description: 'Envío a domicilio',
        price:       Number(costoEnvio).toFixed(2),
        url_product: `${SITE}/catalogo`,
      })
    }

    const amount = details.reduce((s, d) => s + (Number(d.quantity) * parseFloat(d.price)), 0).toFixed(2)

    // execTransRaw construye el envelope manualmente para que las " del JSON
    // no sean entity-encoded a &quot; por node-soap → evita PG2002.
    const transData = await execTransRaw({
      token:    sessionToken,
      ern,
      amount,
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

    const estado = statusData.value?.status
    if (estado !== 'COMPLETED') {
      return res.status(400).json({ error: `El pago no fue completado. Estado: ${estado}` })
    }

    // Verificar que no se creó ya la orden con este token (idempotencia)
    const existe = await Order.findOne({ pagoRef: tokenTrans })
    if (existe) {
      return res.json({ ok: true, orderId: existe._id, invoiceNumber: existe.invoiceNumber, yaExistia: true })
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

    res.json({ ok: true, orderId: order._id, invoiceNumber: order.invoiceNumber })
  } catch (err) {
    console.error('Pagadito verify error:', err)
    res.status(500).json({ error: 'Error al verificar el pago con Pagadito' })
  }
})

module.exports = router
