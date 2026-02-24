import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function LoginModal({ open, onClose }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email.trim().toLowerCase(), password)
      onClose()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    setError('')
    setEmail('')
    setPassword('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="login-modal-title"
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-[#0a1628] to-[#1B3A6B] px-8 py-8 text-white relative">
                <button
                  onClick={handleClose}
                  aria-label="Cerrar modal"
                  className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white text-xl font-bold"
                >
                  ✕
                </button>
                <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-2xl mb-4">
                  <span aria-hidden="true">🔐</span>
                </div>
                <h2 id="login-modal-title" className="text-2xl font-black">Área del equipo</h2>
                <p className="text-white/60 text-sm mt-1">Inicia sesión para acceder al dashboard</p>
              </div>

              {/* Form */}
              <div className="px-8 py-8">
                <form onSubmit={handleSubmit} noValidate>
                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3 mb-5 flex items-center gap-2"
                        role="alert"
                      >
                        <span aria-hidden="true">⚠️</span>
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div className="mb-4">
                    <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Correo electrónico
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-6">
                    <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPass ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 pr-12 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(p => !p)}
                        aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                      >
                        {showPass ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full bg-primary hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-base"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                        Iniciando sesión…
                      </>
                    ) : (
                      <><span aria-hidden="true">🚪</span> Iniciar sesión</>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-400 text-xs">
                    ¿No tienes acceso?{' '}
                    <a
                      href="https://wa.me/18492763532?text=Hola!%20Quiero%20acceder%20al%20sistema%20de%20gesti%C3%B3n%20de%20VitaGloss%20RD"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary font-semibold hover:underline"
                      onClick={handleClose}
                    >
                      Contáctanos por WhatsApp
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
