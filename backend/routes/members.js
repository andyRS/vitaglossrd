const router = require('express').Router()
const User = require('../models/User')
const protect = require('../middleware/auth')

// ── GET /api/members — Público: lista del equipo para la página ───────────
router.get('/', async (req, res) => {
  try {
    const members = await User.find({ activo: true }).select('nombre descripcion rol whatsapp foto fechaIngreso')
    res.json({ members })
  } catch {
    res.status(500).json({ error: 'Error al obtener miembros.' })
  }
})

// ── GET /api/members/:id — Público ───────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('nombre descripcion rol whatsapp foto fechaIngreso')
    if (!member || !member.activo) return res.status(404).json({ error: 'Miembro no encontrado.' })
    res.json({ member })
  } catch {
    res.status(500).json({ error: 'Error al obtener miembro.' })
  }
})

// ── GET /api/members/all — Admin: todos incluyendo inactivos ─────────────
router.get('/admin/all', protect, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') return res.status(403).json({ error: 'Solo admin.' })
    const members = await User.find()
    res.json({ members })
  } catch {
    res.status(500).json({ error: 'Error.' })
  }
})

// ── PATCH /api/members/:id — Admin: actualizar miembro ───────────────────
router.patch('/:id', protect, async (req, res) => {
  try {
    if (req.user.rol !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Sin permiso.' })
    }
    const { nombre, descripcion, whatsapp, foto, activo, metaMensual } = req.body
    const updates = {}
    if (nombre) updates.nombre = nombre
    if (descripcion !== undefined) updates.descripcion = descripcion
    if (whatsapp !== undefined) updates.whatsapp = whatsapp
    if (foto !== undefined) updates.foto = foto
    if (activo !== undefined && req.user.rol === 'admin') updates.activo = activo
    if (metaMensual !== undefined) updates.metaMensual = metaMensual

    const member = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
    res.json({ member })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
