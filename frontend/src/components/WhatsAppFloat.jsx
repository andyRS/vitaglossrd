import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { productos } from '../data/productos'

const mensajesPorRuta = {
  '/': 'Hola VitaGloss RD! 👋 Quiero conocer más sobre sus productos. ¿Me pueden ayudar?',
  '/catalogo': 'Hola! 👋 Estoy viendo el catálogo y me gustaría hacer un pedido. ¿Cómo funciona?',
  '/contacto': 'Hola VitaGloss RD! 👋 Quiero ponerme en contacto con ustedes.',
}

export default function WhatsAppFloat() {
  const [abierto, setAbierto] = useState(false)
  const [mostrarBurbuja, setMostrarBurbuja] = useState(false)
  const location = useLocation()

  // Mostrar burbuja de mensaje después de 6 segundos
  useEffect(() => {
    const t = setTimeout(() => setMostrarBurbuja(true), 6000)
    return () => clearTimeout(t)
  }, [])

  // Detectar si estamos en página de producto
  const match = location.pathname.match(/\/producto\/(\d+)/)
  const productoActual = match ? productos.find(p => p.id === parseInt(match[1])) : null

  const mensajeDefault = productoActual
    ? `Hola VitaGloss RD! 👋 Estoy viendo *${productoActual.nombre}* (RD$${productoActual.precio}) y quisiera hacer un pedido. ¿Cómo lo proceso?`
    : mensajesPorRuta[location.pathname] || mensajesPorRuta['/']

  const whatsappURL = `https://wa.me/18492763532?text=${encodeURIComponent(mensajeDefault)}`

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">

      {/* Burbuja de mensaje */}
      <AnimatePresence>
        {mostrarBurbuja && !abierto && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl rounded-br-sm shadow-2xl px-4 py-3 max-w-[200px] sm:max-w-[220px] border border-gray-100 relative"
          >
            <button
              onClick={() => setMostrarBurbuja(false)}
              aria-label="Cerrar mensaje de WhatsApp"
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-500 text-xs flex items-center justify-center transition-colors"
            >
              <span aria-hidden="true">✕</span>
            </button>
            <p className="text-gray-700 text-sm font-semibold mb-0.5">
              {productoActual ? '¡Haz tu pedido ahora! 🛍️' : '¡Hola! ¿Listo para pedir? 👋'}
            </p>
            <p className="text-gray-500 text-xs leading-snug">
              {productoActual
                ? `Escríbenos y reservamos *${productoActual.nombre}* para ti hoy.`
                : 'Realizamos envíos a todo RD. Escríbenos y pedimos por ti.'}
            </p>
            <a
              href={whatsappURL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block w-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1.5 px-3 rounded-xl text-center transition-colors"
            >
              {productoActual ? '¡Quiero este producto! →' : 'Hacer mi pedido →'}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <motion.a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar VitaGloss RD por WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 transition-colors relative"
        onClick={() => setMostrarBurbuja(false)}
      >
        {/* Ping animado */}
        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30" />
        <svg className="w-7 h-7 fill-white relative z-10" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>
    </div>
  )
}
