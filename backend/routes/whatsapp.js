/**
 * WhatsApp Bot – VitaGloss RD
 * ────────────────────────────────────────────────────────────────────────────
 * Webhook oficial de Meta WhatsApp Business API.
 * GET  /webhook/whatsapp  → verificación del webhook desde Meta
 * POST /webhook/whatsapp  → mensajes entrantes, lógica del bot
 *
 * Variables de entorno necesarias (ver .env.example):
 *   WA_TOKEN            – token de acceso de usuario (Meta Developer Console)
 *   WA_PHONE_ID         – Phone Number ID de tu número de WhatsApp Business
 *   WA_VERIFY_TOKEN     – string secreto que tú eliges (ej: "vitagloss2026")
 *   N8N_ORDER_WEBHOOK   – URL del webhook de n8n para notificaciones de pedido
 */

const express = require('express')
const router  = express.Router()
const axios   = require('axios')

// ── Helpers ──────────────────────────────────────────────────────────────────

const META_API = 'https://graph.facebook.com/v20.0'

/** Envía un mensaje de texto simple al número indicado */
async function replyText(to, text) {
  await axios.post(
    `${META_API}/${process.env.WA_PHONE_ID}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text, preview_url: false },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WA_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  )
}

/** Envía un mensaje con botones de respuesta rápida (máx 3 botones) */
async function replyButtons(to, bodyText, buttons) {
  await axios.post(
    `${META_API}/${process.env.WA_PHONE_ID}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: bodyText },
        action: {
          buttons: buttons.map((b, i) => ({
            type: 'reply',
            reply: { id: b.id || `btn_${i}`, title: b.label.slice(0, 20) },
          })),
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WA_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  )
}

/** Notifica a n8n cuando se captura un pedido */
async function notifyN8n(payload) {
  if (!process.env.N8N_ORDER_WEBHOOK) return
  try {
    await axios.post(process.env.N8N_ORDER_WEBHOOK, payload, { timeout: 5000 })
  } catch (e) {
    console.error('[WA Bot] n8n notify error:', e.message)
  }
}

// ── Textos del bot ────────────────────────────────────────────────────────────

const BIENVENIDA = `¡Hola! 👋 Soy el asistente de *VitaGloss RD* 🌿

Distribuidores certificados de productos *Amway/Nutrilite* en República Dominicana.

¿En qué te puedo ayudar?`

const BIENVENIDA_BTNS = [
  { id: 'ver_productos', label: '🛒 Ver productos' },
  { id: 'hacer_pedido',  label: '📦 Hacer un pedido' },
  { id: 'info_envio',    label: '🚚 Envío y pago' },
]

const MENU_PRODUCTOS = `🛒 *Productos más populares:*

1️⃣ Pasta Dental Glister™ — RD$899
2️⃣ Spray Bucal Glister™  — RD$820
3️⃣ Enjuague Bucal Glister™ — RD$1,169
4️⃣ Vitamina C Nutrilite™ — RD$1,099
5️⃣ Double X Nutrilite™ (31 días) — RD$4,040
6️⃣ Cal Mag D Nutrilite™ — RD$948
7️⃣ Vitamina D Nutrilite™ — RD$1,245
8️⃣ Omega-3 Nutrilite™ — RD$1,640

👉 Catálogo completo: https://vitaglossrd.com/catalogo

Escribe el número para más info, o *PEDIDO* para ordenar.`

const FAQ_ENVIO = `🚚 *Envíos y entrega:*

• Entrega en toda la República Dominicana
• Tiempo: 1–3 días hábiles
• Santo Domingo: mismo día o siguiente (según hora)
• Enviamos por *Caribe Express* o mensajero propio

💳 *Métodos de pago:*
• Transferencia bancaria (Banreservas, Popular, BHD)
• Depósito
• Efectivo (entrega personal en SD)

¿Algo más en lo que te pueda ayudar?`

const PEDIDO_PROMPT = `📦 Para procesar tu pedido necesito estos datos:

Por favor escribe en este formato:

*Nombre:* Tu nombre completo
*Producto:* Lo que deseas pedir
*Cantidad:* Cuántas unidades
*Ciudad:* Donde te enviamos

Ejemplo:
Nombre: María Pérez
Producto: Vitamina C Nutrilite
Cantidad: 2
Ciudad: Santiago`

const CATALOGO_LINK = `🌐 Ve todo nuestro catálogo en:
https://vitaglossrd.com/catalogo

Más de 22 productos originales Amway/Nutrilite disponibles.`

const FALLBACK = `No entendí bien tu mensaje 😅

Puedes escribir:
• *MENU* — ver el menú principal
• *PRODUCTOS* — lista de productos
• *PEDIDO* — hacer un pedido
• *ENVIO* — info de envíos y pago
• *CATALOGO* — ver web completa

O escríbeme directo y te respondo personalmente 😊`

const DETALLE_PRODUCTOS = {
  '1': { nombre: 'Pasta Dental Glister™', precio: 'RD$899', desc: 'La única pasta dental con menta certificada Nutrilite™. Protege el esmalte, blanquea y previene caries. Sin SLS ni parabenos.' },
  '2': { nombre: 'Spray Bucal Glister™',  precio: 'RD$820', desc: 'Refresca el aliento al instante. Sin aerosol, hasta 223 usos por envase. Ideal para llevar a todos lados.' },
  '3': { nombre: 'Enjuague Bucal Glister™', precio: 'RD$1,169', desc: 'Sin alcohol. Fórmula concentrada (100 usos). Protege encías, combate la placa y deja el aliento fresco.' },
  '4': { nombre: 'Vitamina C Nutrilite™', precio: 'RD$1,099', desc: 'Fórmula de liberación prolongada 8h con cerezas acerola. Certificado NSF, Kosher y Halal.' },
  '5': { nombre: 'Double X Nutrilite™ (31 días)', precio: 'RD$4,040', desc: 'El multivitamínico más completo. 22 vitaminas/minerales + 22 concentrados vegetales. Más de 40 nutrientes.' },
  '6': { nombre: 'Cal Mag D Nutrilite™',  precio: 'RD$948', desc: 'El trío esencial: calcio, magnesio y vitamina D3 para huesos fuertes y función muscular.' },
  '7': { nombre: 'Vitamina D Nutrilite™', precio: 'RD$1,245', desc: '90 tabletas. Vitamina D3 biodisponible para huesos, inmunidad y estado de ánimo.' },
  '8': { nombre: 'Omega Nutrilite™',      precio: 'RD$1,640', desc: '3x mayor absorción. EPA + DHA. Sin olor a pescado. Protege corazón, cerebro y articulaciones.' },
}

// ── Estado de pedidos en memoria (simple, stateless) ─────────────────────────
// Para sesiones largas considera usar Redis o MongoDB
const sesiones = new Map()

function getSesion(from) {
  if (!sesiones.has(from)) sesiones.set(from, { paso: null, datos: {} })
  return sesiones.get(from)
}

// ── Lógica principal del bot ──────────────────────────────────────────────────

async function handleMessage(from, msgText, msgType) {
  const text    = (msgText || '').trim().toLowerCase()
  const session = getSesion(from)

  // ────────────────────────────────────────────────────────────── CAPTURA PEDIDO
  if (session.paso === 'esperando_pedido') {
    // Intentar parsear el formato: "Nombre: X\nProducto: Y\nCantidad: Z\nCiudad: W"
    const nombre   = text.match(/nombre[:\s]+(.+)/i)?.[1]?.trim()
    const producto = text.match(/producto[:\s]+(.+)/i)?.[1]?.trim()
    const cantidad = text.match(/cantidad[:\s]+(.+)/i)?.[1]?.trim()
    const ciudad   = text.match(/ciudad[:\s]+(.+)/i)?.[1]?.trim()

    if (nombre && producto) {
      session.paso = null
      session.datos = {}
      sesiones.set(from, session)

      const resumen = `✅ ¡Pedido recibido, ${nombre}!\n\nResumen:\n• Producto: ${producto}\n• Cantidad: ${cantidad || '1'}\n• Ciudad: ${ciudad || 'Por confirmar'}\n\nTe contactaremos en breve para confirmar el pago y la entrega.\n\n_VitaGloss RD – Distribuidores Amway 🌿_`
      await replyText(from, resumen)

      // Notificar a Andy via n8n
      await notifyN8n({
        tipo: 'PEDIDO_WA',
        telefono: from,
        nombre,
        producto,
        cantidad: cantidad || '1',
        ciudad:   ciudad   || 'No indicada',
        timestamp: new Date().toISOString(),
      })
      return
    } else {
      await replyText(from, `No pude entender el formato 😅\n\n${PEDIDO_PROMPT}`)
      return
    }
  }

  // ──────────────────────────────────────────────────────── BOTONES INTERACTIVOS
  if (msgType === 'interactive') {
    const btnId = msgText // reusamos el campo para el reply_id
    if (btnId === 'ver_productos')  { await replyText(from, MENU_PRODUCTOS); return }
    if (btnId === 'hacer_pedido')   { session.paso = 'esperando_pedido'; sesiones.set(from, session); await replyText(from, PEDIDO_PROMPT); return }
    if (btnId === 'info_envio')     { await replyText(from, FAQ_ENVIO); return }
  }

  // ──────────────────────────────────────────────────────────── COMANDOS DE TEXTO

  // Saludos → menú principal
  if (/^(hola|hello|hi|buenas|buenos|buen|ola|menu|inicio|start|empezar|ayuda|help)$/i.test(text)) {
    await replyButtons(from, BIENVENIDA, BIENVENIDA_BTNS)
    return
  }

  // Número del producto → detalle
  if (DETALLE_PRODUCTOS[text]) {
    const p = DETALLE_PRODUCTOS[text]
    const msg = `*${p.nombre}*\n💵 ${p.precio}\n\n${p.desc}\n\n¿Lo quieres pedir? Escribe *PEDIDO* o contáctanos: https://wa.me/18492763532`
    await replyText(from, msg)
    return
  }

  // Palabras clave → acciones
  if (/(producto|catalogo|catálogo|lista|qué tienen|que tienen)/i.test(text)) {
    await replyText(from, MENU_PRODUCTOS)
    return
  }

  if (/(envío|envio|delivery|entrega|cuánto tarda|pago|precio envio)/i.test(text)) {
    await replyText(from, FAQ_ENVIO)
    return
  }

  if (/(pedido|pedir|quiero|ordenar|comprar|order)/i.test(text)) {
    session.paso = 'esperando_pedido'
    sesiones.set(from, session)
    await replyText(from, PEDIDO_PROMPT)
    return
  }

  if (/(web|website|pagina|página|tienda|online)/i.test(text)) {
    await replyText(from, CATALOGO_LINK)
    return
  }

  if (/(gracias|thank|perfecto|listo|ok|bueno|excelente|genial)/i.test(text)) {
    await replyText(from, '¡Con mucho gusto! 😊 Estamos aquí siempre que necesites. _VitaGloss RD_ 🌿')
    return
  }

  // Fallback
  await replyText(from, FALLBACK)
}

// ── Rutas Express ─────────────────────────────────────────────────────────────

/** GET – Verificación del webhook (Meta lo llama una vez al registrar la URL) */
router.get('/', (req, res) => {
  const mode      = req.query['hub.mode']
  const token     = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === process.env.WA_VERIFY_TOKEN) {
    console.log('[WA Webhook] Verificación correcta ✓')
    return res.status(200).send(challenge)
  }
  console.warn('[WA Webhook] Token de verificación incorrecto')
  res.sendStatus(403)
})

/** POST – Mensajes entrantes de WhatsApp */
router.post('/', async (req, res) => {
  // Responder 200 de inmediato para que Meta no reintente
  res.sendStatus(200)

  try {
    const body = req.body
    if (body.object !== 'whatsapp_business_account') return

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value    = change.value
        const messages = value?.messages

        if (!messages?.length) continue

        for (const msg of messages) {
          const from    = msg.from
          let   msgText = null
          let   msgType = msg.type

          if (msg.type === 'text') {
            msgText = msg.text?.body
          } else if (msg.type === 'interactive') {
            // Botón de respuesta rápida
            msgText  = msg.interactive?.button_reply?.id
            msgType  = 'interactive'
          } else {
            // Audio, imagen, etc. → fallback
            msgText = ''
          }

          console.log(`[WA Bot] De ${from}: "${msgText}" (${msgType})`)
          await handleMessage(from, msgText, msgType)
        }
      }
    }
  } catch (err) {
    console.error('[WA Bot] Error procesando mensaje:', err.message)
  }
})

module.exports = router
