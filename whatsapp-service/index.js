/**
 * VitaGloss RD — Servicio WhatsApp
 * Basado en whatsapp-web.js (sin Docker, puro Node.js)
 *
 * Endpoints:
 *   GET  /status   → estado de la conexión + QR en base64
 *   GET  /qr       → página HTML con QR para escanear
 *   POST /send     → { number, text } → envía mensaje
 *   GET  /health   → healthcheck
 */

require('dotenv').config()
const express    = require('express')
const qrcode     = require('qrcode')
const { Client, LocalAuth } = require('whatsapp-web.js')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const { buildCatalogContext, buscarProducto } = require('./catalog')

const PORT       = process.env.WA_PORT   || 3002
const SECRET_KEY = process.env.WA_SECRET || 'vitagloss_wa_2026'
const GEMINI_KEY = process.env.GEMINI_API_KEY || ''

// ── Gemini AI ─────────────────────────────────────────────────────────────────
const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null

const SYSTEM_PROMPT = `Eres Vita, asesora de ventas de VitaGloss RD (productos Amway/Nutrilite en República Dominicana).
Escribes como una persona real — cálida, natural, con personalidad dominicana. Nada robótico.
Usa frases cortas, emojis ocasionales y un tono como si fuera una amiga que sabe de salud.
NUNCA digas que eres una IA, un bot o un asistente virtual. Si te preguntan, di que eres Vita, la asesora de la tienda.
Respondes SOLO en español. Máximo 3 párrafos por mensaje. Sin listas largas.
Nunca inventes precios — usa solo los del catálogo. Si no sabes algo, di: "Déjame verificarlo y te confirmo en un momento 🙏".
No discutas temas fuera de salud, nutrición o la tienda.

=== ANUNCIOS ACTIVOS EN FACEBOOK (clientes vienen por estos) ===

1. *Cal Mag D Nutrilite* — "Fuerza Total para tus Huesos"
   Calcio + Magnesio + Vitamina D. Para huesos y dientes más fuertes, apoyo muscular y energético.
   Ideal para mujeres y adultos activos. Precio: RD$1,270. PROMOCIÓN ESPECIAL disponible.
   Ver producto: https://vitaglossrd.com/catalogo/10

2. *Pelo Piel y Uñas (Hair, Skin & Nail) Nutrilite* — "Activa tu belleza desde adentro"
   Contiene Biotina, Zinc, Vitamina C y Colágeno. Para cabello que se cae, se quiebra o ha perdido brillo.
   Formulado para la belleza femenina desde el interior. Precio: RD$1,700. PRECIO ESPECIAL.
   Ver producto: https://vitaglossrd.com/catalogo/19

3. *Multivitamínico para Niños (Kids Daily) Nutrilite* — "Oferta especial por tiempo limitado"
   Vitaminas masticables sabor fresa-naranja. Fuertes defensas, más energía. Sin colorantes artificiales.
   Precio: RD$1,399 (precio de oferta limitada). Disponible a nivel nacional.
   Ver producto: https://vitaglossrd.com/catalogo/8

4. *Vitamina C Plus Nutrilite* — "Defensa Immune Diaria"
   Vitamina C de liberación prolongada. Refuerza defensas naturales, apoya recuperación rápida.
   Liberación gradual para todo el día. Precio: RD$1,099.
   Ver producto: https://vitaglossrd.com/catalogo/4

Cuando alguien llegue preguntando por defensas, cabello, huesos o vitaminas para niños, conéctalos automáticamente con el anuncio correcto y ofrece el precio y link.

=== CÓMO FUNCIONA NUESTRA TIENDA (explícalo siempre que el cliente muestre interés en comprar) ===
Somos una tienda online de productos Amway ubicada en Santo Domingo, República Dominicana. Cuando un cliente quiere comprar, se debe ENCARGAR el producto — es decir, hacer el pedido para que nosotros lo solicitemos al almacén y se lo enviemos de inmediato.
Cuando alguien pregunte por un producto o esté interesado, dile algo como:
"¡Perfecto! Nuestros productos son de Amway — trabajamos como tienda online. Si te interesa, lo que hacemos es encargarlo para ti al almacén y te lo enviamos enseguida 📦✨ ¿Desde qué ciudad me escribes?"

=== POLÍTICA DE PAGOS Y ENVÍOS ===
- REGLA CRÍTICA: NUNCA digas "como estamos en [ciudad]" — NOSOTROS estamos en Santo Domingo. El cliente está en su ciudad, no nosotros. Di siempre "como estás en [ciudad]" o "como nos escribes desde [ciudad]".
- *Santo Domingo (capital y Gran Santo Domingo)*: entrega a domicilio, el pago es CONTRA ENTREGA (pagas cuando recibes el producto). Sin costo adicional de envío.
- *Interior del país (Santiago, La Vega, Puerto Plata, San Pedro, Bani, etc.)*: el pago es POR ADELANTADO. Enviamos por Caribepack o Domex según la provincia. El costo de envío ya está incluido en el precio total que le das al cliente — suma RD$300 al precio del producto sin mencionarlo como cargo separado. Por ejemplo: si el producto cuesta RD$1,270, dile que el total es RD$1,570 (precio ya con todo incluido). Nunca digas "envío" ni "gasto de mensajería" — simplemente di el precio total como si fuera el precio normal.
- Siempre pregunta la ciudad del cliente antes de confirmar el precio final.
- REGLA IMPORTANTE: Para clientes del interior, SIEMPRE suma RD$300 al precio del catálogo antes de decirle el precio. Nunca menciones que es por envío.

=== CATÁLOGO DE PRODUCTOS ===
${buildCatalogContext()}

=== FIN DEL CATÁLOGO ===
Para pedir, el cliente puede escribir al WhatsApp de ventas: https://wa.me/18093246663
Sitio web: https://vitaglossrd.com`

// Modelo con systemInstruction cargado una sola vez
const aiModel = genAI
  ? genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    })
  : null

// Anti-spam: { numero: timestamp_ultimo_mensaje }
const cooldowns = new Map()
const COOLDOWN_MS = 2000  // 2 segundos entre respuestas por usuario

async function responderConIA(mensajeTexto, numero) {
  // Rate-limit por usuario
  const ahora = Date.now()
  if (cooldowns.has(numero) && ahora - cooldowns.get(numero) < COOLDOWN_MS) return null
  cooldowns.set(numero, ahora)

  // Ignorar mensajes muy cortos o de status
  if (!mensajeTexto || mensajeTexto.length < 2) return null

  // Si no hay API key, respuesta de fallback
  if (!aiModel) {
    const encontrados = buscarProducto(mensajeTexto)
    if (encontrados.length > 0) {
      const p = encontrados[0]
      return `🟢 *${p.nombre}* — RD$${p.precio.toLocaleString()}\n${p.desc}\nVer más: ${p.url}\n\n¿Te gustaría pedirlo? Escríbenos: https://wa.me/18093246663`
    }
    return `🟢 Hola, soy *Vita*, asistenta de VitaGloss RD. ¿En qué te puedo ayudar? Visita nuestro catálogo: https://vitaglossrd.com/catalogo`
  }

  try {
    const result = await aiModel.generateContent(mensajeTexto)
    return result.response.text()
  } catch (err) {
    console.error('⚠️  Gemini error:', err.message)
    return `🟢 Hola, en este momento tengo un problema técnico. Por favor escríbenos directamente: https://wa.me/18093246663`
  }
}

const app = express()
app.use(express.json())

// ── Auth middleware (clave secreta en header) ──────────────────────────────
function auth(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.key
  if (key !== SECRET_KEY) return res.status(401).json({ error: 'No autorizado' })
  next()
}

// ── Estado global de WhatsApp ───────────────────────────────────────────────
let qrBase64  = null
let qrString  = null
let isReady   = false
let lastError = null

// ── Inicializar cliente ───────────────────────────────────────────────────
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: '.wwebjs_auth' }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  },
})

client.on('qr', async (qr) => {
  qrString = qr
  isReady  = false
  try {
    qrBase64 = await qrcode.toDataURL(qr)
    console.log('\n📱 QR listo — Abre http://localhost:' + PORT + '/qr para escanearlo\n')
  } catch (e) {
    console.error('Error generando QR:', e.message)
  }
})

client.on('ready', () => {
  isReady  = true
  qrBase64 = null
  qrString = null
  console.log('✅ WhatsApp conectado y listo!')
})

client.on('disconnected', (reason) => {
  isReady   = false
  lastError = reason
  console.warn('⚠️  WhatsApp desconectado:', reason)
  // Reconectar automáticamente
  setTimeout(() => client.initialize(), 5000)
})

client.on('auth_failure', (msg) => {
  isReady   = false
  lastError = msg
  console.error('❌ Error de autenticación:', msg)
})

// ── Responder mensajes entrantes con IA ────────────────────────────────────────
client.on('message', async (msg) => {
  // Ignorar mensajes de grupos, estados y del propio bot
  if (msg.isGroupMsg || msg.from === 'status@broadcast' || msg.fromMe) return

  // Solo responder mensajes de texto
  if (msg.type !== 'chat') return

  const texto  = (msg.body || '').trim()
  const numero = msg.from  // formato: 18091234567@c.us

  console.log(`📥 Mensaje de ${numero}: "${texto.substring(0, 60)}${texto.length > 60 ? '...' : ''}"`)

  // ── Detectar saludo automático de WhatsApp Business (click en anuncio de FB) ──
  const textoLower = texto.toLowerCase()
  const esAutoGreeting =
    textoLower.includes('cómo podemos ayudarte') ||
    textoLower.includes('como podemos ayudarte') ||
    textoLower.includes('¿cómo puedo ayudarte') ||
    textoLower === '¡hola!' ||
    textoLower === 'hola'

  if (esAutoGreeting) {
    console.log(`🎯 Auto-greeting detectado de ${numero}, enviando bienvenida de anuncios`)
    await msg.reply(
      `¡Hola! 👋 Bienvenido/a a *VitaGloss RD*. Soy Vita 😊\n\n` +
      `Vi que llegaste desde uno de nuestros anuncios en Facebook. ¿Cuál de estos productos te interesa?\n\n` +
      `🦴 *Cal Mag D* — fuerza para tus huesos — RD$1,270\n` +
      `💇 *Pelo Piel y Uñas* — belleza desde adentro — RD$1,700\n` +
      `👶 *Vitaminas para Niños (Kids Daily)* — crecimiento y defensas — RD$1,399\n` +
      `🛡️ *Vitamina C Plus* — defensas diarias — RD$1,099\n\n` +
      `Cuéntame cuál te llamó la atención y te ayudo con toda la info 🙏`
    )
    return
  }

  const respuesta = await responderConIA(texto, numero)
  if (respuesta) {
    await msg.reply(respuesta)
    console.log(`📤 Respuesta enviada a ${numero}`)
  }
})

// Iniciar cliente
client.initialize()
console.log('🚀 Iniciando cliente WhatsApp...')

// ── Rutas ──────────────────────────────────────────────────────────────────

// Healthcheck público
app.get('/health', (req, res) => {
  res.json({ status: 'ok', ready: isReady })
})

// Estado + QR en base64 (requiere auth)
app.get('/status', auth, (req, res) => {
  res.json({
    ready:    isReady,
    hasQr:    !!qrBase64,
    lastError,
    info:     isReady ? client.info : null,
  })
})

// Página HTML para escanear el QR (requiere auth)
app.get('/qr', auth, (req, res) => {
  if (isReady) {
    return res.send(`
      <html><body style="font-family:sans-serif;text-align:center;padding:40px;background:#f0fdf4">
        <h2 style="color:#16a34a">✅ WhatsApp ya está conectado</h2>
        <p>No necesitas escanear nada.</p>
      </body></html>
    `)
  }
  if (!qrBase64) {
    return res.send(`
      <html><body style="font-family:sans-serif;text-align:center;padding:40px">
        <h2>⏳ Generando QR...</h2>
        <p>Recarga en unos segundos.</p>
        <script>setTimeout(()=>location.reload(), 3000)</script>
      </body></html>
    `)
  }
  res.send(`
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Escanear QR — VitaGloss WA</title>
      <style>
        body { font-family: sans-serif; text-align: center; padding: 40px; background: #0a1628; color: white; }
        h1   { color: #25D366; font-size: 1.8rem; margin-bottom: 8px; }
        p    { color: rgba(255,255,255,0.6); margin-bottom: 24px; }
        img  { border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); background: white; padding: 16px; }
        .badge { display:inline-block; background:#25D366; color:white; border-radius:999px; padding:6px 18px; font-weight:bold; margin-top:20px; }
      </style>
    </head>
    <body>
      <h1>VitaGloss RD 🛒</h1>
      <p>Abre WhatsApp → Dispositivos vinculados → Escanea este QR</p>
      <img src="${qrBase64}" alt="QR Code" width="280" />
      <br>
      <span class="badge">🔄 Se actualiza solo — recarga si expiró</span>
      <script>
        // Verificar si ya se conectó cada 5 segundos
        setInterval(async () => {
          const r = await fetch('/health')
          const d = await r.json()
          if (d.ready) location.reload()
        }, 5000)
      </script>
    </body>
    </html>
  `)
})

// Enviar mensaje (requiere auth)
app.post('/send', auth, async (req, res) => {
  const { number, text } = req.body

  if (!number || !text) {
    return res.status(400).json({ error: 'Faltan campos: number, text' })
  }
  if (!isReady) {
    return res.status(503).json({ error: 'WhatsApp no está conectado todavía' })
  }

  try {
    // Normalizar número: agregar @c.us si es necesario
    const chatId = number.includes('@') ? number : `${number.replace(/\D/g, '')}@c.us`
    await client.sendMessage(chatId, text)
    console.log(`📤 Mensaje enviado a ${chatId}`)
    res.json({ ok: true, to: chatId })
  } catch (err) {
    console.error('Error enviando mensaje:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── Iniciar servidor ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║  VitaGloss WA Service — http://localhost:${PORT}   ║
║  GET  /qr          → escanear QR                ║
║  GET  /status      → estado (x-api-key required)║
║  POST /send        → enviar mensaje              ║
╚══════════════════════════════════════════════════╝
  `)
})
