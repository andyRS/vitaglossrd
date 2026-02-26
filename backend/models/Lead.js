const mongoose = require('mongoose')

const leadSchema = new mongoose.Schema({
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,  // Opcional para leads capturados desde la web pública
    default: null,
  },
  nombre: {
    type: String,
    required: [true, 'El nombre del lead es requerido'],
    trim: true,
  },
  telefono: {
    type: String,
    trim: true,
    default: '',
  },
  productoInteres: {
    type: String,
    default: 'Sin especificar',
  },
  estado: {
    type: String,
    enum: ['nuevo', 'contactado', 'interesado', 'cerrado', 'perdido'],
    default: 'nuevo',
  },
  nota: {
    type: String,
    maxlength: [500, 'Nota muy larga'],
    default: '',
  },
  origen: {
    type: String,
    enum: ['whatsapp', 'referido', 'web', 'instagram', 'facebook', 'otro'],
    default: 'whatsapp',
  },
  fechaContacto: {
    type: Date,
    default: Date.now,
  },
  // Atribución de referido (código del vendedor que redirigó al cliente)
  refCode: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Lead', leadSchema)
