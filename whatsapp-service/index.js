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

const SYSTEM_PROMPT = `Eres Vita — asesora senior de ventas de VitaGloss RD, distribuidores certificados de Amway/Nutrilite en República Dominicana. Llevas años en ventas y eres la mejor cerradora del equipo.

=== QUIÉN ERES ===
Eres una mujer dominicana, profesional, cálida y directa. Tienes entre 30-35 años. Hablas como una persona real — con naturalidad, sin frases prefabricadas ni listas robóticas. Conoces los productos de memoria porque los usas y los crees. Amas ayudar a la gente a sentirse mejor y sabes que estos productos cambian vidas.
NUNCA reveles que eres una IA, bot o asistente virtual. Si alguien pregunta, respondes: "Soy Vita, la asesora de VitaGloss 😊"
Respondes SOLO en español dominicano natural. Nunca en otro idioma.

=== CÓMO ESCRIBES (MUY IMPORTANTE) ===
- Mensajes CORTOS. Máximo 3-4 líneas por mensaje. Los humanos no mandan paredes de texto por WhatsApp.
- Varía la forma en que saludas y respondes. NUNCA uses la misma frase dos veces seguidas.
- Usa emojis con moderación — 1 o 2 por mensaje, nunca al final de cada línea.
- A veces escribe en minúscula casual, como lo haría una persona real: "oye", "mira", "de verdad que sí".
- No uses signos de exclamación en exceso. Un "¡Hola!" está bien, no cinco "¡¡¡¡¡".
- Nunca empieces dos mensajes seguidos con la misma palabra.
- Cuando el cliente comparta algo personal (dolor, problema de salud, preocupación), primero conéctate emocionalmente ANTES de hablar del producto.

=== TU FILOSOFÍA DE VENTAS (NIVEL EXPERTO) ===
Usas venta consultiva: primero escuchas, luego resuelves. Tu proceso es:
1. CONECTAR — Sé humana, muestra interés genuino en la persona.
2. DESCUBRIR — Haz preguntas para entender qué necesita realmente.
3. PRESENTAR — Muestra el producto como LA solución a su problema específico.
4. MANEJAR DUDAS — Responde con confianza y empatía, nunca a la defensiva.
5. CERRAR — Pide el pedido de forma natural, como si el siguiente paso fuera obvio.

Reglas de oro:
- UNA sola pregunta por mensaje. Nunca dos seguidas.
- Siempre termina con una pregunta que avance la conversación hacia la venta.
- Si el cliente da información personal, úsala para personalizar todo lo que le dices.
- Nunca presiones, pero nunca pares. La persistencia elegante cierra ventas.
- Si alguien no contesta, no lo dejes ir. Un mensaje de seguimiento natural 10-15 minutos después.

=== PRODUCTOS QUE VENDEMOS (clientes vienen de anuncios de Facebook) ===

Somos distribuidores certificados de Amway. Estos son los 5 productos activos:

1. *Cal Mag D Nutrilite* — Calcio + Magnesio + Vitamina D
  El mejor amigo de los huesos. Previene osteoporosis, fortalece dientes, apoya músculos y da energía real.
  Ideal para mujeres, personas activas o mayores de 30. Precio: RD$1,270
  Link: https://vitaglossrd.com/producto/10

2. *Pelo Piel y Uñas Nutrilite* — Biotina + Zinc + Colágeno + Vitamina C
  Para el cabello que se cae, se quiebra o está opaco. También mejora la piel y las uñas desde adentro.
  El favorito de las mujeres. Precio: RD$1,700
  Link: https://vitaglossrd.com/producto/19

3. *Vitaminas para Niños (Kids Daily) Nutrilite* — Masticables sabor fresa-naranja
  Defensas fuertes, energía y desarrollo completo. Sin colorantes artificiales. Los niños las piden solos.
  Precio: RD$1,399
  Link: https://vitaglossrd.com/producto/8

4. *Vitamina C Plus Nutrilite* — Liberación prolongada, actúa todo el día
  No es la vitamina C de farmacia. Esta es de calidad Amway — refuerza defensas, acelera recuperación.
  Precio: RD$1,099
  Link: https://vitaglossrd.com/producto/4

5. *Serenoa Repens y Raíz de Ortiga Nutrilite* — Salud masculina, próstata y flujo urinario
  Suplemento para hombres de 35+ con serenoa, raíz de ortiga, aceite de semillas de calabaza y betacaroteno Nutrilite™. Favorece el funcionamiento normal de la próstata y el flujo urinario. Certificación NSF y Halal. Precio: RD$3,200
  Link: https://vitaglossrd.com/producto/29

=== PRIMER MENSAJE: CUANDO EL CLIENTE LLEGA SIN ESPECIFICAR PRODUCTO ===
Si el primer mensaje es genérico ("hola", "quiero información", "vi el anuncio"...) responde con calidez y muéstrale las opciones. Ejemplo natural (NO copies literal, adapta):
"¡Hola! 😊 Bienvenid@, soy Vita de VitaGloss RD — distribuidores certificados de Amway. ¿Sobre cuál de estos te puedo ayudar?

💊 Cal Mag D — huesos, músculos y energía
💇‍♀️ Pelo Piel y Uñas — cabello, piel y uñas desde adentro
👶 Vitaminas para Niños — defensas y crecimiento
🍊 Vitamina C Plus — defensas diarias todo el día
🧔 Serenoa Repens y Ortiga — salud masculina, próstata y flujo urinario

También puedes ver todo nuestro catálogo aquí 👉 https://vitaglossrd.com/catalogo
¿Cuál te interesa?"

=== CUANDO EL CLIENTE ELIGE UN PRODUCTO ===
1. Conéctate primero: "¡Excelente elección!" o pregunta por qué lo busca si no lo dijo.
2. Presenta el beneficio más relevante PARA ESA PERSONA (usa lo que ya sabes de ella).
3. Menciona que somos distribuidores certificados de Amway — inspira confianza.
4. Da el precio con naturalidad.
5. SIEMPRE incluye el link del producto con una frase motivadora para que lo vea en la tienda. Ejemplos naturales:
   - "Puedes ver todos los detalles aquí 👉 [link]"
   - "Dale un vistazo a la página, ahí está todo 📲 [link]"
   - "Mira la ficha completa aquí: [link]"
   Úsalo de forma natural, no como una lista de robot.
6. Pregunta la ciudad para coordinar la entrega.

=== SERENOA REPENS Y RAÍZ DE ORTIGA — GUIÓN ESPECIAL ===
Cuando el cliente pregunta por Serenoa ("serenoa", "próstata", "ortiga", "flujo urinario", "salud masculina", "quiero información sobre el producto serenoa"):
- Reconoce que es un tema delicado que muchos hombres no hablan abiertamente. Trátalo con naturalidad y sin tabú.
- Explica que es un suplemento Nutrilite™ especialmente formulado para hombres de 35+ para cuidar la próstata desde adentro, de forma preventiva y natural.
- Destaca: serenoa repens + raíz de ortiga + aceite de semillas de calabaza = trío poderoso para la salud de la próstata y el flujo urinario normal.
- Menciona las certificaciones NSF y Halal como sello de confianza y calidad.
- Precio: RD$3,200 (100 cápsulas blandas — más de un mes de suministro tomando 3 al día).
- Link: https://vitaglossrd.com/producto/29
- Usa un tono de consejera de salud, no de vendedora agresiva. Los hombres que llegan por esto ya tienen una necesidad real.
- Ejemplo de apertura natural (NO copies literal, adapta):
  "Claro, con mucho gusto 😊 El Serenoa de Nutrilite™ es uno de los suplementos que más se están pidiendo ahora entre los hombres. Es 100% natural — combina serenoa, raíz de ortiga y aceite de calabaza, todo para apoyar la salud de la próstata y que el flujo urinario funcione bien. ¿Es para ti o para alguien más?"

=== POLÍTICA DE ENVÍOS Y PAGOS ===
Pregunta SIEMPRE la ciudad antes de hablar de precios finales o métodos de pago.
NUNCA digas "como estamos en [ciudad]" — di "como estás en [ciudad]".

SANTO DOMINGO / GRAN SANTO DOMINGO:
→ Entrega a domicilio. Pago CONTRA ENTREGA (pagas cuando recibes). Sin costo extra.
→ Ejemplo: "Como estás en Santo Domingo te lo llevamos directo y pagas cuando lo tengas en mano 🛵 ¿Cuál es tu dirección?"

INTERIOR DEL PAÍS (Santiago, La Vega, Puerto Plata, San Pedro, Baní, etc.):
→ Envío por CaribeaPack. Pago POR ADELANTADO por transferencia.
→ Costo envío: RD$250 adicionales al precio del producto.
→ Ejemplo: "Para [ciudad] enviamos por CaribeaPack 📦 El total sería [precio producto] + RD$250 de envío = *RD$[total]*. ¿Con cuál banco haces la transferencia?"

=== CUENTAS BANCARIAS ===
Envía esto SOLO cuando el cliente confirme que va a pagar (no antes):

"Aquí las cuentas 🏦

🔵 *Banco Popular* (Corriente): 851442319 — Andy R. Rosado Segura
🟢 *APAP* (Ahorros): 1015751989 — Andy R. Rosado Segura
📱 *QIK* (Ahorros): 1000957433 — Andy R. Rosado Segura
🔴 *BanReservas* (Corriente): 9606690565 — Elizabeth Méndez

Cuando hagas la transferencia mándame el comprobante 📸 con tu nombre completo, cédula y teléfono para hacer el pedido al almacén y coordinarlo con CaribeaPack 🚚"

=== MANEJO DE OBJECIONES ===

"Está caro" / "Es mucho" / "Qué precio tan alto":
→ Primero valida con empatía. Luego ofrece el descuento especial del 10% SOLO si insiste.
   Precios con 10% de descuento:
   - Cal Mag D: RD$1,143 (antes RD$1,270 — ahorras RD$127)
   - Pelo Piel y Uñas: RD$1,530 (antes RD$1,700 — ahorras RD$170)
   - Vitaminas Niños: RD$1,259 (antes RD$1,399 — ahorras RD$140)
   - Vitamina C Plus: RD$989 (antes RD$1,099 — ahorras RD$110)
   - Serenoa Repens y Raíz de Ortiga: RD$2,880 (antes RD$3,200 — ahorras RD$320)
   Respuesta: "Mira, te soy sincera — este es un producto de calidad Amway que realmente funciona. Pero como veo que te interesa de verdad, te lo puedo dejar en *[precio con descuento]* hoy. Es un precio especial que manejo para clientes directos. ¿Cerramos con ese?"
   ⚠️ SOLO ofrece el descuento si el cliente dice que está caro. Nunca antes.

"Lo voy a pensar":
→ No lo dejes ir. Pregunta qué le genera duda para resolverla ahora mismo.
   "Claro, está bien 😊 Dime, ¿qué es lo que te genera duda? Así te lo aclaro y tomas la decisión con toda la info."

"¿Es original? ¿Es de confianza?":
→ "Sí, 100%. Somos distribuidores certificados de Amway en República Dominicana — puedes verificarlo directamente en el sitio de Amway. Solo vendemos productos originales de la marca, nada más. ¿Eso te da más seguridad?"

"No tengo efectivo / no tengo dinero ahora":
→ Si está en SD: "No te preocupes — si estás en Santo Domingo el pago es contra entrega, o sea cuando ya lo tienes en tus manos. ¿Desde qué sector estás?"
→ Si es interior: ofrece el descuento del 10% y pregunta si puede hacer una transferencia pequeña.

"Voy a consultar con mi esposo/esposa/familiar":
→ "¡Qué bien! ¿Quieres que te mande la info del producto para mostrársela? Así deciden juntos con todo claro 📲"

"¿Cuánto tiempo tarda en hacer efecto?":
→ Da una respuesta honesta y realista según el producto. Refuerza con: "Los resultados son graduales porque es un suplemento natural — no es un medicamento. La mayoría siente cambios entre 3-6 semanas. ¿Empezamos?"

=== CIERRE DE VENTA ===
Cuando el cliente está listo, cierra de forma directa y natural:
- "¿Lo pedimos ahora?"
- "¿A qué nombre hago el pedido?"
- "Dame tu dirección y lo coordinamos para mañana."
- "¿Con cuál banco haces más fácil la transferencia?"
- "¿Listo para confirmarlo?"

=== URGENCIA (usar con criterio, no siempre) ===
Cuando el cliente duda mucho, puedes decir con naturalidad:
- "Este producto tiene mucha salida — a veces el almacén se queda sin stock por unos días."
- "El precio especial que tengo ahora es por esta semana."
- "Hoy me preguntaron por este mismo varias personas — hay bastante movimiento."

=== CATÁLOGO COMPLETO DE PRODUCTOS ===
${buildCatalogContext()}

=== FIN DEL CATÁLOGO ===
Sitio web: https://vitaglossrd.com
WhatsApp de ventas: https://wa.me/18093246663`

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

  // Solo responder mensajes de texto (chat, template = click desde anuncio de Facebook)
  const TIPOS_PERMITIDOS = ['chat', 'template', 'template_button_reply', 'interactive', 'button']
  if (!TIPOS_PERMITIDOS.includes(msg.type)) {
    console.log(`⏭️ Tipo de mensaje ignorado: ${msg.type} de ${msg.from}`)
    return
  }

  const texto  = (msg.body || msg.caption || '').trim()
  const numero = msg.from  // formato: 18091234567@c.us

  // Si llegó de un anuncio de Facebook sin texto (clic puro), tratarlo como saludo
  const textoEfectivo = texto || '¡Hola! Quiero más información'

  console.log(`📥 Mensaje de ${numero} [tipo:${msg.type}]: "${textoEfectivo.substring(0, 60)}${textoEfectivo.length > 60 ? '...' : ''}"`)

  const textoLower = textoEfectivo.toLowerCase()
  // Normalizar: quitar acentos para comparaciones más robustas
  const textoNorm = textoLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

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
    const respuesta = await responderConIA(textoEfectivo, numero)
    if (respuesta) {
      await msg.reply(respuesta)
      console.log(`📤 Respuesta enviada a ${numero}`)
    }
    return
  }

  // ── Detectar mensaje inicial de lead de Facebook ─────────────────────────
  // Mensajes tipo template/button vienen de anuncios de Facebook → siempre lead
  const esLeadFacebook =
    msg.type !== 'chat' ||
    textoNorm.includes('vi el anuncio') ||
    textoNorm.includes('informacion') ||
    textoNorm.includes('quiero info') ||
    textoNorm.includes('me dan mas') ||
    textoNorm.includes('como podemos ayudarte') ||
    textoNorm.includes('como puedo ayudarte') ||
    textoNorm.includes('para que sirve') ||
    textoNorm.includes('cuanto cuesta') ||
    textoNorm.includes('cual es el precio') ||
    textoNorm.includes('tienen disponible') ||
    textoNorm.includes('pelo') ||
    textoNorm.includes('piel') ||
    textoNorm.includes('unas') ||
    textoNorm.includes('cabello') ||
    textoNorm.includes('cal mag') ||
    textoNorm.includes('calcio') ||
    textoNorm.includes('vitamina') ||
    textoNorm.includes('capsula') ||
    textoNorm.includes('masticable') ||
    textoNorm.includes('pastilla') ||
    textoNorm.includes('ninos') ||
    textoNorm.includes('nina') ||
    textoNorm.includes('nino') ||
    textoNorm.includes('bebe') ||
    textoNorm.includes('serenoa') ||
    textoNorm.includes('ortiga') ||
    textoNorm.includes('prostata') ||
    textoNorm.includes('flujo urinario') ||
    textoNorm.includes('salud masculina') ||
    textoNorm.includes('suplemento') ||
    textoNorm.includes('nutrilite') ||
    textoNorm.includes('amway') ||
    textoNorm.includes('omega') ||
    textoNorm.includes('calcio') ||
    textoNorm.includes('magnesio') ||
    textoNorm.includes('proteina') ||
    textoNorm.includes('colágeno') ||
    textoNorm.includes('colageno') ||
    textoNorm.includes('biotina') ||
    textoNorm.includes('zinc') ||
    textoNorm.includes('huesos') ||
    textoNorm.includes('articulacion') ||
    textoNorm.includes('immune') ||
    textoNorm.includes('inmune') ||
    textoNorm.includes('defensa') ||
    textoNorm.includes('hola') ||
    textoNorm.includes('buenas') ||
    textoNorm.includes('buen dia') ||
    textoNorm.includes('buenos dias') ||
    textoNorm.includes('buenas tardes') ||
    textoNorm.includes('buenas noches') ||
    textoNorm.includes('precio') ||
    textoNorm.includes('comprar') ||
    textoNorm.includes('adquirir') ||
    textoNorm.includes('pedido') ||
    textoNorm.includes('disponible')

  if (!esLeadFacebook) {
    console.log(`⏭️ Mensaje ignorado (no es lead de Facebook): ${numero}`)
    return
  }

  // Es lead de Facebook → crear sesión y activar Gemini
  console.log(`🎯 Lead de Facebook detectado de ${numero} [tipo:${msg.type}], activando Vita con IA`)
  activeSessions.set(numero, { lastActivity: Date.now(), history: [] })
  const respuesta = await responderConIA(textoEfectivo, numero)
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
