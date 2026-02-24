const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async function protect(req, res, next) {
  try {
    // 1. Leer token del header Authorization: Bearer <token>
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autenticado. Inicia sesión.' })
    }

    const token = authHeader.split(' ')[1]

    // 2. Verificar token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return res.status(401).json({ error: 'Token inválido o expirado.' })
    }

    // 3. Verificar que el usuario sigue existiendo
    const user = await User.findById(decoded.id)
    if (!user || !user.activo) {
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo.' })
    }

    req.user = user
    next()
  } catch (err) {
    res.status(500).json({ error: 'Error de autenticación.' })
  }
}
