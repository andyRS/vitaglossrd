const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [60, 'Nombre muy largo'],
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'Mínimo 6 caracteres'],
    select: false, // No se devuelve por defecto
  },
  rol: {
    type: String,
    enum: ['admin', 'vendedor'],
    default: 'vendedor',
  },
  whatsapp: {
    type: String,
    trim: true,
    default: '',
  },
  foto: {
    type: String,
    default: '', // URL de foto de perfil
  },
  descripcion: {
    type: String,
    default: 'Distribuidor independiente Amway en VitaGloss RD.',
    maxlength: [200, 'Descripción muy larga'],
  },
  activo: {
    type: Boolean,
    default: true,
  },
  metaMensual: {
    type: Number,
    default: 10000, // RD$10,000 meta por defecto
  },
  fechaIngreso: {
    type: Date,
    default: Date.now,
  },
  refCode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  refClicks: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
})

// Hash password antes de guardar
userSchema.pre('save', async function (next) {
  // Auto-generate refCode
  if (!this.refCode) {
    const base = (this.nombre || 'user')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10)
    const suffix = Math.random().toString(36).substring(2, 6)
    this.refCode = `${base}-${suffix}`
  }
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Método para comparar contraseñas
userSchema.methods.compararPassword = async function (candidato) {
  return await bcrypt.compare(candidato, this.password)
}

// Quitar password del JSON de respuesta
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

module.exports = mongoose.model('User', userSchema)
