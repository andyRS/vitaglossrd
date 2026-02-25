const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const auth = require('../middleware/auth')

// GET /reviews/:productoId — public
router.get('/:productoId', async (req, res) => {
  try {
    const reviews = await Review.find({
      productoId: parseInt(req.params.productoId),
      aprobado: true,
    }).sort({ createdAt: -1 }).limit(20)

    const total = reviews.length
    const avg = total > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
      : 0

    res.json({ reviews, avg: parseFloat(avg), total })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /reviews/:productoId — public (any visitor can leave review)
router.post('/:productoId', async (req, res) => {
  try {
    const { nombre, rating, comentario, ciudad } = req.body
    if (!nombre || !rating || !comentario) {
      return res.status(400).json({ error: 'nombre, rating y comentario son requeridos' })
    }
    const review = await Review.create({
      productoId: parseInt(req.params.productoId),
      nombre: nombre.trim().substring(0, 60),
      rating: Math.min(5, Math.max(1, parseInt(rating))),
      comentario: comentario.trim().substring(0, 500),
      ciudad: (ciudad || '').trim().substring(0, 40),
    })
    res.status(201).json({ review })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /reviews/:id — protected (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
