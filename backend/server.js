require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth')
const memberRoutes = require('./routes/members')
const leadRoutes = require('./routes/leads')
const saleRoutes = require('./routes/sales')
const dashboardRoutes = require('./routes/dashboard')
const reviewRoutes = require('./routes/reviews')
const orderRoutes = require('./routes/orders')

const app = express()
const PORT = process.env.PORT || 4000

// ── CORS ───────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
  ],
  credentials: true,
}))

// ── Body parser ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))

// ── Rate limiting global ───────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { error: 'Demasiadas peticiones. Intenta de nuevo en 15 minutos.' },
})
app.use('/api', limiter)

// Rate limit más estricto para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos de login. Intenta en 15 minutos.' },
})
app.use('/api/auth', authLimiter)

// ── Rutas ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/members', memberRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/sales', saleRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/orders', orderRoutes)

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── 404 handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// ── Error handler ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  })
})

// ── MongoDB + Start ────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado')
    app.listen(PORT, () => {
      console.log(`🚀 API corriendo en http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ Error conectando MongoDB:', err.message)
    process.exit(1)
  })
