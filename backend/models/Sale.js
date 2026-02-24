const mongoose = require('mongoose')

const saleSchema = new mongoose.Schema({
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cliente: {
    type: String,
    required: [true, 'El nombre del cliente es requerido'],
    trim: true,
  },
  telefono: {
    type: String,
    trim: true,
    default: '',
  },
  productos: [
    {
      nombre: String,
      artículo: String,
      cantidad: { type: Number, default: 1 },
      precio: Number,
    }
  ],
  total: {
    type: Number,
    required: [true, 'El total es requerido'],
    min: [0, 'El total no puede ser negativo'],
  },
  metodoPago: {
    type: String,
    enum: ['transferencia', 'efectivo', 'tarjeta', 'pago_movil', 'otro'],
    default: 'transferencia',
  },
  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente',
  },
  notas: {
    type: String,
    default: '',
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Sale', saleSchema)
