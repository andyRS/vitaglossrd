const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const protect = require('../middleware/auth')
// globalThis.fetch nativo disponible en Node 18+ (aquí Node 24)

// Middleware: solo admins
function adminOnly(req, res, next) {
  if (req.user?.rol !== 'admin') return res.status(403).json({ error: 'Solo administradores' })
  next()
}

// ── Helper: disparar webhook n8n ──────────────────────────────────────────
async function notifyN8n(order) {
  const url = process.env.N8N_WEBHOOK_URL
  if (!url) return

  const payload = {
    orderId:  order._id.toString(),
    nombre:   order.nombre,
    whatsapp: order.whatsapp,
    items:    order.items,
    total:    order.total,
    refCode:  order.refCode,
    source:   order.source,
    fecha:    order.createdAt,
    checkUrl: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/api/orders/${order._id}`,
  }

  try {
    await globalThis.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    })
    await Order.findByIdAndUpdate(order._id, { n8nNotified: true })
  } catch (err) {
    console.warn('⚠️  n8n webhook no alcanzable:', err.message)
  }
}

// ── POST /api/orders — crear pedido desde web ─────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { items, total, nombre, whatsapp, refCode, source } = req.body
    if (!items || !items.length) return res.status(400).json({ error: 'El pedido está vacío' })

    const order = await Order.create({
      items,
      total,
      nombre:   nombre  || 'Cliente web',
      whatsapp: whatsapp || '',
      refCode:  refCode  || '',
      source:   source   || 'web_cart',
    })

    // Disparar n8n en background (no bloquea la respuesta)
    notifyN8n(order)

    res.status(201).json({ ok: true, orderId: order._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al guardar el pedido' })
  }
})

// ── GET /api/orders — listar pedidos (admin) ──────────────────────────────
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { estado, page = 1 } = req.query
    const filter = estado ? { estado } : {}
    const limit = 50
    const skip = (Number(page) - 1) * limit

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ])

    res.json({ orders, total, page: Number(page) })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos' })
  }
})

// ── GET /api/orders/:id — detalles de un pedido (admin) ──────────────────
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' })
    res.json({ order })
  } catch {
    res.status(500).json({ error: 'Error al obtener pedido' })
  }
})

// ── PATCH /api/orders/:id — actualizar estado / notas (admin) ────────────
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { estado, notas } = req.body
    const update = {}
    if (estado) update.estado = estado
    if (notas  !== undefined) update.notas = notas

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' })
    res.json({ ok: true, order })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// ── DELETE /api/orders/:id (admin) ───────────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Error al eliminar pedido' })
  }
})

module.exports = router
