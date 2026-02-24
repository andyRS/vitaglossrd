const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// ── Generar JWT ──────────────────────────────────────────────────────────
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// ── POST /api/auth/register ───────────────────────────────────────────────
// Solo admin puede crear usuarios (o el primero que se registre si no hay nadie)
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, whatsapp, rol, descripcion } = req.body

    // Si ya existe algún usuario, requerir token de admin
    const count = await User.countDocuments()
    if (count > 0) {
      // Verificar token (simplificado — en producción usa el middleware)
      const authHeader = req.headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Solo un admin puede registrar nuevos usuarios.' })
      }
      const jwt2 = require('jsonwebtoken')
      let decoded
      try { decoded = jwt2.verify(authHeader.split(' ')[1], process.env.JWT_SECRET) } catch {
        return res.status(403).json({ error: 'Token inválido.' })
      }
      const requester = await User.findById(decoded.id)
      if (!requester || requester.rol !== 'admin') {
        return res.status(403).json({ error: 'Solo admin puede crear usuarios.' })
      }
    }

    const user = await User.create({
      nombre,
      email,
      password,
      whatsapp: whatsapp || '',
      rol: count === 0 ? 'admin' : (rol || 'vendedor'), // El primero es admin
      descripcion: descripcion || undefined,
    })

    const token = generateToken(user._id)
    res.status(201).json({ token, user })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Ese email ya está registrado.' })
    }
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map(e => e.message).join('. ')
      return res.status(400).json({ error: msg })
    }
    res.status(500).json({ error: 'Error al registrar usuario.' })
  }
})

// ── POST /api/auth/login ──────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos.' })
    }

    // Traer usuario CON password (select: false en el schema)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user || !user.activo) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' })
    }

    const esValida = await user.compararPassword(password)
    if (!esValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' })
    }

    const token = generateToken(user._id)
    res.json({ token, user }) // toJSON() quita la password
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión.' })
  }
})

// ── GET /api/auth/me ──────────────────────────────────────────────────────
const protect = require('../middleware/auth')
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user })
})

// ── PATCH /api/auth/me ────────────────────────────────────────────────────
router.patch('/me', protect, async (req, res) => {
  try {
    const { nombre, descripcion, whatsapp, foto, metaMensual } = req.body
    const updates = {}
    if (nombre) updates.nombre = nombre
    if (descripcion !== undefined) updates.descripcion = descripcion
    if (whatsapp !== undefined) updates.whatsapp = whatsapp
    if (foto !== undefined) updates.foto = foto
    if (metaMensual !== undefined) updates.metaMensual = metaMensual

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
    res.json({ user })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// ── PATCH /api/auth/password ──────────────────────────────────────────────
router.patch('/password', protect, async (req, res) => {
  try {
    const { passwordActual, passwordNuevo } = req.body
    const user = await User.findById(req.user._id).select('+password')
    const valida = await user.compararPassword(passwordActual)
    if (!valida) return res.status(400).json({ error: 'Contraseña actual incorrecta.' })
    user.password = passwordNuevo
    await user.save()
    res.json({ message: 'Contraseña actualizada.' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
