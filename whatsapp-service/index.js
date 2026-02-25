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

const PORT       = process.env.WA_PORT  || 3002
const SECRET_KEY = process.env.WA_SECRET || 'vitagloss_wa_2026'

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
