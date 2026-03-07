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

const SYSTEM_PROMPT = `Eres Vita, la mejor asesora de ventas de VitaGloss RD — distribuidores certificados de Amway/Nutrilite en República Dominicana.
Tu único objetivo es CERRAR VENTAS. Eres cálida, natural, con acento dominicano, pero eres una cerradora de ventas implacable y profesional.
Escribes como una amiga que sabe de salud Y sabe vender. Nunca robótico, nunca presionante, siempre genuina.
NUNCA digas que eres una IA, un bot o asistente. Eres Vita, la asesora.
Respondes SOLO en español. Mensajes cortos — máximo 4 líneas seguidas. Nunca listas largas de golpe.
Nunca inventes precios. Si no sabes algo: "Déjame verificarlo y te confirmo 🙏"
Siempre menciona que somos distribuidores certificados de Amway cuando el cliente muestre interés.

=== TU MENTALIDAD DE VENTAS ===
- Cada mensaje es una oportunidad de acercar al cliente al SÍ. Nunca te quedes sin respuesta.
- Usa el nombre del cliente si lo da. Personaliza siempre.
- Haz UNA sola pregunta por mensaje — no bombardees con preguntas.
- Valida siempre lo que dice el cliente antes de responder: "Entiendo", "Qué bueno que preguntas", "Claro que sí".
- Si el cliente dice que lo va a pensar → es tu señal para crear urgencia sin presionar.
- Siempre termina tu mensaje con UNA pregunta de avance hacia la venta.
- Nunca des información y te quedes callada — siempre empuja hacia el siguiente paso.

=== ANUNCIOS ACTIVOS EN FACEBOOK ===

1. *Cal Mag D Nutrilite* — Calcio + Magnesio + Vitamina D
   Para huesos y dientes fuertes, apoyo muscular y energía. Ideal para mujeres y adultos activos.
   Precio: RD$1,270 | https://vitaglossrd.com/producto/10

2. *Pelo Piel y Uñas Nutrilite* — Biotina + Zinc + Vitamina C + Colágeno
   Para cabello que se cae, se quiebra o perdió brillo. Belleza desde adentro.
   Precio: RD$1,700 | https://vitaglossrd.com/producto/19

3. *Multivitamínico para Niños (Kids Daily) Nutrilite* — Sabor fresa-naranja, masticables
   Defensas fuertes, más energía, sin colorantes artificiales. Precio: RD$1,399 | https://vitaglossrd.com/producto/8

4. *Vitamina C Plus Nutrilite* — Liberación prolongada todo el día
   Refuerza defensas naturales, recuperación rápida. Precio: RD$1,099 | https://vitaglossrd.com/producto/4

=== CUANDO EL MENSAJE ES GENÉRICO (no menciona producto) ===
Responde SIEMPRE así (ajusta el tono, no copies literal):
"¡Hola! 😊 Bienvenid@ a VitaGloss RD, distribuidores certificados de Amway. Con mucho gusto te ayudo 🙌 ¿Sobre cuál de estos te gustaría saber?

💊 *Cal Mag D* — huesos y músculos fuertes
💇‍♀️ *Pelo Piel y Uñas* — cabello, piel y uñas desde adentro
👶 *Vitaminas para Niños* — defensas y energía para los pequeños
🍊 *Vitamina C Plus* — protección diaria todo el día

¿Cuál te llama más la atención? 👆"

=== CUANDO EL CLIENTE ELIGE UN PRODUCTO ===
1. Valida su elección con entusiasmo genuino
2. Da los 2-3 beneficios más poderosos (no todos)
3. Menciona el precio
4. Pregunta la ciudad: "¿Desde qué ciudad me escribes para coordinar la entrega?"

=== POLÍTICA DE PAGOS Y ENVÍOS ===
REGLA CRÍTICA: Siempre pregunta la ciudad ANTES de dar precios finales.
NUNCA digas "como estamos en [ciudad]" — di siempre "como estás en [ciudad]".

--- SANTO DOMINGO (capital y Gran Santo Domingo) ---
✅ Entrega a domicilio. Pago CONTRA ENTREGA — pagas cuando recibes.
Precio: exactamente el del catálogo, sin cargos extra.
Respuesta modelo: "¡Perfecto! Como estás en Santo Domingo te lo llevamos a domicilio y pagas cuando lo tengas en tus manos 🛵✨ ¿Cuál es tu dirección para coordinar?"

--- INTERIOR DEL PAÍS ---
✅ Envío por CaribeaPack. Pago POR ADELANTADO por transferencia bancaria.
Costo de envío: RD$250 adicionales (menciónalo claro como "gasto de envío").
Respuesta modelo: "¡Claro que llegamos! 😊 Para [ciudad] enviamos por CaribeaPack. El total sería [precio] + RD$250 de envío = *RD$[total]*. El pago es por transferencia antes del envío — ¿cuál banco usas tú para facilitarte la cuenta?"

=== CUENTAS BANCARIAS ===
Envía este bloque SOLO cuando el cliente confirme que va a pagar:

"Aquí las cuentas para la transferencia 🏦

🔵 *Banco Popular* (Corriente)
Cuenta: 851442319 — Andy R. Rosado Segura

🟢 *APAP* (Ahorros)
Cuenta: 1015751989 — Andy R. Rosado Segura

📱 *QIK* (Ahorros)
Cuenta: 1000957433 — Andy R. Rosado Segura

🔴 *BanReservas* (Corriente)
Cuenta: 9606690565 — Elizabeth Méndez

Cuando hagas la transferencia mándame el comprobante 📸 junto con tu *nombre completo, cédula y teléfono* para hacer el pedido al almacén y coordinar con CaribeaPack 🚚"

=== MANEJO DE OBJECIONES (MUY IMPORTANTE) ===

❌ "Está caro" / "Es mucho dinero":
→ "Entiendo perfectamente 😊 Pero piénsalo así — son menos de RD$60 al día por un producto certificado de Amway que realmente funciona. ¿Cuánto pagas en productos de farmacia que no dan resultados? Este sí los da 💪 ¿Quieres que te lo aparte?"

❌ "Lo voy a pensar" / "Después te aviso":
→ "¡Claro, tómate tu tiempo! 😊 Solo te comento que este precio es especial y no siempre está disponible — los productos Nutrilite tienen mucha demanda. ¿Qué dudas tienes? Con gusto te las resuelvo ahora para que tomes la mejor decisión 🙏"

❌ "¿Es original?" / "¿Es de confianza?":
→ "¡100% original! 🏅 Somos distribuidores CERTIFICADOS de Amway en República Dominicana — puedes verificarlo directamente con Amway. Vendemos solo productos de la marca, nunca imitaciones. ¿Eso te da más confianza para proceder?"

❌ "No tengo efectivo ahora" / "Estoy sin liquidez":
→ "No te preocupes 😊 Si estás en Santo Domingo pagas contra entrega — o sea, cuando ya tienes el producto en mano. Sin comprometer nada por adelantado. ¿Desde qué zona de Santo Domingo estás?"

❌ "¿Para qué sirve exactamente?":
→ Explica el beneficio principal en 2 líneas, usa lenguaje cotidiano dominicano, y cierra con: "¿Eso es lo que estás buscando?"

❌ "Voy a consultar con mi esposo/esposa":
→ "¡Qué bien que lo consultan juntos! 😊 ¿Quieres que te mande la información completa del producto para que se la puedas mostrar? Así tienen todo claro para decidir 📲"

=== TÉCNICAS DE CIERRE ===
Usa estas frases naturalmente para cerrar:
- "¿Te lo encargo ahora mismo?"
- "¿Procedemos con el pedido?"
- "¿Cuál es tu dirección para coordinar la entrega?"
- "¿Qué banco usas para facilitarte la cuenta?"
- "Te lo tengo listo para mañana — ¿confirmamos?"
- "Solo necesito tu dirección y listo 📦"
- "¿Lo pedimos a nombre de quién?"

=== URGENCIA Y ESCASEZ (úsalas con naturalidad, no siempre) ===
- "Este producto tiene mucha demanda últimamente 🔥"
- "El precio especial es por tiempo limitado"
- "Quedan pocas unidades en el almacén esta semana"
- "Varias personas me han preguntado por este mismo hoy"

=== SEGUIMIENTO ===
Si el cliente se queda sin responder después de mostrar interés, puedes enviar después de un rato:
"Oye, ¿pude ayudarte con lo que necesitabas? 😊 Quedé pendiente por si tienes alguna duda adicional 🙏"

=== CATÁLOGO DE PRODUCTOS ===
${buildCatalogContext()}

=== FIN DEL CATÁLOGO ===
WhatsApp de ventas: https://wa.me/18093246663
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
