const router = require('express').Router()
const Lead = require('../models/Lead')
const protect = require('../middleware/auth')

// Todos los endpoints requieren autenticación
router.use(protect)

// ── GET /api/leads — Mis leads (o todos si admin) ─────────────────────────
router.get('/', async (req, res) => {
  try {
    const filter = req.user.rol === 'admin' ? {} : { vendedor: req.user._id }
    const leads = await Lead.find(filter)
      .populate('vendedor', 'nombre')
      .sort({ createdAt: -1 })
    res.json({ leads })
  } catch {
    res.status(500).json({ error: 'Error al obtener leads.' })
  }
})

// ── POST /api/leads — Crear lead ──────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { nombre, telefono, productoInteres, estado, nota, origen } = req.body
    const lead = await Lead.create({
      vendedor: req.user._id,
      nombre,
      telefono,
      productoInteres,
      estado,
      nota,
      origen,
    })
    res.status(201).json({ lead })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(err.errors).map(e => e.message).join('. ') })
    }
    res.status(500).json({ error: 'Error al crear lead.' })
  }
})

// ── PATCH /api/leads/:id — Actualizar estado/nota ────────────────────────
router.patch('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
    if (!lead) return res.status(404).json({ error: 'Lead no encontrado.' })
    if (req.user.rol !== 'admin' && lead.vendedor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Sin permiso.' })
    }
    const { estado, nota, nombre, telefono, productoInteres, origen } = req.body
    if (estado) lead.estado = estado
    if (nota !== undefined) lead.nota = nota
    if (nombre) lead.nombre = nombre
    if (telefono !== undefined) lead.telefono = telefono
    if (productoInteres !== undefined) lead.productoInteres = productoInteres
    if (origen !== undefined) lead.origen = origen
    await lead.save()
    res.json({ lead })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// ── DELETE /api/leads/:id ─────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
    if (!lead) return res.status(404).json({ error: 'Lead no encontrado.' })
    if (req.user.rol !== 'admin' && lead.vendedor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Sin permiso.' })
    }
    await lead.deleteOne()
    res.json({ message: 'Lead eliminado.' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar lead.' })
  }
})

module.exports = router
