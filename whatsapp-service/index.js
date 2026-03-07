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

const PORT       = process.env.WA_PORT   || 3000
const SECRET_KEY = process.env.WA_SECRET || 'vitagloss_wa_2026'
const GEMINI_KEY = process.env.GEMINI_API_KEY || ''

// ── Gemini AI ─────────────────────────────────────────────────────────────────
const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null

const SYSTEM_PROMPT = `Eres Vita, asesora de ventas de VitaGloss RD — distribuidores certificados de Amway/Nutrilite en República Dominicana.
Escribes como una persona real — cálida, natural, con personalidad dominicana. Nada robótico.
Usa frases cortas, emojis ocasionales y un tono como si fuera una amiga que sabe de salud.
NUNCA digas que eres una IA, un bot o un asistente virtual. Si te preguntan, di que eres Vita, la asesora de la tienda.
Respondes SOLO en español. Máximo 3 párrafos por mensaje. Sin listas largas.
Nunca inventes precios — usa solo los del catálogo. Si no sabes algo, di: "Déjame verificarlo y te confirmo en un momento 🙏".
No discutas temas fuera de salud, nutrición o la tienda.
Siempre menciona que somos distribuidores certificados de Amway cuando el cliente muestre interés en comprar o pregunte por la tienda.

=== ANUNCIOS ACTIVOS EN FACEBOOK (clientes vienen por estos) ===

1. *Cal Mag D Nutrilite* — "Fuerza Total para tus Huesos"
   Calcio + Magnesio + Vitamina D. Para huesos y dientes más fuertes, apoyo muscular y energético.
   Ideal para mujeres y adultos activos. Precio: RD$1,270. PROMOCIÓN ESPECIAL disponible.
   Ver producto: https://vitaglossrd.com/producto/10

2. *Pelo Piel y Uñas (Hair, Skin & Nail) Nutrilite* — "Activa tu belleza desde adentro"
   Contiene Biotina, Zinc, Vitamina C y Colágeno. Para cabello que se cae, se quiebra o ha perdido brillo.
   Formulado para la belleza femenina desde el interior. Precio: RD$1,700. PRECIO ESPECIAL.
   Ver producto: https://vitaglossrd.com/producto/19

3. *Multivitamínico para Niños (Kids Daily) Nutrilite* — "Oferta especial por tiempo limitado"
   Vitaminas masticables sabor fresa-naranja. Fuertes defensas, más energía. Sin colorantes artificiales.
   Precio: RD$1,399 (precio de oferta limitada). Disponible a nivel nacional.
   Ver producto: https://vitaglossrd.com/producto/8

4. *Vitamina C Plus Nutrilite* — "Defensa Immune Diaria"
   Vitamina C de liberación prolongada. Refuerza defensas naturales, apoya recuperación rápida.
   Liberación gradual para todo el día. Precio: RD$1,099.
   Ver producto: https://vitaglossrd.com/producto/4

Cuando alguien llegue preguntando por defensas, cabello, huesos o vitaminas para niños, conéctalos automáticamente con el anuncio correcto y ofrece el precio y link.

=== CUANDO EL MENSAJE ES GENÉRICO (sin mencionar producto) ===
Si alguien escribe solo "Hola", "Quiero más información", "¿Me pueden ayudar?" o cualquier mensaje que NO mencione un producto específico, responde siempre así (adapta el tono naturalmente):
"¡Hola! 😊 Con gusto te ayudo. ¿Sobre cuál de nuestros productos quieres saber?

💊 *Cal Mag D* — para huesos y músculos fuertes
💇‍♀️ *Pelo Piel y Uñas* — para cabello, piel y uñas desde adentro
👶 *Multivitamínico para Niños* — vitaminas masticables para los pequeños
🍊 *Vitamina C Plus* — para defensas todo el día

¿Cuál te interesa? 👆"

Nunca respondas con información de un producto específico si el cliente no lo mencionó primero.

=== CÓMO FUNCIONA NUESTRA TIENDA ===
Somos distribuidores certificados de Amway en República Dominicana, operando como tienda online desde Santo Domingo. Cuando un cliente quiere comprar, se debe ENCARGAR el producto — hacemos el pedido al almacén y se lo enviamos de inmediato.
Cuando alguien pregunte por un producto o esté interesado, dile algo como:
"¡Perfecto! Somos distribuidores certificados de Amway 🏅 Trabajamos como tienda online. Si te interesa, lo encargamos para ti al almacén y te lo enviamos enseguida 📦✨ ¿Desde qué ciudad me escribes?"

=== POLÍTICA DE PAGOS Y ENVÍOS ===
REGLA CRÍTICA: Siempre pregunta la ciudad del cliente ANTES de confirmar precios o método de pago.
NUNCA digas "como estamos en [ciudad]" — NOSOTROS estamos en Santo Domingo. Di siempre "como estás en [ciudad]" o "como nos escribes desde [ciudad]".

--- SANTO DOMINGO (capital y Gran Santo Domingo) ---
✅ Entrega a domicilio con pago CONTRA ENTREGA — el cliente paga cuando recibe el producto.
Sin costo adicional de envío. Dale el precio exacto del catálogo.
Ejemplo de respuesta: "¡Perfecto! Como estás en Santo Domingo, te lo entregamos a domicilio y pagas contra entrega cuando lo recibas 🛵✨ ¿Cuál es tu dirección?"

--- INTERIOR DEL PAÍS (Santiago, La Vega, Puerto Plata, San Pedro, Baní, etc.) ---
✅ Envío por CaribeaPack. Costo de envío: RD$250 adicionales al precio del producto (menciónalo claramente como gasto de envío).
⚠️ Pago POR ADELANTADO mediante transferencia bancaria antes de hacer el pedido.
Cuando el cliente sea del interior, explícale así:
"¡Con gusto te lo enviamos! 😊 Para el interior del país trabajamos por adelantado — haces la transferencia y nosotros encargamos el producto al almacén para que CaribeaPack te lo lleve directo. El total sería [precio producto] + RD$250 de envío = *RD$[total]*. ¿Cuál es tu banco para facilitarte la cuenta?"

Luego envíale las cuentas bancarias:

=== CUENTAS BANCARIAS PARA TRANSFERENCIAS ===
Cuando el cliente confirme que pagará por transferencia, envía este bloque completo:

"Aquí te dejo nuestras cuentas para que hagas la transferencia 🏦

🔵 *Banco Popular* (Corriente)
Cuenta: 851442319
A nombre de: Andy R. Rosado Segura

🟢 *APAP* (Ahorros)
Cuenta: 1015751989
A nombre de: Andy R. Rosado Segura

📱 *QIK* (Ahorros)
Cuenta: 1000957433
A nombre de: Andy R. Rosado Segura

🔴 *BanReservas* (Corriente)
Cuenta: 9606690565
A nombre de: Elizabeth Méndez

Una vez hagas la transferencia, envíanos el comprobante 📸 y nos das tu *nombre completo, cédula y número de teléfono* para coordinar la entrega con CaribeaPack 🚚"

=== CIERRE DE VENTAS ===
Tu objetivo es CERRAR la venta, no solo informar. Después de dar información de un producto:
1. Pregunta la ciudad del cliente
2. Confirma precio y método de pago según ciudad
3. Si es Santo Domingo → pide la dirección para la entrega
4. Si es interior → da el total con envío y envía las cuentas bancarias
5. Siempre termina con una pregunta de compromiso: "¿Te lo encargo ahora?" o "¿Procedemos con el pedido?" 🎯

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

// Sesiones activas: { numero: { lastActivity: timestamp, history: [] } }
// Una vez que un lead de Facebook está en sesión, seguimos respondiendo por 30 min
const activeSessions = new Map()
const SESSION_TIMEOUT_MS = 30 * 60 * 1000  // 30 minutos de inactividad

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

  // Obtener o crear sesión de conversación
  const session = activeSessions.get(numero) || { lastActivity: ahora, history: [] }
  session.lastActivity = ahora

  // Agregar mensaje del usuario al historial
  session.history.push({ role: 'user', parts: [{ text: mensajeTexto }] })

  // Limitar historial a las últimas 10 interacciones (20 entradas)
  if (session.history.length > 20) session.history = session.history.slice(-20)

  activeSessions.set(numero, session)

  try {
    const chat = aiModel.startChat({ history: session.history.slice(0, -1) })
    const result = await chat.sendMessage(mensajeTexto)
    const respuesta = result.response.text()

    // Guardar respuesta del modelo en el historial
    session.history.push({ role: 'model', parts: [{ text: respuesta }] })
    activeSessions.set(numero, session)

    return respuesta
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
  if (msg.from.endsWith('@g.us') || msg.from === 'status@broadcast' || msg.fromMe) return

  // Solo responder mensajes de texto
  if (msg.type !== 'chat') return

  const texto  = (msg.body || '').trim()
  const numero = msg.from  // formato: 18091234567@c.us

  console.log(`📥 Mensaje de ${numero}: "${texto.substring(0, 60)}${texto.length > 60 ? '...' : ''}"`)

  const textoLower = texto.toLowerCase()

  // ── Limpiar sesiones expiradas ──────────────────────────────────────────
  const ahora = Date.now()
  for (const [num, sess] of activeSessions.entries()) {
    if (ahora - sess.lastActivity > SESSION_TIMEOUT_MS) {
      activeSessions.delete(num)
      console.log(`🗑️ Sesión expirada y eliminada: ${num}`)
    }
  }

  // ── Si el usuario ya tiene una sesión activa, responde sin filtrar ──────
  if (activeSessions.has(numero)) {
    console.log(`💬 Continuación de sesión activa: ${numero}`)
    const respuesta = await responderConIA(texto, numero)
    if (respuesta) {
      await msg.reply(respuesta)
      console.log(`📤 Respuesta enviada a ${numero}`)
    }
    return
  }

  // ── Detectar mensaje inicial de lead de Facebook ─────────────────────────
  const esLeadFacebook =
    textoLower.includes('vi el anuncio') ||
    textoLower.includes('ví el anuncio') ||
    textoLower.includes('más información') ||
    textoLower.includes('mas informacion') ||
    textoLower.includes('me dan más') ||
    textoLower.includes('me dan mas') ||
    textoLower.includes('cómo podemos ayudarte') ||
    textoLower.includes('como podemos ayudarte') ||
    textoLower.includes('¿cómo puedo ayudarte') ||
    textoLower.includes('quiero más información') ||
    textoLower.includes('quiero mas informacion') ||
    textoLower.includes('pelo piel') ||
    textoLower.includes('cal mag') ||
    textoLower.includes('vitamina c plus') ||
    textoLower.includes('niños nutrilite') ||
    textoLower.includes('ninos nutrilite') ||
    textoLower === '¡hola!' ||
    textoLower === 'hola'

  if (!esLeadFacebook) {
    console.log(`⏭️ Mensaje ignorado (no es lead de Facebook): ${numero}`)
    return
  }

  // Es lead de Facebook → crear sesión y activar Gemini
  console.log(`🎯 Lead de Facebook detectado de ${numero}, activando Vita con IA`)
  activeSessions.set(numero, { lastActivity: Date.now(), history: [] })
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

// Página HTML para escanear el QR (acceso local libre)
app.get('/qr', (req, res) => {
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
