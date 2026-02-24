const router = require('express').Router()
const Sale = require('../models/Sale')
const protect = require('../middleware/auth')

router.use(protect)

// ── GET /api/sales ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const filter = req.user.rol === 'admin' ? {} : { vendedor: req.user._id }
    const sales = await Sale.find(filter)
      .populate('vendedor', 'nombre')
      .sort({ fecha: -1 })
    res.json({ sales })
  } catch {
    res.status(500).json({ error: 'Error al obtener ventas.' })
  }
})

// ── POST /api/sales ───────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { cliente, telefono, productos, total, metodoPago, notas, estado } = req.body
    const sale = await Sale.create({
      vendedor: req.user._id,
      cliente,
      telefono,
      productos,
      total,
      metodoPago,
      notas,
      estado,
    })
    res.status(201).json({ sale })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(err.errors).map(e => e.message).join('. ') })
    }
    res.status(500).json({ error: 'Error al registrar venta.' })
  }
})

// ── PATCH /api/sales/:id ──────────────────────────────────────────────────
router.patch('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
    if (!sale) return res.status(404).json({ error: 'Venta no encontrada.' })
    if (req.user.rol !== 'admin' && sale.vendedor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Sin permiso.' })
    }
    const { estado, notas, metodoPago } = req.body
    if (estado) sale.estado = estado
    if (notas !== undefined) sale.notas = notas
    if (metodoPago !== undefined) sale.metodoPago = metodoPago
    await sale.save()
    res.json({ sale })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// ── DELETE /api/sales/:id ─────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
    if (!sale) return res.status(404).json({ error: 'Venta no encontrada.' })
    if (req.user.rol !== 'admin' && sale.vendedor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Sin permiso.' })
    }
    await sale.deleteOne()
    res.json({ message: 'Venta eliminada.' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar.' })
  }
})

module.exports = router
