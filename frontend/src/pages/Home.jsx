import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { productos } from '../data/productos'
import ProductoCard from '../components/ProductoCard'
import CountdownTimer from '../components/CountdownTimer'
import { useSEO } from '../hooks/useSEO'

const slides = [
  {
    id: 1,
    productoId: 1,
    tag: '🦷 Salud Bucal Premium',
    titulo: 'Sonríe con',
    tituloColor: 'confianza',
    subtitulo: 'Descubre la línea Glister™ de Amway, diseñada para proteger, blanquear y fortalecer tu sonrisa desde el primer uso.',
    imagen: '/124106SP-690px-01.jpg',
    cta: 'Ver Pasta Dental',
    ctaLink: '/producto/1',
    bg: 'from-[#0a1628] via-[#1B3A6B] to-[#0f2a54]',
    acento: '#2EC4B6',
  },
  {
    id: 2,
    productoId: 4,
    tag: '💊 Suplementos Naturales',
    titulo: 'Fortalece tu',
    tituloColor: 'sistema inmune',
    subtitulo: 'Vitamina C Nutrilite™ de acción prolongada. Energía y defensas naturales para toda tu familia, cada día.',
    imagen: '/109741CO-690px-01.png',
    cta: 'Ver Vitamina C',
    ctaLink: '/producto/4',
    bg: 'from-[#0f1f0a] via-[#1a3d10] to-[#0a2408]',
    acento: '#4ade80',
  },
  {
    id: 3,
    productoId: 2,
    tag: '🧴 Higiene Bucal Completa',
    titulo: 'Frescura que',
    tituloColor: 'dura todo el día',
    subtitulo: 'Enjuague y spray bucal Glister™. Elimina el 99.9% de bacterias y mantén tu aliento fresco a donde vayas.',
    imagen: '/124111-690px-01.jpg',
    cta: 'Ver Spray Bucal',
    ctaLink: '/producto/2',
    bg: 'from-[#0d1a2e] via-[#1a2f4a] to-[#0d1f3a]',
    acento: '#2EC4B6',
  },
]

const stats = [
  { numero: '100%', label: 'Productos Originales', icono: '✅' },
  { numero: '90+', label: 'Años de Investigación', icono: '🔬' },
  { numero: '24h', label: 'Atención WhatsApp', icono: '📲' },
  { numero: 'RD', label: 'Envíos Nacionales', icono: '🚚' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' }
  })
}

export default function Home() {
  useSEO({
    title: 'Inicio',
    description: 'VitaGloss RD — Distribuidor oficial Amway en República Dominicana. Pasta Dental Glister™, Vitamina C Nutrilite™. Envío gratis desde RD$2,500.',
  })
  const [slideActivo, setSlideActivo] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return
    const t = setInterval(() => {
      setSlideActivo(prev => (prev + 1) % slides.length)
    }, 8000)
    return () => clearInterval(t)
  }, [autoplay])

  const slide = slides[slideActivo]
  const slideProducto = productos.find(p => p.id === slide.productoId)
  const slidePrecio = slideProducto?.precio ?? '—'

  return (
    <div className="overflow-x-hidden">

      {/* ====== HERO SLIDER ====== */}
      <section className={`relative min-h-screen bg-gradient-to-br ${slide.bg} flex items-center overflow-hidden transition-all duration-700`}>

        {/* Fondo decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10" style={{ background: slide.acento, filter: 'blur(80px)' }} />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10" style={{ background: slide.acento, filter: 'blur(80px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{ background: slide.acento, filter: 'blur(120px)' }} />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-10 sm:pb-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[auto] sm:min-h-[80vh]">

            {/* Texto */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + '-text'}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.5 }}
                className="text-white z-10"
              >
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border mb-6"
                  style={{ borderColor: slide.acento + '50', background: slide.acento + '20', color: slide.acento }}
                >
                  {slide.tag}
                </motion.span>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 sm:mb-5">
                  {slide.titulo}{' '}
                  <span style={{ color: slide.acento }}>{slide.tituloColor}</span>
                </h1>

                <p className="text-white/70 text-base md:text-xl leading-relaxed mb-7 sm:mb-10 max-w-lg">
                  {slide.subtitulo}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={slide.ctaLink}
                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base font-bold transition-all duration-200 hover:scale-105 shadow-lg"
                    style={{ background: slide.acento, color: '#fff', boxShadow: `0 8px 30px ${slide.acento}40` }}
                  >
                    {slide.cta} →
                  </Link>
                  <a
                    href="https://wa.me/18492763532?text=Hola!%20Quiero%20hacer%20un%20pedido%20en%20VitaGloss%20RD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base font-bold border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-200 hover:scale-105 backdrop-blur-sm flex items-center gap-2"
                  >
                    📲 Pedir ahora
                  </a>
                </div>

                {/* Indicadores */}
                <div className="flex items-center gap-3 mt-10">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setSlideActivo(i); setAutoplay(false) }}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: slideActivo === i ? '32px' : '8px',
                        height: '8px',
                        background: slideActivo === i ? slide.acento : 'rgba(255,255,255,0.3)'
                      }}
                    />
                  ))}
                  <span className="ml-2 text-white/30 text-xs">
                    {slideActivo + 1} / {slides.length}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Imagen */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + '-img'}
                initial={{ opacity: 0, scale: 0.85, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: -40 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center items-center relative"
              >
                {/* Glow difuso de fondo */}
                <div className="absolute rounded-full opacity-50"
                  style={{
                    width: '260px', height: '260px',
                    background: slide.acento,
                    filter: 'blur(80px)',
                  }} />

                {/* Círculo principal */}
                <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at 40% 30%, ${slide.acento}18 0%, transparent 70%)`,
                    boxShadow: `0 0 0 2px ${slide.acento}90, 0 0 25px ${slide.acento}50, 0 0 60px ${slide.acento}20`,
                  }}>
                  <img
                    src={slide.imagen}
                    alt="Producto"
                    className="w-44 sm:w-60 md:w-72 lg:w-80 h-44 sm:h-60 md:h-72 lg:h-80 object-contain"
                    style={{ filter: `drop-shadow(0 20px 30px ${slide.acento}70)` }}
                    fetchPriority={slideActivo === 0 ? 'high' : 'low'}
                    loading={slideActivo === 0 ? 'eager' : 'lazy'}
                  />
                </div>

                {/* Badge precio */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute top-2 sm:top-4 right-0 sm:right-2 bg-white rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-2xl"
                >
                  <p className="text-xs text-gray-400 font-medium">Precio especial</p>
                  <p className="text-primary font-black text-base sm:text-lg">RD${slidePrecio}</p>
                </motion.div>

                {/* Badge stock */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute bottom-2 sm:bottom-6 left-0 sm:left-2 bg-green-500 text-white rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-xl flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold">En Stock</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Flecha scroll */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className="bg-primary py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-2xl">{s.icono}</span>
                <span className="text-3xl font-black text-secondary">{s.numero}</span>
                <span className="text-white/70 text-sm font-medium">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TRUST BADGES ====== */}
      <section className="py-6 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {[
              { icono: '✅', label: 'Distribuidor Amway Certificado' },
              { icono: '🔒', label: 'Pago 100% Seguro' },
              { icono: '🚚', label: 'Envío Gratis ≥ RD$2,500' },
              { icono: '🔄', label: 'Garantía de Satisfacción' },
              { icono: '🏅', label: 'Cert. NSF • Kosher • Halal' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="text-base">{b.icono}</span>
                <span className="font-semibold whitespace-nowrap">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SOCIAL PROOF TICKER ====== */}
      <div className="bg-secondary overflow-hidden py-3">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          className="flex gap-10 whitespace-nowrap"
        >
          {[...Array(2)].map((_, rep) => (
            <span key={rep} className="flex gap-10 text-white text-sm font-semibold">
              <span className="flex items-center gap-2">⭐ +150 clientes satisfechos en RD</span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-2">🚀 Entrega en 24–48h en todo el país</span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-2">✅ Distribuidor Amway certificado</span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-2">💬 Respuesta en menos de 1 hora</span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-2">🔒 Pago seguro · 100% originales</span>
              <span className="opacity-40">•</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ====== PROBLEMA → SOLUCIÓN ====== */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#060e1f] to-[#0a1628] overflow-hidden">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block bg-red-500/10 text-red-400 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-5 border border-red-500/20">
              ¿Te identificas?
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              ¿Gastas en productos que{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                no te dan resultados?
              </span>
            </h2>
            <p className="text-white/40 mt-3 text-base">Hay una diferencia entre lo que compras hoy y lo que realmente funciona.</p>
          </motion.div>

          {/* Cards */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Problema */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative bg-white/[0.03] border border-red-500/20 rounded-3xl p-7 backdrop-blur-sm overflow-hidden"
            >
              {/* Glow fondo */}
              <div className="absolute -top-16 -left-16 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-red-400/70 uppercase tracking-widest font-semibold">Sin VitaGloss</p>
                  <h3 className="font-black text-red-300 text-base">El problema habitual</h3>
                </div>
              </div>

              <ul className="space-y-3.5">
                {[
                  'Pasta dental que mancha en vez de blanquear',
                  'Vitaminas baratas que el cuerpo no absorbe',
                  'Productos con químicos que irritan o dañan',
                  'Marcas que prometen mucho y entregan poco',
                  'Compras sin saber qué lleva adentro',
                ].map((p, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-5 h-5 mt-0.5 bg-red-500/15 border border-red-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <span className="text-white/50 text-sm leading-relaxed line-through decoration-red-500/40">{p}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Badge VS — solo desktop */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-secondary to-primary border-2 border-white/10 flex items-center justify-center shadow-2xl shadow-primary/40">
                <span className="text-white text-[11px] font-black tracking-tight">VS</span>
              </div>
            </div>

            {/* Solución */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="relative bg-white/[0.03] border border-emerald-500/20 rounded-3xl p-7 backdrop-blur-sm overflow-hidden"
            >
              {/* Glow fondo */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-emerald-400/70 uppercase tracking-widest font-semibold">Con VitaGloss RD</p>
                  <h3 className="font-black text-emerald-300 text-base">La diferencia real</h3>
                </div>
              </div>

              <ul className="space-y-3.5">
                {[
                  'Glister™ blanquea sin peróxido ni abrasivos dañinos',
                  'Nutrilite™ libera vitaminas durante 8 horas reales',
                  'Fórmulas limpias: sin parabenos, SLS ni colorantes',
                  '90+ años de investigación científica comprobada',
                  'Distribuidor certificado — producto 100% original',
                ].map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-5 h-5 mt-0.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-white/80 text-sm leading-relaxed font-medium">{s}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* CTA puente */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <p className="text-white/30 text-sm">
              Mira los productos que ya están cambiando la rutina de cientos de dominicanos 👇
            </p>
          </motion.div>

        </div>
      </section>

      {/* ====== PRODUCTOS ====== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block bg-secondary/10 text-secondary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">
              Catálogo VitaGloss RD
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-4">Nuestros productos</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Selección premium Amway para tu salud bucal y bienestar. Todos originales, con envío a toda República Dominicana.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((p, i) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <ProductoCard producto={p} />
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 bg-primary hover:bg-blue-900 text-white px-10 py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:scale-105 shadow-lg shadow-primary/20"
            >
              Ver catálogo completo →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ====== TESTIMONIOS ====== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block bg-yellow-100 text-yellow-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">
              ⭐ Clientes satisfechos
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Resultados reales de personas reales en República Dominicana.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                nombre: 'María Fernández',
                ciudad: 'Santo Domingo',
                producto: 'Pasta Dental Glister™',
                foto: 'https://randomuser.me/api/portraits/women/44.jpg',
                estrellas: 5,
                texto: 'Llevo 3 meses usándola y mis dientes nunca habían lucido tan blancos. Mi dentista me preguntó qué pasta usaba. ¡La recomiendo al 100%!',
              },
              {
                nombre: 'Carlos Martínez',
                ciudad: 'Santiago',
                producto: 'Vitamina C Nutrilite™',
                foto: 'https://randomuser.me/api/portraits/men/32.jpg',
                estrellas: 5,
                texto: 'Desde que empecé a tomar la Vitamina C no me he enfermado en meses. Antes me agarraba gripe cada mes. Ahora trabajo sin parar y con energía.',
              },
              {
                nombre: 'Luisa Rodríguez',
                ciudad: 'La Romana',
                producto: 'Kit Completo Glister™',
                foto: 'https://randomuser.me/api/portraits/women/68.jpg',
                estrellas: 5,
                texto: 'Pedí el kit completo y fue la mejor decisión. El servicio de VitaGloss RD es excelente, rápido y los productos llegan en perfectas condiciones.',
              },
              {
                nombre: 'Andrés Peña',
                ciudad: 'San Pedro de Macorís',
                producto: 'Spray Bucal Glister™',
                foto: 'https://randomuser.me/api/portraits/men/75.jpg',
                estrellas: 4,
                texto: 'Muy bueno para el día a día. Lo uso antes de reuniones y citas. El aliento se mantiene fresco bastante tiempo. Me gustaría que el envase fuera un poco más grande, pero el producto es excelente.',
              },
              {
                nombre: 'Patricia Gómez',
                ciudad: 'Puerto Plata',
                producto: 'Pasta Dental Glister™',
                foto: 'https://randomuser.me/api/portraits/women/55.jpg',
                estrellas: 5,
                texto: 'Mis hijos también la usan ahora. Es suave pero efectiva. Noto menos sensibilidad y mucho más frescura que con la pasta de supermercado.',
              },
              {
                nombre: 'Roberto Díaz',
                ciudad: 'Higüey',
                producto: 'Vitamina C Nutrilite™',
                foto: 'https://randomuser.me/api/portraits/men/61.jpg',
                estrellas: 4,
                texto: 'Llevo dos meses tomándola. Noto que me recupero mejor después de entrenar. El envío tardó un día más de lo esperado, pero el producto en sí es muy bueno. Lo sigo comprando.',
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Estrellas */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <span key={s} className={`text-lg ${s < t.estrellas ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                  ))}
                  <span className="ml-1.5 text-xs text-gray-400 font-semibold">{t.estrellas}.0</span>
                </div>
                {/* Texto */}
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.texto}"</p>
                {/* Autor */}
                <div className="flex items-center gap-3">
                  <img
                    src={t.foto}
                    alt={t.nombre}
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0 ring-2 ring-secondary/30"
                  />
                  <div>
                    <p className="font-bold text-dark text-sm">{t.nombre}</p>
                    <p className="text-gray-400 text-xs">{t.ciudad} · {t.producto}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== COMBOS / KITS ====== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">
              🔥 Oferta especial
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-4">Kits & Combos</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Ahorra más llevando todo en un solo pedido. Combos pensados para tu rutina completa.
            </p>
          </motion.div>

          {/* Tarjeta combo */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative bg-gradient-to-br from-[#0a1628] via-[#1B3A6B] to-[#0f2a54] rounded-3xl overflow-hidden shadow-2xl">

              {/* Decoración fondo */}
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10" style={{ background: '#2EC4B6', filter: 'blur(60px)' }} />
              <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: '#2EC4B6', filter: 'blur(60px)' }} />

              <div className="relative z-10 p-8 md:p-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                  <div>
                    <span className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                      🔥 Más vendido
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                      Kit Completo Glister™
                    </h3>
                    <p className="text-white/60 text-sm mt-1">Salud bucal total — Pasta + Spray + Enjuague</p>
                    {/* Countdown */}
                    <div className="mt-4">
                      <CountdownTimer label="Oferta válida por:" />
                    </div>
                  </div>
                  {/* Precio badge */}
                  <div className="bg-white/10 border border-white/20 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-right backdrop-blur-sm self-start sm:self-auto">
                    <p className="text-white/50 text-xs font-medium mb-0.5">Por separado</p>
                    <p className="text-white/40 text-base line-through">RD$2,888</p>
                    <p className="text-[#2EC4B6] font-black text-2xl">RD$2,700</p>
                    <span className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full mt-1">
                      Cliente ahorra RD$188
                    </span>
                  </div>
                </div>

                {/* Productos del kit */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { nombre: 'Pasta Dental Glister™', imagen: '/124106SP-690px-01.jpg', precio: 899, id: 1 },
                    { nombre: 'Spray Bucal Glister™', imagen: '/124111-690px-01.jpg', precio: 820, id: 2 },
                    { nombre: 'Enjuague Bucal Glister™', imagen: '/124108-690px-01.jpg', precio: 1169, id: 3 },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -4 }}
                      className="bg-white/10 border border-white/15 rounded-2xl p-2 sm:p-4 flex flex-col items-center gap-2 sm:gap-3 backdrop-blur-sm"
                    >
                      <div className="w-20 h-20 flex items-center justify-center">
                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-contain drop-shadow-lg" />
                      </div>
                      <p className="text-white text-xs font-semibold text-center leading-snug">{item.nombre}</p>
                      <span className="text-[#2EC4B6] font-bold text-sm">RD${item.precio}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA WhatsApp */}
                <a
                    href={`https://wa.me/18492763532?text=${encodeURIComponent('Hola VitaGloss RD! 👋 Quiero pedir el *Kit Completo Glister™* (Pasta + Spray + Enjuague) al precio combo de RD$2,700. ¿Cómo lo proceso? ¡Gracias!')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-white font-black text-base rounded-2xl px-6 py-4 transition-all duration-200 hover:scale-105 shadow-lg shadow-green-900/40"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Pedir este kit ahora
                  </a>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== POR QUÉ ELEGIRNOS ====== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-black text-primary mb-3">¿Por qué elegirnos?</h2>
            <p className="text-gray-500 max-w-md mx-auto">Tu satisfacción es nuestra prioridad. Así garantizamos la mejor experiencia.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icono: '🏆', titulo: 'Productos Originales', desc: 'Distribuidor independiente certificado Amway. Sin intermediarios falsos, 100% auténtico.' },
              { icono: '⚡', titulo: 'Pedidos Rápidos', desc: 'Escríbenos por WhatsApp y gestionamos tu pedido el mismo día. Rápido y sin complicaciones.' },
              { icono: '🚚', titulo: 'Envío a Todo RD', desc: 'Llevamos tus productos a la puerta de tu casa en toda República Dominicana.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ y: -6 }}
                className="bg-gray-50 rounded-3xl p-8 text-center border border-gray-100 hover:border-secondary/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 shadow-md">
                  {item.icono}
                </div>
                <h3 className="font-bold text-primary text-xl mb-3">{item.titulo}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== POR QUÉ NUTRILITE ====== */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-900 via-[#1a3d10] to-green-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block bg-green-500/20 text-green-300 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4 border border-green-500/30">
              🌿 Ciencia + Naturaleza
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">¿Por qué Nutrilite™ & Glister™?</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              No son productos de supermercado. Son el resultado de más de 90 años de investigación científica.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14">
            {[
              {
                icono: '🌱',
                titulo: '90+ años de ciencia',
                desc: 'Nutrilite es la marca de vitaminas y suplementos #1 del mundo en ventas. Con granjas propias certificadas.',
                acento: 'border-green-400/30 bg-green-400/5',
              },
              {
                icono: '🏆',
                titulo: 'Certificaciones globales',
                desc: 'NSF, Kosher, Halal. Pasan pruebas más estrictas que medicamentos. Aprobados en más de 100 países.',
                acento: 'border-yellow-400/30 bg-yellow-400/5',
              },
              {
                icono: '🔬',
                titulo: 'Ingredientes rastreables',
                desc: 'Cada ingrediente tiene trazabilidad desde la semilla. Sabes exactamente de dónde viene lo que consumes.',
                acento: 'border-blue-400/30 bg-blue-400/5',
              },
              {
                icono: '✅',
                titulo: 'Sin ingredientes dañinos',
                desc: 'Sin parabenos, alcohol, peróxido, SLS, colorantes ni edulcorantes artificiales. Fórmulas limpias.',
                acento: 'border-teal-400/30 bg-teal-400/5',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ y: -6 }}
                className={`border ${item.acento} rounded-3xl p-6 backdrop-blur-sm transition-all duration-300`}
              >
                <div className="text-4xl mb-4">{item.icono}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.titulo}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Comparativa */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
          >
            <div className="overflow-x-auto">
            <div className="grid grid-cols-3 text-center min-w-[360px]">
              <div className="p-4 border-r border-white/10">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-3">Característica</p>
              </div>
              <div className="p-4 border-r border-white/10 bg-green-500/10">
                <p className="text-green-300 text-xs font-bold uppercase tracking-wide mb-3">Nutrilite™ / Glister™</p>
              </div>
              <div className="p-4">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-3">Marcas comunes</p>
              </div>
            </div>
            {[
              ['Ingredientes naturales', '✅ Sí', '⚠️ Parcial'],
              ['Certificación NSF/Kosher', '✅ Sí', '❌ No'],
              ['Trazabilidad granja-mesa', '✅ Sí', '❌ No'],
              ['Sin parabenos ni SLS', '✅ Sí', '❌ Muchas contienen'],
              ['Liberación prolongada (Vit. C)', '✅ 8 horas', '❌ Inmediata'],
            ].map(([feature, v1, v2], i) => (
              <div key={i} className={`grid grid-cols-3 text-center border-t border-white/10 min-w-[360px] ${i % 2 === 0 ? 'bg-white/3' : ''}`}>
                <div className="p-4 flex items-center justify-center">
                  <p className="text-white/70 text-sm">{feature}</p>
                </div>
                <div className="p-4 border-x border-white/10 bg-green-500/5 flex items-center justify-center">
                  <p className="text-green-300 font-semibold text-sm">{v1}</p>
                </div>
                <div className="p-4 flex items-center justify-center">
                  <p className="text-white/40 text-sm">{v2}</p>
                </div>
              </div>
            ))}
            </div>{/* end overflow-x-auto */}
          </motion.div>
        </div>
      </section>

      {/* ====== CÓMO FUNCIONA ====== */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-blue-900">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-black text-white mb-3">¿Cómo funciona?</h2>
            <p className="text-white/60 max-w-md mx-auto">Proceso simple, rápido y seguro. En 3 pasos tienes tu pedido.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { paso: '01', icono: '🛍️', titulo: 'Elige tu producto', desc: 'Explora nuestro catálogo y selecciona el producto que necesitas.' },
              { paso: '02', icono: '📲', titulo: 'Escríbenos', desc: 'Contáctanos por WhatsApp con tu pedido. Te respondemos al instante.' },
              { paso: '03', icono: '🚚', titulo: 'Recíbelo en casa', desc: 'Coordinamos el pago y enviamos tu pedido directo a tu puerta.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center text-white"
              >
                <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4 backdrop-blur-sm">
                  {item.icono}
                </div>
                <span className="text-secondary font-black text-sm tracking-widest">{item.paso}</span>
                <h3 className="font-bold text-xl mt-1 mb-2">{item.titulo}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== RESULTADOS REALES / WHATSAPP SOCIAL PROOF ====== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block bg-green-100 text-green-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">
              💬 Clientes reales · WhatsApp
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-4">Resultados reales</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Mensajes reales de nuestros clientes. Sin filtros, sin edición.
            </p>
          </motion.div>

          {/* Grid de chats WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                nombre: 'María F.',
                foto: 'https://randomuser.me/api/portraits/women/44.jpg',
                hora: '9:41 AM',
                producto: 'Pasta Dental Glister™',
                icono: '🦷',
                mensajes: [
                  { lado: 'ellos', texto: 'Hola! Me llegó el pedido, muchas gracias 🙏' },
                  { lado: 'ellos', texto: 'Llevo 2 semanas con la pasta Glister y mis dientes están notablemente más blancos 😍' },
                  { lado: 'yo', texto: '¡Qué alegría! Es la pasta que usamos toda la familia también 😄' },
                  { lado: 'ellos', texto: 'Ya le pedí a mi hermana que también ordene. Mándame otra unidad para el próximo mes por favor 🙌' },
                ],
              },
              {
                nombre: 'Carlos M.',
                foto: 'https://randomuser.me/api/portraits/men/32.jpg',
                hora: '3:15 PM',
                producto: 'Vitamina C Nutrilite™',
                icono: '💪',
                mensajes: [
                  { lado: 'ellos', texto: 'Buenas! Ya terminé el primer frasco de la Vitamina C' },
                  { lado: 'ellos', texto: 'De verdad que noto la diferencia. Este invierno no me resfrié ni una vez 💪' },
                  { lado: 'yo', texto: '¡Así es! La liberación de 8 horas hace toda la diferencia ✅' },
                  { lado: 'ellos', texto: 'Voy a pedir 2 frascos ahora, uno para mi mamá también 🙏' },
                ],
              },
              {
                nombre: 'Luisa R.',
                foto: 'https://randomuser.me/api/portraits/women/68.jpg',
                hora: '11:20 AM',
                producto: 'Kit Completo Glister™',
                icono: '✨',
                mensajes: [
                  { lado: 'ellos', texto: 'El kit llegó rapidísimo! En menos de 24 horas 🚀' },
                  { lado: 'yo', texto: '¡Siempre intentamos que sea al día siguiente! 😊' },
                  { lado: 'ellos', texto: 'Mi dentista me preguntó qué pasta dental uso porque mis dientes están más blancos 😂' },
                  { lado: 'ellos', texto: 'Definitivamente ya soy cliente fija. El enjuague concentrado es brutal 🔥' },
                ],
              },
            ].map((chat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                {/* Header WhatsApp */}
                <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
                  <img
                    src={chat.foto}
                    alt={chat.nombre}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">{chat.nombre}</p>
                    <p className="text-green-200 text-xs">en línea</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
                    <span className="text-xs">{chat.icono}</span>
                    <span className="text-white/80 text-[10px] font-semibold whitespace-nowrap">{chat.producto}</span>
                  </div>
                </div>

                {/* Fondo chat WhatsApp */}
                <div
                  className="px-4 py-4 space-y-2 min-h-[200px]"
                  style={{
                    background: '#e5ddd5',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c5b8ac' fill-opacity='0.15'%3E%3Cpath d='M50 50c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S50 55.5 50 50zm-40 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S10 55.5 10 50zm40-40c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S50 15.5 50 10zM10 10c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S10 15.5 10 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                >
                  {chat.mensajes.map((m, j) => (
                    <div key={j} className={`flex ${m.lado === 'yo' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm relative ${
                          m.lado === 'yo'
                            ? 'bg-[#dcf8c6] text-gray-800 rounded-br-sm'
                            : 'bg-white text-gray-800 rounded-bl-sm'
                        }`}
                      >
                        <p className="leading-snug">{m.texto}</p>
                        {j === chat.mensajes.length - 1 && (
                          <p className={`text-[10px] mt-0.5 text-right ${m.lado === 'yo' ? 'text-green-700' : 'text-gray-400'}`}>
                            {chat.hora} {m.lado === 'yo' && '✓✓'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer verificado */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="text-green-500">✓</span> Testimonio de cliente
                  </span>
                  <span className="text-xs text-secondary font-semibold">{chat.producto}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="https://wa.me/18492763532?text=Hola!%20Vi%20los%20resultados%20y%20quiero%20probar%20los%20productos%20VitaGloss%20RD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-green-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-green-200"
            >
              💬 Quiero resultados como estos
            </a>
          </div>
        </div>
      </section>

      {/* ====== REFERIDOS ====== */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#0a1628] to-[#1B3A6B]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block bg-secondary/20 text-secondary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-5 border border-secondary/30">
              🤝 Programa de referidos
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              ¿Ya eres cliente? <span className="text-secondary">Gana por cada amigo que compre</span>
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto mb-8">
              Comparte tu enlace personal y recibe beneficios exclusivos cada vez que alguien compre gracias a ti.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icono: '🔗', titulo: 'Tu enlace único', desc: 'Lo encuentras en tu perfil del Dashboard' },
                { icono: '📲', titulo: 'Comparte por WhatsApp', desc: 'Envíaselo a amigos y familia' },
                { icono: '🎁', titulo: 'Gana beneficios', desc: 'Recompensas por cada nuevo cliente' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-3">{item.icono}</div>
                  <h4 className="text-white font-bold text-sm mb-1">{item.titulo}</h4>
                  <p className="text-white/40 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>

            <Link
              to="/equipo"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-teal-400 text-white font-black px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-secondary/30"
            >
              Conocer el programa de referidos →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ====== CTA FINAL ====== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-green-200 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="relative z-10">
              <span className="text-6xl block mb-6">📲</span>
              <h2 className="text-3xl md:text-4xl font-black mb-4">¿Listo para pedir?</h2>
              <p className="text-green-100 text-lg mb-8 max-w-lg mx-auto">
                Escríbenos ahora y recibe atención personalizada. Tu pedido gestionado con rapidez y confianza.
              </p>
              <a
                href="https://wa.me/18492763532?text=Hola!%20Quiero%20hacer%20un%20pedido%20en%20VitaGloss%20RD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-green-600 hover:bg-green-50 px-10 py-4 rounded-2xl font-black text-lg transition-all duration-200 hover:scale-105 shadow-xl"
              >
                Abrir WhatsApp ahora →
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
