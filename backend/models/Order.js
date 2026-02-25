const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  nombre:    { type: String, required: true },
  articulo:  { type: String, default: '' },
  cantidad:  { type: Number, required: true, min: 1 },
  precio:    { type: Number, required: true, min: 0 },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  // Datos del cliente (opcionales — puede ordenar sin registrarse)
  nombre:   { type: String, default: 'Cliente web' },
  whatsapp: { type: String, default: '' },

  // Productos del carrito
  items:  { type: [orderItemSchema], required: true },
  total:  { type: Number, required: true, min: 0 },

  // Seguimiento
  estado: {
    type: String,
    enum: ['nuevo', 'contactado', 'confirmado', 'entregado', 'cancelado'],
    default: 'nuevo',
  },
  notas: { type: String, default: '' },

  // Atribución
  refCode: { type: String, default: '' },
  source:  { type: String, default: 'web_cart' },

  // n8n tracking
  n8nNotified: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)
