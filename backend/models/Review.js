const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  productoId: { type: Number, required: true, index: true },
  nombre:     { type: String, required: true, trim: true },
  rating:     { type: Number, required: true, min: 1, max: 5 },
  comentario: { type: String, required: true, trim: true, maxlength: 500 },
  ciudad:     { type: String, trim: true, default: '' },
  verificado: { type: Boolean, default: false },
  aprobado:   { type: Boolean, default: true }, // auto-approve; admin can reject
}, { timestamps: true })

module.exports = mongoose.model('Review', reviewSchema)
