const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  nombre:    { type: String, required: true },
  articulo:  { type: String, default: '' },
  cantidad:  { type: Number, required: true, min: 1 },
  precio:    { type: Number, required: true, min: 0 },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  // Datos del cliente
  nombre:            { type: String, default: 'Cliente web' },
  whatsapp:          { type: String, default: '' },
  direccionEntrega:  { type: String, default: '' },

  // Productos
  items:  { type: [orderItemSchema], required: true },
  total:  { type: Number, required: true, min: 0 },

  // Estado del pedido
  estado: {
    type: String,
    enum: ['nuevo', 'confirmado', 'preparando', 'enviado', 'en_camino', 'entregado', 'cancelado'],
    default: 'nuevo',
  },

  // Estado del pago
  pagado: {
    type: String,
    enum: ['pendiente', 'pagado', 'parcial'],
    default: 'pendiente',
  },

  notas: { type: String, default: '' },

  // Número de factura secuencial
  invoiceNumber: { type: Number, index: true },

  // Atribución
  refCode: { type: String, default: '' },
  source:  { type: String, default: 'web_carrito' }, // 'web_carrito' | 'manual' | 'formulario'

  // n8n tracking
  n8nNotified: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)
