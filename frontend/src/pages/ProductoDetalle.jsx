import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { productos } from '../data/productos'
import ProductoCard from '../components/ProductoCard'
import { useSEO } from '../hooks/useSEO'
import { useCart } from '../context/CartContext'
import ReviewsSection from '../components/ReviewsSection'

// Acordeón individual
function Accordion({ titulo, icono, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="flex items-center gap-3">
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${open ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary'}`}>
            {icono}
          </span>
          <span className={`font-semibold text-base transition-colors ${open ? 'text-primary' : 'text-gray-700 group-hover:text-primary'}`}>
            {titulo}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={`flex-shrink-0 ml-4 transition-colors ${open ? 'text-primary' : 'text-gray-300 group-hover:text-primary'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-gray-600 text-sm leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProductoDetalle() {
  const { id } = useParams()
  const producto = productos.find(p => p.id === parseInt(id))
  const [imgActiva, setImgActiva] = useState(0)
  const [agregado, setAgregado] = useState(false)
  const { addItem } = useCart()

  const handleAgregar = () => {
    addItem(producto)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
    // Meta Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'AddToCart', {
        content_name: producto.nombre,
        content_ids: [String(producto.id)],
        content_type: 'product',
        value: producto.precio,
        currency: 'DOP',
      })
    }
  }

  useSEO({
    title: producto?.nombre ?? 'Producto',
    description: producto?.descripcion ?? 'Producto Amway original en VitaGloss RD. Envío a todo el país.',
    jsonLd: producto ? {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: producto.nombre,
      description: producto.descripcion,
      image: producto.imagenes ?? [producto.imagen],
      brand: { '@type': 'Brand', name: 'Amway' },
      sku: producto.articulo,
      offers: {
        '@type': 'Offer',
        url: `https://vitagloss-rd.com/producto/${producto.id}`,
        priceCurrency: 'DOP',
        price: producto.precio,
        availability: producto.disponible
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: 'VitaGloss RD' },
      },
    } : null,
  })

  // Meta Pixel: ViewContent event
  useEffect(() => {
    if (!producto) return
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_name: producto.nombre,
        content_ids: [String(producto.id)],
        content_type: 'product',
        value: producto.precio,
        currency: 'DOP',
      })
    }
  }, [producto?.id])

  if (!producto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24">
        <span className="text-6xl mb-4">🔍</span>
        <h2 className="text-2xl font-bold text-primary mb-2">Producto no encontrado</h2>
        <p className="text-gray-500 mb-6">El producto que buscas no existe.</p>
        <Link to="/catalogo" className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const imagenes = producto.imagenes || [producto.imagen]
  const relacionados = productos.filter(p => p.id !== producto.id).slice(0, 3)

  // Touch swipe para galería mobile
  const touchStartX = useRef(null)
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) setImgActiva(prev => (prev + 1) % imagenes.length)
      else setImgActiva(prev => (prev - 1 + imagenes.length) % imagenes.length)
    }
    touchStartX.current = null
  }

  const whatsappMsg = encodeURIComponent(
    `Hola VitaGloss RD! 👋 Quiero hacer un pedido de:\n\n*${producto.nombre}*\nArt. ${producto.articulo} | Precio: RD$${producto.precio}\n\n¿Cuál es el proceso de compra? Gracias!`
  )
  const whatsappURL = `https://wa.me/18492763532?text=${whatsappMsg}`

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 pt-24">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-400 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span>/</span>
          <Link to="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link>
          <span>/</span>
          <span className="text-primary font-semibold truncate">{producto.nombre}</span>
        </div>
      </div>

      {/* ===== SECCIÓN PRINCIPAL ===== */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* === GALERÍA IZQUIERDA === */}
          <div className="flex flex-col gap-4">
            {/* Imagen principal con flechas */}
            <div
              className="bg-gray-50 rounded-3xl flex items-center justify-center p-6 sm:p-8 border border-gray-100 relative overflow-hidden select-none"
              style={{ minHeight: '320px' }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgActiva}
                  src={imagenes[imgActiva]}
                  alt={producto.nombre}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22 }}
                  className="max-h-96 w-full object-contain drop-shadow-lg pointer-events-none"
                />
              </AnimatePresence>

              {/* Flechas laterales */}
              {imagenes.length > 1 && (
                <>
                  <button
                    onClick={() => setImgActiva(prev => (prev - 1 + imagenes.length) % imagenes.length)}
                    aria-label="Imagen anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-gray-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setImgActiva(prev => (prev + 1) % imagenes.length)}
                    aria-label="Imagen siguiente"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-gray-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Certificaciones visuales debajo de la imagen */}
            {producto.certificaciones && producto.certificaciones.length > 0 && (
              <div className="flex items-center gap-5 px-2">
                {producto.certificaciones.map((cert, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {cert.nombre === 'Halal' && (
                      <div className="w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center bg-white flex-shrink-0">
                        <svg viewBox="0 0 40 40" className="w-9 h-9">
                          <path d="M20 6 a14 14 0 1 0 9.9 4.1" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round"/>
                          <text x="20" y="24" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#111" fontFamily="serif">M</text>
                        </svg>
                      </div>
                    )}
                    {cert.nombre === 'Kosher' && (
                      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 44 44" className="w-10 h-10">
                          <polygon points="22,2 27,15 41,15 30,23 34,37 22,29 10,37 14,23 3,15 17,15" fill="none" stroke="#111" strokeWidth="1.8" strokeLinejoin="round"/>
                          <text x="22" y="26" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#111" fontFamily="sans-serif">K</text>
                        </svg>
                      </div>
                    )}
                    {cert.nombre === 'NSF' && (
                      <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-900 flex-shrink-0">
                        <div className="text-center leading-none">
                          <p className="text-white text-[7px] font-bold tracking-wider">CONTENTS</p>
                          <p className="text-white text-[7px] font-bold tracking-wider">CERTIFIED</p>
                          <p className="text-white text-[10px] font-black">NSF</p>
                        </div>
                      </div>
                    )}
                    <span className="text-gray-500 text-xs leading-tight max-w-[70px]">{cert.descripcion}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Miniaturas */}
            {imagenes.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {imagenes.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgActiva(i)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-white p-1.5 transition-all duration-200 flex items-center justify-center ${
                      imgActiva === i
                        ? 'border-secondary shadow-md scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`Vista ${i + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* === INFO DERECHA === */}
          <div className="flex flex-col">

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className={`${producto.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                {producto.badge}
              </span>
              <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">
                {producto.categoria}
              </span>
              <span className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {producto.stock}
              </span>
            </div>

            {/* Urgencia stock + ventas */}
            <div className="flex flex-wrap gap-2 mb-4">
              {producto.stockUnidades && producto.stockUnidades <= 6 && (
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-3 py-2 rounded-xl"
                >
                  🔥 ¡Solo quedan {producto.stockUnidades} unidades!
                </motion.div>
              )}
              {producto.ventasSemana && (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold px-3 py-2 rounded-xl">
                  📦 {producto.ventasSemana} personas compraron esta semana
                </div>
              )}
            </div>

            {/* Nombre */}
            <h1 className="text-3xl md:text-4xl font-black text-primary leading-tight mb-1">
              {producto.nombre}
            </h1>
            <p className="text-gray-400 text-sm mb-1">{producto.nombreCorto}</p>
            <p className="text-gray-300 text-xs mb-6">Art. {producto.articulo}</p>

            {/* Precio */}
            <div className="bg-gray-50 rounded-2xl px-6 py-5 mb-6 border border-gray-100">
              <div className="flex items-end gap-3 mb-3">
                <span className="text-4xl font-black text-primary">RD${producto.precio.toLocaleString('es-DO', { minimumFractionDigits: producto.precio % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}</span>
                {producto.precioOriginal && (
                  <>
                    <span className="text-gray-300 text-lg line-through mb-1">RD${producto.precioOriginal.toLocaleString('es-DO')}</span>
                    <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-1 rounded-full mb-1">
                      -{Math.round(((producto.precioOriginal - producto.precio) / producto.precioOriginal) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              {/* Cuotas */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                  💳 3 cuotas de RD${Math.round(producto.precio / 3).toLocaleString('es-DO')}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  📦 Envío gratis desde RD$2,500
                </span>
              </div>
            </div>

            {/* Calculadora costo/día */}
            {(() => {
              const usos = producto.usosPorEnvase ?? 1
              const costoDia = (producto.precio / usos).toFixed(1)
              const unidadDia = producto.categoria === 'Suplementos' ? 'comprimido' : 'uso'
              return (
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl px-5 py-4 mb-6">
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">💡 ¿Sabías que...?</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">
                        Este producto tiene <span className="font-bold text-dark">{usos} {unidadDia}s</span>
                      </p>
                      <p className="text-gray-600 text-sm">
                        Te cuesta solo <span className="font-black text-primary text-base">RD${costoDia}</span> por {unidadDia}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-primary">RD${costoDia}</span>
                      <p className="text-gray-400 text-xs">/{unidadDia}</p>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Detalles rápidos */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {producto.detalles.map((d, i) => (
                <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <p className="text-gray-400 text-xs mb-0.5">{d.label}</p>
                  <p className="text-dark font-bold text-sm">{d.valor}</p>
                </div>
              ))}
            </div>

            {/* Upsell combo: solo para productos de Salud Bucal individuales */}
            {producto.categoria === 'Salud Bucal' && (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl px-5 py-4 mb-4">
                <p className="text-xs font-black text-orange-600 uppercase tracking-wide mb-2">🔥 Ahorra más con el kit completo</p>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-800">Kit Glister™ Completo</p>
                    <p className="text-xs text-gray-500">Pasta + Enjuague + Spray — <span className="text-green-600 font-bold">ahorra RD$188</span></p>
                  </div>
                  <Link
                    to="/combos"
                    className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
                  >
                    Ver kit →
                  </Link>
                </div>
              </div>
            )}

            {/* Btn carrito */}
            <button
              onClick={handleAgregar}
              className={`w-full py-4 rounded-2xl font-black text-base transition-all duration-200 flex items-center justify-center gap-3 mb-3 border-2 ${
                agregado
                  ? 'border-green-500 text-green-600 bg-green-50 scale-95'
                  : 'border-primary text-primary hover:bg-primary hover:text-white'
              }`}
            >
              {agregado ? (
                <><span className="text-xl">✓</span> ¡Agregado al pedido!</>
              ) : (
                <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg> Agregar al pedido</>
              )}
            </button>

            {/* Botón principal WhatsApp */}
            <a
              href={whatsappURL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-base transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg shadow-green-100 mb-3"
            >
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Pedir por WhatsApp
            </a>

            <Link
              to="/catalogo"
              className="w-full border-2 border-gray-200 text-gray-500 hover:border-primary hover:text-primary py-3 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              ← Ver más productos
            </Link>

            {/* Política de devolución y garantías */}
            <div className="mt-5 bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">🛡️ Compra con confianza</p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0">↩️</span>
                  <div>
                    <p className="text-sm font-bold text-gray-700">Garantía de satisfacción 30 días</p>
                    <p className="text-xs text-gray-400">Si no quedas satisfecho/a, te devolvemos tu dinero. Sin preguntas.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0">🏷️</span>
                  <div>
                    <p className="text-sm font-bold text-gray-700">Productos 100% originales</p>
                    <p className="text-xs text-gray-400">Distribuidor autorizado Amway en República Dominicana.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0">🔒</span>
                  <div>
                    <p className="text-sm font-bold text-gray-700">Pago seguro por WhatsApp</p>
                    <p className="text-xs text-gray-400">Transferencia bancaria, tarjetas o efectivo. Confirmamos tu pedido al instante.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Garantías */}
            <div className="grid grid-cols-3 gap-3 mt-6 text-center">
              {[
                {
                  icono: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  ),
                  label: 'Envío a domicilio',
                  color: 'text-primary bg-primary/8'
                },
                {
                  icono: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  ),
                  label: '100% Original',
                  color: 'text-secondary bg-secondary/10'
                },
                {
                  icono: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  ),
                  label: 'Soporte directo',
                  color: 'text-green-600 bg-green-50'
                },
              ].map((g, i) => (
                <div key={i} className="bg-gray-50 rounded-xl py-3 px-2 flex flex-col items-center gap-2 border border-gray-100 hover:border-gray-200 transition-colors">
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${g.color}`}>
                    {g.icono}
                  </span>
                  <span className="text-xs text-gray-500 font-medium leading-tight">{g.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== ACCORDIONS ESTILO AMWAY ===== */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-black text-primary mb-2">Información del producto</h2>
          <p className="text-gray-400 text-sm mb-6">Conoce todos los detalles antes de hacer tu pedido.</p>

          <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
            <div className="px-6">

              <Accordion
                titulo="Detalles del Producto"
                defaultOpen={true}
                icono={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {producto.detalles.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-gray-400 text-xs">{d.label}</p>
                        <p className="text-dark font-semibold text-sm">{d.valor}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-gray-400 text-xs">Marca</p>
                      <p className="text-dark font-semibold text-sm">Amway</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-gray-400 text-xs">Disponibilidad</p>
                      <p className="text-green-600 font-semibold text-sm">{producto.stock}</p>
                    </div>
                  </div>
                </div>
              </Accordion>

              {/* Certificaciones — solo si el producto las tiene */}
              {producto.certificaciones && producto.certificaciones.length > 0 && (
                <Accordion
                  titulo="Certificaciones"
                  icono={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                >
                  <div className="flex flex-wrap gap-6 items-center">
                    {producto.certificaciones.map((cert, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {cert.nombre === 'Halal' && (
                          <div className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center flex-shrink-0 bg-white">
                            <svg viewBox="0 0 40 40" className="w-8 h-8">
                              <circle cx="20" cy="20" r="14" fill="none" stroke="#111" strokeWidth="2.5"/>
                              <path d="M15 20 a8 8 0 1 0 10-7.7" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
                              <text x="20" y="25" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#111">M</text>
                            </svg>
                          </div>
                        )}
                        {cert.nombre === 'Kosher' && (
                          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                            <svg viewBox="0 0 40 40" className="w-10 h-10">
                              <polygon points="20,3 24,14 36,14 26,21 30,33 20,26 10,33 14,21 4,14 16,14" fill="none" stroke="#111" strokeWidth="2"/>
                              <text x="20" y="23" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#111">K</text>
                            </svg>
                          </div>
                        )}
                        {cert.nombre === 'NSF' && (
                          <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 bg-gray-900">
                            <span className="text-white text-[8px] font-black leading-tight text-center">NSF<br/>CERT</span>
                          </div>
                        )}
                        <span className="text-gray-600 text-sm">{cert.descripcion}</span>
                      </div>
                    ))}
                  </div>
                </Accordion>
              )}

              <Accordion
                titulo="Descripción"
                icono={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                }
              >
                <div className="space-y-3 mb-4">
                  {producto.descripcionLarga.split('\n\n').map((parrafo, i) => (
                    <p key={i} className="leading-relaxed">{parrafo}</p>
                  ))}
                </div>
                {producto.categoria === 'Suplementos' && (
                  <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3 leading-relaxed border border-gray-100">
                    <strong>Aviso:</strong> {producto.advertencia || 'Los niños menores de 12 años, las mujeres embarazadas o que amamantan, o cualquier persona con alguna enfermedad deben consultar a su médico antes de usar este producto.'} † Esta declaración no fue evaluada por la FDA. Este producto no pretende diagnosticar, tratar, curar ni prevenir ninguna enfermedad.
                  </p>
                )}
              </Accordion>

              <Accordion
                titulo="Beneficios"
                icono={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                <ul className="space-y-3">
                  {producto.beneficios.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 bg-secondary/10 text-secondary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </Accordion>

              <Accordion
                titulo="Instrucciones de uso"
                icono={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                <div className="space-y-3">
                  {producto.instrucciones ? (
                    // Instrucciones personalizadas del producto
                    producto.instrucciones.map((paso, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-gray-600">{paso}</p>
                      </div>
                    ))
                  ) : producto.categoria === 'Salud Bucal' ? (
                    // Instrucciones genéricas salud bucal
                    <>
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                        <p>Aplica una pequeña cantidad del producto en tu cepillo dental.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                        <p>Cepilla suavemente durante 2 minutos cubriendo todas las superficies.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                        <p>Enjuaga bien con agua.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                        <p>Para mejores resultados, úsalo <strong>{producto.detalles.find(d => d.label === 'Uso')?.valor}</strong>.</p>
                      </div>
                    </>
                  ) : (
                    // Instrucciones genéricas suplementos
                    <>
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                        <p>Toma <strong>{producto.detalles.find(d => d.label === 'Uso')?.valor}</strong> con un vaso de agua.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                        <p>Preferiblemente con las comidas.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                        <p>No exceder la dosis diaria recomendada.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                        <p>Mantener fuera del alcance de los niños.</p>
                      </div>
                    </>
                  )}
                </div>
              </Accordion>

              <Accordion
                titulo="Preguntas frecuentes"
                icono={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                <div className="space-y-4">
                  {/* FAQs específicas del producto */}
                  {producto.faqs && producto.faqs.map((faq, i) => (
                    <div key={i} className="border-l-2 border-secondary/30 pl-4">
                      <p className="font-semibold text-gray-700 mb-1">{faq.pregunta}</p>
                      <p className="text-gray-500">{faq.respuesta}</p>
                    </div>
                  ))}
                  {/* Separador si hay FAQs del producto */}
                  {producto.faqs && producto.faqs.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">Sobre el pedido</p>
                    </div>
                  )}
                  {/* FAQs genéricas de compra */}
                  <div className="border-l-2 border-primary/20 pl-4">
                    <p className="font-semibold text-gray-700 mb-1">¿Cómo hago mi pedido?</p>
                    <p className="text-gray-500">Haz clic en el botón de WhatsApp, te responderemos de inmediato con el proceso de pago y entrega.</p>
                  </div>
                  <div className="border-l-2 border-primary/20 pl-4">
                    <p className="font-semibold text-gray-700 mb-1">¿Cuánto tiempo tarda el envío?</p>
                    <p className="text-gray-500">El tiempo de entrega varía según tu ubicación en República Dominicana. Normalmente entre 1 y 3 días hábiles.</p>
                  </div>
                  <div className="border-l-2 border-primary/20 pl-4">
                    <p className="font-semibold text-gray-700 mb-1">¿Los productos son originales?</p>
                    <p className="text-gray-500">Sí, somos distribuidores independientes certificados de Amway. Todos los productos son 100% originales y auténticos.</p>
                  </div>
                  <div className="border-l-2 border-primary/20 pl-4">
                    <p className="font-semibold text-gray-700 mb-1">¿Cuáles son los métodos de pago?</p>
                    <p className="text-gray-500">Aceptamos transferencia bancaria, depósito y pago en efectivo. Te indicaremos los detalles al confirmar tu pedido por WhatsApp.</p>
                  </div>
                </div>
              </Accordion>

              <Accordion
                titulo="Información del Distribuidor"
                icono={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              >
                <div className="flex items-center gap-4 bg-primary/5 rounded-xl p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    VG
                  </div>
                  <div>
                    <p className="font-bold text-primary">VitaGloss RD</p>
                    <p className="text-gray-500 text-xs">Distribuidor Independiente Amway · República Dominicana</p>
                    <a href="https://wa.me/18492763532" target="_blank" rel="noopener noreferrer" className="text-green-600 text-xs font-semibold hover:underline">
                      📲 (849) 276-3532
                    </a>
                  </div>
                </div>
              </Accordion>

            </div>
          </div>
        </div>

        {/* ===== PRODUCTOS RELACIONADOS (CROSS-SELLING) ===== */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black text-primary">Completa tu rutina</h2>
            <Link to="/catalogo" className="text-sm text-secondary font-semibold hover:underline">Ver todos →</Link>
          </div>
          <p className="text-gray-400 text-sm mb-8">Los clientes que compraron este producto también llevan:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relacionados.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductoCard producto={p} />
              </motion.div>
            ))}
          </div>

          {/* CTA combo */}
          {producto.categoria === 'Salud Bucal' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 bg-gradient-to-br from-[#0a1628] via-[#1B3A6B] to-[#0f2a54] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div>
                <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">🔥 Oferta combo</span>
                <h3 className="text-xl font-black mb-1">Kit Completo Glister™</h3>
                <p className="text-white/60 text-sm">Pasta + Spray + Enjuague — ahorra RD$188 vs comprar por separado</p>
              </div>
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-center">
                  <p className="text-white/40 text-sm line-through">RD$2,888</p>
                  <p className="text-[#2EC4B6] font-black text-2xl">RD$2,700</p>
                </div>
                <a
                  href={`https://wa.me/18492763532?text=${encodeURIComponent('Hola VitaGloss RD! 👋 Quiero pedir el Kit Completo Glister™ (Pasta + Spray + Enjuague) al precio combo de RD$2,700. ¿Cómo lo proceso?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-2xl transition-all hover:scale-105 text-sm whitespace-nowrap"
                >
                  Pedir kit →
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ===== RESEÑAS DE CLIENTES ===== */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <ReviewsSection productoId={producto.id} />
      </div>
    </div>
  )
}
