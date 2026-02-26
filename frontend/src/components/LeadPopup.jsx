import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../services/api'

export default function LeadPopup() {
  const [visible, setVisible] = useState(false)
  const [nombre, setNombre] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    // No mostrar si ya fue cerrado en esta sesión
    if (sessionStorage.getItem('leadPopupCerrado')) return

    let disparado = false
    function mostrar() {
      if (disparado) return
      disparado = true
      setVisible(true)
      document.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('scroll', onScrollMobile)
      clearTimeout(timerFallback)
    }

    // Desktop: intent de salida (mouse hacia arriba fuera de ventana)
    const onMouseLeave = (e) => {
      if (e.clientY < 10) mostrar()
    }

    // Mobile: usuario ha scrolleado al 60% y luego sube (scroll-up intención de salida)
    let ultimoScroll = 0
    const onScrollMobile = () => {
      const scrollY = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const porcentaje = maxScroll > 0 ? scrollY / maxScroll : 0
      if (porcentaje > 0.6 && scrollY < ultimoScroll - 80) {
        mostrar()
      }
      ultimoScroll = scrollY
    }

    // Fallback: 20s (reducido de 30s — usamos el tiempo de forma más agresiva en mobile)
    const timerFallback = setTimeout(mostrar, 20000)

    document.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('scroll', onScrollMobile, { passive: true })
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('scroll', onScrollMobile)
      clearTimeout(timerFallback)
    }
  }, [])

  const cerrar = () => {
    setVisible(false)
    sessionStorage.setItem('leadPopupCerrado', '1')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nombre.trim() || !whatsapp.trim()) return
    const refCode = sessionStorage.getItem('vg_ref')
    // Guardar lead en DB (fire-and-forget — no bloquea el flujo)
    api.createPublicLead({
      nombre:          nombre.trim(),
      telefono:        whatsapp.trim(),
      productoInteres: 'Catálogo general',
      origen:          'web',
      nota:            'Lead capturado desde el popup de la web',
      refCode:         refCode || '',
    }).catch(() => {}) // silencioso si falla
    const refTexto = refCode ? ` Me recomendó el representante: *${refCode}*.` : ''
    const msg = encodeURIComponent(
      `Hola VitaGloss RD! 👋 Soy *${nombre}* y me registré desde la web. Me interesa recibir la *Guía de los 3 productos más pedidos* y mi *10% de descuento en mi primer pedido*.${refTexto} ¡Gracias!`
    )
    window.open(`https://wa.me/18492763532?text=${msg}`, '_blank')
    setEnviado(true)
    setTimeout(cerrar, 3000)
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            onClick={cerrar}
          />

          {/* Modal — contenedor que centra con flexbox */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6 pointer-events-none"
          >
            {/* Caja del modal: limita altura, scrollea si hace falta */}
            <div className="relative w-full max-w-sm max-h-full flex flex-col rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">

              {/* Botón cerrar — sobre el contenido, siempre visible */}
              <button
                onClick={cerrar}
                aria-label="Cerrar oferta"
                className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors text-sm z-20"
              >
                <span aria-hidden="true">✕</span>
              </button>

              {/* Contenido scrolleable */}
              <div className="bg-gradient-to-br from-[#0a1628] via-[#1B3A6B] to-[#0f2a54] overflow-y-auto">
              <div className="px-6 pt-6 pb-5">
                {!enviado ? (
                  <>
                    {/* Header compacto */}
                    <div className="text-center mb-4">
                      <div className="text-3xl mb-2">🎁</div>
                      <h2 className="text-white font-black text-xl mb-1">¡Espera, tenemos un regalo!</h2>
                      <p className="text-white/60 text-sm mb-3">
                        Déjanos tu WhatsApp y recibe{' '}
                        <span className="text-yellow-300 font-black">todo esto gratis</span>
                      </p>
                      <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-left space-y-2 mb-3">
                        <p className="text-white/80 text-xs flex items-start gap-2"><span className="text-green-400 mt-0.5 flex-shrink-0">✅</span> Guía: <span className="font-bold">"Los 3 productos más pedidos en RD y por qué funcionan"</span></p>
                        <p className="text-white/80 text-xs flex items-start gap-2"><span className="text-green-400 mt-0.5 flex-shrink-0">✅</span> <span className="text-yellow-300 font-bold">10% OFF</span> en tu primer pedido</p>
                        <p className="text-white/80 text-xs flex items-start gap-2"><span className="text-green-400 mt-0.5 flex-shrink-0">✅</span> Atención personalizada por WhatsApp</p>
                      </div>
                      <p className="text-white/40 text-xs">⚡ Solo para nuevos clientes · Completamente gratis</p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                      <div>
                        <label className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Tu nombre</label>
                        <input
                          type="text"
                          placeholder="Ej: María González"
                          value={nombre}
                          onChange={e => setNombre(e.target.value)}
                          required
                          className="w-full bg-white/10 border border-white/20 focus:border-white/50 text-white placeholder-white/30 rounded-xl px-4 py-2 text-sm outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Tu WhatsApp</label>
                        <input
                          type="tel"
                          placeholder="Ej: 809-555-1234"
                          value={whatsapp}
                          onChange={e => setWhatsapp(e.target.value)}
                          required
                          className="w-full bg-white/10 border border-white/20 focus:border-white/50 text-white placeholder-white/30 rounded-xl px-4 py-2 text-sm outline-none transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-3 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-green-900/40 mt-1"
                      >
                        <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Sí, quiero la guía + mi descuento
                      </button>
                      <button type="button" onClick={cerrar} className="text-white/30 hover:text-white/50 text-xs text-center transition-colors">
                        No gracias, prefiero pagar precio completo
                      </button>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className="text-5xl mb-3">🎉</div>
                    <h3 className="font-black text-white text-lg mb-1">¡Bienvenido/a {nombre}!</h3>
                    <p className="text-white/50 text-sm">Te redirigimos a WhatsApp para completar tu registro VIP.</p>
                  </motion.div>
                )}
              </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
