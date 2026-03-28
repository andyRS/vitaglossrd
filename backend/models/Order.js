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
  apellidos:         { type: String, default: '' },
  email:             { type: String, default: '' },
  whatsapp:          { type: String, default: '' },

  // Dirección de entrega
  direccionEntrega:  { type: String, default: '' },
  provincia:         { type: String, default: '' },
  sector:            { type: String, default: '' },
  referencia:        { type: String, default: '' },

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

  // Método de pago
  metodoPago: {
    type: String,
    enum: ['whatsapp', '2checkout', 'paypal', 'pagadito', 'transferencia', 'contraentrega'],
    default: 'whatsapp',
  },
  pagoRef: { type: String, default: '' }, // ID de transacción de la pasarela

  notas: { type: String, default: '' },

  // Número de factura secuencial
  invoiceNumber: { type: Number, index: true },

  // Atribución
  refCode: { type: String, default: '' },
  source:  { type: String, default: 'web_carrito' }, // 'web_carrito' | 'web_pago' | 'manual'

  // n8n tracking
  n8nNotified: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)
