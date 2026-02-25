import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../services/api'

function Stars({ rating, size = 'md', interactive = false, onSelect }) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6' }
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onSelect(s) : undefined}
          className={`${sizes[size]} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          disabled={!interactive}
        >
          <svg viewBox="0 0 24 24" fill={s <= rating ? '#FBBF24' : '#E5E7EB'}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function ReviewsSection({ productoId }) {
  const [data, setData] = useState({ reviews: [], avg: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ nombre: '', ciudad: '', rating: 0, comentario: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const loadReviews = async () => {
    try {
      const d = await api.getReviews(productoId)
      setData(d)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { loadReviews() }, [productoId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.nombre.trim()) return setError('Por favor escribe tu nombre')
    if (!form.rating) return setError('Por favor selecciona una puntuación')
    if (!form.comentario.trim()) return setError('Por favor escribe tu opinión')
    setSending(true)
    try {
      await api.createReview(productoId, form)
      setSent(true)
      setShowForm(false)
      setForm({ nombre: '', ciudad: '', rating: 0, comentario: '' })
      loadReviews()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const distribution = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: data.reviews.filter(rev => rev.rating === r).length,
    pct: data.total > 0
      ? Math.round((data.reviews.filter(rev => rev.rating === r).length / data.total) * 100)
      : 0,
  }))

  return (
    <div className="mt-12 border-t border-gray-100 pt-10">
      <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-2">
        ⭐ Opiniones de clientes
        {data.total > 0 && (
          <span className="text-sm font-semibold text-gray-400">({data.total} reseña{data.total !== 1 ? 's' : ''})</span>
        )}
      </h2>

      {/* Summary */}
      {data.total > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 mb-8 bg-gray-50 rounded-3xl p-6 border border-gray-100">
          {/* avg score */}
          <div className="flex flex-col items-center justify-center sm:border-r border-gray-200 sm:pr-6 flex-shrink-0">
            <span className="text-6xl font-black text-primary leading-none">{data.avg}</span>
            <Stars rating={Math.round(data.avg)} size="lg" />
            <p className="text-gray-400 text-xs mt-1">{data.total} valoración{data.total !== 1 ? 'es' : ''}</p>
          </div>
          {/* distribution bars */}
          <div className="flex-1 space-y-2">
            {distribution.map(d => (
              <div key={d.stars} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 w-4 text-right">{d.stars}</span>
                <svg className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.pct}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="h-full bg-yellow-400 rounded-full"
                  />
                </div>
                <span className="text-xs text-gray-400 w-6 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA dejar reseña */}
      {!showForm && !sent && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary hover:bg-blue-800 text-white px-5 py-3 rounded-2xl font-bold text-sm transition-colors mb-8 shadow-lg shadow-primary/20"
        >
          ✍️ Dejar mi opinión
        </button>
      )}

      {/* Confirmación enviado */}
      {sent && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-4 mb-8 font-semibold text-sm"
        >
          ✅ ¡Gracias por tu opinión! Ya se publicó tu reseña.
        </motion.div>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            onSubmit={handleSubmit}
            className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-8 space-y-4"
          >
            <h3 className="font-bold text-gray-800 text-base">Tu opinión importa 💬</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Tu nombre *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  placeholder="María García"
                  maxLength={60}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Ciudad (opcional)</label>
                <input
                  type="text"
                  value={form.ciudad}
                  onChange={e => setForm(f => ({ ...f, ciudad: e.target.value }))}
                  placeholder="Santo Domingo"
                  maxLength={40}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">Puntuación *</label>
              <Stars rating={form.rating} interactive size="lg" onSelect={r => setForm(f => ({ ...f, rating: r }))} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Tu opinión *</label>
              <textarea
                value={form.comentario}
                onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))}
                placeholder="¿Qué te pareció el producto? ¿Lo recomendarías?"
                maxLength={500}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
              />
              <p className="text-xs text-gray-300 text-right">{form.comentario.length}/500</p>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-semibold">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={sending}
                className="flex-1 bg-primary hover:bg-blue-800 disabled:opacity-60 text-white font-bold py-3 rounded-2xl text-sm transition-colors"
              >
                {sending ? 'Enviando...' : 'Publicar reseña'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 text-sm font-semibold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Lista de reseñas */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : data.reviews.length === 0 ? (
        <div className="text-center py-10 text-gray-300">
          <span className="text-4xl block mb-2">💬</span>
          <p className="font-medium">Sé el primero en dejar una reseña</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.reviews.map(rev => (
            <motion.div
              key={rev._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{rev.nombre}
                    {rev.ciudad && <span className="font-normal text-gray-400 ml-1 text-xs">• {rev.ciudad}</span>}
                  </p>
                  <Stars rating={rev.rating} size="sm" />
                </div>
                <time className="text-xs text-gray-300 flex-shrink-0">
                  {new Date(rev.createdAt).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })}
                </time>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{rev.comentario}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
