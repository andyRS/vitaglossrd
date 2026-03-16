/**
 * Landing Page — Cómo iniciar en Amway con VitaGloss RD
 * Video hero + pasos de registro + CTA WhatsApp / Amway.com
 * Sin navbar. Página pública.
 */
import { useEffect, useRef, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import { api } from '../services/api'

// ─── Constantes ───────────────────────────────────────────────────────────────
const VIDEO_ID  = 'xrEBnLM-Yy0'
const WA_NUM    = '18492763532'
const WA_MSG    = encodeURIComponent('¡Hola Andy! Vi el video de cómo iniciar en Amway y quiero más información para registrarme 🚀')
const WA_URL    = `https://wa.me/${WA_NUM}?text=${WA_MSG}`
const AMWAY_REG = 'https://www.amway.com/en_US/register' // Reemplaza con tu link de referido Amway

// ─── Data ─────────────────────────────────────────────────────────────────────
const PASOS = [
  {
    num: '01',
    icon: '▶️',
    titulo: 'Mira el video completo',
    desc: 'Aquí arriba explico en detalle las modalidades de registro, qué incluye cada una y cuál se adapta a tu objetivo.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    num: '02',
    icon: '💬',
    titulo: 'Escríbeme por WhatsApp',
    desc: 'Después de ver el video escríbeme. Te acompaño personalmente en el proceso de registro — sin costo, sin compromiso.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    num: '03',
    icon: '📝',
    titulo: 'Regístrate gratis en AMWAY',
    desc: 'Solo necesitas tu nombre, apellido y un correo electrónico válido. Recibirás un enlace de verificación y tú mismo/a completas el registro — sin ayuda de nadie más.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    num: '04',
    icon: '🚀',
    titulo: 'Empieza a vender y ganar',
    desc: 'Una vez activo/a, tienes acceso a nuestra Academia VitaGloss RD, el grupo privado del equipo y mi tutoría directa.',
    color: 'from-orange-500 to-amber-500',
  },
]

const MODALIDADES = [
  {
    nombre: 'Distribuidor ABO',
    precio: 'Registro 100% gratuito',
    icono: '🏪',
    color: 'border-emerald-400 bg-emerald-50',
    colorTitulo: 'text-emerald-700',
    badge: 'Más popular',
    badgeColor: 'bg-emerald-500',
    items: [
      'Registro sin ningún costo',
      'Código de distribuidor activo',
      'Compras los productos que TÚ quieres distribuir',
      'Descuentos de hasta 30% en tus pedidos',
      'Bonificaciones por ventas y equipo',
      'Capacitación completa con Andy',
    ],
  },
  {
    nombre: 'Cliente Preferido',
    precio: 'Registro 100% gratuito',
    icono: '⭐',
    color: 'border-blue-300 bg-blue-50',
    colorTitulo: 'text-blue-700',
    badge: 'Sin compromiso',
    badgeColor: 'bg-blue-500',
    items: [
      'Registro sin ningún costo',
      'Acceso a productos Amway a precio especial',
      'Compras solo lo que necesitas, cuando quieras',
      'Sin metas ni compromisos de venta',
      'Puedes subir a ABO en cualquier momento',
    ],
  },
]

const BENEFICIOS = [
  { icon: '📦', txt: '65+ años de historia. Amway opera en más de 100 países.' },
  { icon: '💰', txt: 'Ganas desde tu primera venta. Sin cuotas obligatorias.' },
  { icon: '📱', txt: 'Trabajo desde tu celular, a tu propio ritmo.' },
  { icon: '🎓', txt: 'Academia VitaGloss RD + grupo privado del equipo.' },
  { icon: '🤝', txt: 'Tutoría directa conmigo — Andy Rosado.' },
  { icon: '🌐', txt: 'Tu propio negocio. Tú pones los precios y las horas.' },
]

const TESTIMONIOS = [
  {
    nombre: 'María G.',
    ubicacion: 'Santo Domingo',
    texto: 'Empecé sin saber nada de ventas. La primera semana ya tenía 3 clientes por Instagram. Andy me explicó todo paso a paso, nunca me dejó sola.',
    estrellas: 5,
    inicial: 'M',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    nombre: 'Carlos R.',
    ubicacion: 'Santiago',
    texto: 'Me registré gratis en menos de 10 minutos. Lo que más me ayudó fue la Academia y el grupo privado del equipo. Totalmente diferente a hacer todo solo.',
    estrellas: 5,
    inicial: 'C',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    nombre: 'Yolanda M.',
    ubicacion: 'La Romana',
    texto: 'Pensé que era una pirámide. Pero vi el video de Andy, le escribí y me aclaró todo. Llevo 4 meses y ya tengo mi propio equipo de ventas.',
    estrellas: 5,
    inicial: 'Y',
    color: 'from-violet-500 to-purple-600',
  },
  {
    nombre: 'Ramón D.',
    ubicacion: 'San Pedro de Macorís',
    texto: 'Lo que más me gustó es que no tuve que invertir nada para empezar. Me registré, recibí mi código y Andy me enseñó cómo hacer mis primeras ventas por WhatsApp.',
    estrellas: 5,
    inicial: 'R',
    color: 'from-orange-500 to-amber-500',
  },
  {
    nombre: 'Luisa F.',
    ubicacion: 'Puerto Plata',
    texto: 'Soy ama de casa y esto me cambió la vida. Vendo por Instagram y WhatsApp desde mi teléfono. El primer mes ya recuperé lo que gasté en mis productos.',
    estrellas: 5,
    inicial: 'L',
    color: 'from-pink-500 to-rose-500',
  },
  {
    nombre: 'José A.',
    ubicacion: 'Santo Domingo Este',
    texto: 'Tenía dudas al principio, pero Andy me respondió todas mis preguntas antes de registrarme. Esa confianza me convenció. Hoy recomiendo los productos Nutrilite a toda mi familia.',
    estrellas: 5,
    inicial: 'J',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    nombre: 'Patricia V.',
    ubicacion: 'Higüey',
    texto: 'Lo que más valoro es la Academia. Tiene videos explicando cada producto y cómo venderlo. Nunca me sentí perdida porque tenía todo el material disponible.',
    estrellas: 5,
    inicial: 'P',
    color: 'from-fuchsia-500 to-purple-600',
  },
  {
    nombre: 'Ernesto S.',
    ubicacion: 'La Vega',
    texto: 'Estaba buscando un ingreso extra sin dejar mi trabajo. Con Amway puedo trabajar a mi ritmo, en mis horas libres. Ya llevo 3 meses y cada mes vendo un poco más.',
    estrellas: 5,
    inicial: 'E',
    color: 'from-lime-500 to-green-600',
  },
  {
    nombre: 'Daniela P.',
    ubicacion: 'Santiago Rodríguez',
    texto: 'Andy me contactó rápido después de que llené el formulario. Me explicó todo en una llamada de WhatsApp y esa misma tarde ya estaba registrada. Superó mis expectativas.',
    estrellas: 5,
    inicial: 'D',
    color: 'from-sky-500 to-cyan-600',
  },
  {
    nombre: 'Miguel H.',
    ubicacion: 'Barahona',
    texto: 'Los productos Amway se venden solos porque la gente ya los conoce y confía en ellos. Yo solo los ofrezco y la gente pide. Muy diferente a vender productos desconocidos.',
    estrellas: 5,
    inicial: 'M',
    color: 'from-red-500 to-orange-500',
  },
]

const FAQS = [
  {
    q: '¿Qué necesito para registrarme en Amway?',
    a: 'Solo tu nombre, apellido y un correo electrónico válido. Amway te envía un enlace de verificación y tú mismo/a completas el proceso desde tu celular o computadora — sin costo y sin intermediarios.',
  },
  {
    q: '¿Necesito experiencia previa en ventas?',
    a: 'Cero. Yo empecé sin experiencia. La Academia VitaGloss RD y mi acompañamiento personal te enseñan absolutamente todo paso a paso.',
  },
  {
    q: '¿Es Amway una pirámide?',
    a: 'No. Amway lleva más de 65 años operando en más de 100 países. El ingreso viene de vender productos reales, no de reclutar personas. Es una empresa reconocida mundialmente.',
  },
  {
    q: '¿Cuánto tiempo necesito dedicarle?',
    a: 'Lo que tú decidas. La mayoría del equipo empieza con 1-2 horas al día usando el celular. No hay horario fijo ni zona geográfica.',
  },
  {
    q: '¿Me ayudas a registrarme?',
    a: 'Sí, personalmente. Escríbeme por WhatsApp después de ver el video y te guío en tiempo real en los pasos de registro en Amway.com.',
  },
  {
    q: '¿Qué productos vendo?',
    a: 'Vitaminas Nutrilite™, pasta y enjuague bucal Glister™, suplementos energizantes XS™, productos de belleza Artistry™ y más. Productos que la gente ya busca y necesita.',
  },
]

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

// ─── FAQ item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a, idx }) {
  const [open, setOpen] = useState(false)
  return (
    <m.div {...fadeUp(idx * 0.07)} className="border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold text-white/90 text-sm">{q}</span>
        <span className={`text-emerald-400 text-xl flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            transition={{ duration: 0.22 }} className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-white/50 text-sm leading-relaxed">{a}</p>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  )
}

// ─── WA SVG icon (reutilizable) ──────────────────────────────────────────────
const WaIcon = ({ cls = 'w-5 h-5' }) => (
  <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12.05 2.003A9.87 9.87 0 002.19 11.89c0 1.74.454 3.448 1.317 4.959L2 22l5.317-1.394A9.87 9.87 0 0012.05 21.777h.003c5.462 0 9.91-4.445 9.91-9.91 0-2.648-1.03-5.137-2.902-7.007A9.855 9.855 0 0012.053 2l-.003.003z" />
  </svg>
)

// ─── Lead Form ────────────────────────────────────────────────────────────────
function LeadForm() {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) return setError('Por favor escribe tu nombre.')
    setLoading(true)
    setError('')
    try {
      await api.createPublicLead({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        productoInteres: 'Registro Amway',
        origen: 'amway-landing',
      })
      setDone(true)
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', { content_name: 'Amway Registration' })
      }
    } catch {
      setError('Algo salió mal, inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-3">🎉</div>
        <p className="font-black text-white text-lg mb-1">¡Recibido, {nombre.split(' ')[0]}!</p>
        <p className="text-white/50 text-sm mb-5">Andy te contactará pronto. También puedes escribirle ahora mismo:</p>
        <a
          href={WA_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-2xl transition-all"
        >
          <WaIcon />
          Escribir a Andy ahora
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <input
        type="text"
        placeholder="Tu nombre completo *"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        className="w-full bg-white/8 border border-white/15 text-white placeholder-white/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400/60 transition-colors"
        maxLength={60}
      />
      <input
        type="tel"
        placeholder="Tu número de WhatsApp (opcional)"
        value={telefono}
        onChange={e => setTelefono(e.target.value)}
        className="w-full bg-white/8 border border-white/15 text-white placeholder-white/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400/60 transition-colors"
        maxLength={20}
      />
      {error && <p className="text-red-400 text-xs px-1">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-all text-sm"
      >
        {loading ? 'Enviando...' : 'Quiero que Andy me contacte →'}
      </button>
      <p className="text-white/20 text-xs text-center">Sin spam. Solo Andy te contactará personalmente.</p>
    </form>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function IniciaEnAmway() {
  useSEO({
    title: 'Cómo iniciar en Amway – VitaGloss RD con Andy Rosado',
    description: 'Aprende las modalidades de registro en Amway y cómo empezar a vender desde tu celular con el equipo VitaGloss RD. Video explicativo completo.',
    canonical: 'https://vitaglossrd.com/empieza',
    ogImage: 'https://vitaglossrd.com/Foto-profesional.webp',
  })

  const videoRef = useRef(null)
  const formRef  = useRef(null)
  const [shown, setShown] = useState(false)
  const [cupos] = useState(() => {
    const saved = sessionStorage.getItem('vg_cupos_amway')
    if (saved) return parseInt(saved)
    const val = Math.floor(Math.random() * 4) + 4 // 4–7
    sessionStorage.setItem('vg_cupos_amway', val)
    return val
  })

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 400)
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_name: 'Amway Registration Landing',
        content_category: 'Amway',
      })
    }
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#070d1a] text-white">

      {/* ── URGENCIA STRIP ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/15 border-b border-amber-400/20 py-2.5 px-4 text-center">
        <p className="text-amber-300 text-xs sm:text-sm font-bold">
          🟡 Andy está aceptando nuevos socios este mes —{' '}
          <span className="text-white">solo {cupos} cupos disponibles</span>
        </p>
      </div>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-teal-400/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 pt-12 pb-0 text-center">
          {/* Badge */}
          <m.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : -10 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Equipo VitaGloss RD · Andy Rosado
          </m.div>

          {/* Headline */}
          <m.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4"
          >
            Así es como
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              inicias en Amway
            </span>
            desde República Dominicana
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 16 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Mira este video antes de registrarte. Explico las <strong className="text-white/80">modalidades de registro</strong>, lo que incluye cada una y cómo empezar a ganar desde el primer día.
          </m.p>

          {/* CTA buttons */}
          <m.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 16 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          >
            <button
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black px-7 py-4 rounded-2xl shadow-lg shadow-emerald-900/40 transition-all hover:scale-105 text-base"
            >
              ✍️ Quiero unirme al equipo
            </button>
            <button
              onClick={() => videoRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 border border-white/15 text-white font-bold px-7 py-4 rounded-2xl transition-all text-base"
            >
              ▼ Ver el video primero
            </button>
          </m.div>
        </div>
      </section>

      {/* ── VIDEO ────────────────────────────────────────────────────────── */}
      <section ref={videoRef} className="max-w-4xl mx-auto px-4 -mt-2 pb-10">
        <m.div
          {...fadeUp(0)}
          className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-white/8"
        >
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-400/10 to-cyan-500/20 rounded-3xl blur-xl -z-10" />

          {/* Video label */}
          <div className="bg-[#0d1b2e] px-5 py-3 flex items-center gap-3 border-b border-white/8">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="text-red-500">▶</span>
              Modalidades Amway — Equipo VitaGloss RD
            </div>
          </div>

          {/* YT Player */}
          <div className="aspect-video bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&color=white`}
              title="Cómo iniciar en Amway — Modalidades de registro · VitaGloss RD"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* After-video CTA */}
          <div className="bg-[#0d1b2e] px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/8">
            <p className="text-white/50 text-sm">
              <span className="text-white/80 font-semibold">¿Listo/a?</span> Déjame tus datos o escríbeme directamente.
            </p>
            <a
              href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all"
            >
              <WaIcon cls="w-4 h-4" />
              Habla conmigo →
            </a>
          </div>
        </m.div>
      </section>

      {/* ── LEAD FORM ────────────────────────────────────────────────────── */}
      <section ref={formRef} className="max-w-4xl mx-auto px-4 pb-16">
        <m.div {...fadeUp()} className="grid sm:grid-cols-2 gap-8 items-center bg-gradient-to-br from-[#0f2040] to-[#0a1628] border border-emerald-500/20 rounded-3xl p-8">
          <div>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Cupo disponible</p>
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Déjame tus datos y<br />
              <span className="text-emerald-400">te contacto personalmente</span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Sin spam. Solo Andy se pondrá en contacto contigo para responder tus dudas y guiarte en el proceso de registro.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <img src="/Foto-profesional.webp" alt="Andy Rosado" className="w-10 h-10 rounded-full object-cover object-top" />
              <div>
                <p className="text-white font-bold text-sm">Andy Rosado</p>
                <p className="text-white/40 text-xs">Distribuidor Amway · VitaGloss RD</p>
              </div>
            </div>
          </div>
          <div>
            <LeadForm />
          </div>
        </m.div>
      </section>

      {/* ── PASOS ──────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <m.div {...fadeUp()} className="text-center mb-10">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">El proceso</p>
          <h2 className="text-3xl sm:text-4xl font-black">4 pasos para empezar</h2>
          <p className="text-white/40 mt-2">Desde ver el video hasta tener tu primera venta</p>
        </m.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {PASOS.map((paso, i) => (
            <m.div key={i} {...fadeUp(i * 0.1)} className="bg-white/4 border border-white/8 rounded-3xl p-6 hover:bg-white/6 transition-colors group">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${paso.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                  {paso.icon}
                </div>
                <div>
                  <p className="text-white/25 text-xs font-black tracking-widest uppercase mb-1">Paso {paso.num}</p>
                  <h3 className="font-black text-white text-base mb-1.5">{paso.titulo}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{paso.desc}</p>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </section>

      {/* ── MODALIDADES ────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <m.div {...fadeUp()} className="text-center mb-10">
          <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-2">¿Cuál te conviene?</p>
          <h2 className="text-3xl sm:text-4xl font-black">Modalidades de registro</h2>
          <p className="text-white/40 mt-2">Elige la que más se adapte a tu objetivo</p>
        </m.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {MODALIDADES.map((mod, i) => (
            <div key={i} className={`rounded-3xl border-2 ${mod.color} p-6 relative overflow-hidden`}>
              <span className={`absolute top-4 right-4 text-white text-[10px] font-black px-2.5 py-1 rounded-full ${mod.badgeColor}`}>{mod.badge}</span>
              <div className="text-4xl mb-3">{mod.icono}</div>
              <h3 className={`font-black text-xl mb-1 ${mod.colorTitulo}`}>{mod.nombre}</h3>
              <p className="text-gray-600 font-bold text-sm mb-4">{mod.precio}</p>
              <ul className="space-y-2">
                {mod.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-emerald-500 font-black flex-shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={WA_URL} target="_blank" rel="noopener noreferrer"
                className={`mt-5 flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-2xl transition-all ${i === 0 ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-[#0a1628] hover:bg-[#1B3A6B] text-white'}`}
              >
                Quiero esta modalidad →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENEFICIOS RÁPIDOS ──────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <m.div {...fadeUp()} className="bg-gradient-to-br from-[#0f2040] to-[#0a1628] border border-white/8 rounded-3xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black">¿Por qué elegir Amway + Equipo VitaGloss?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFICIOS.map((b, i) => (
              <m.div key={i} {...fadeUp(i * 0.08)} className="flex items-start gap-3 p-4 bg-white/4 rounded-2xl border border-white/6">
                <span className="text-2xl flex-shrink-0">{b.icon}</span>
                <p className="text-white/65 text-sm leading-relaxed">{b.txt}</p>
              </m.div>
            ))}
          </div>
        </m.div>
      </section>

      {/* ── TESTIMONIOS ────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <m.div {...fadeUp()} className="text-center mb-10">
          <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">Lo dice el equipo</p>
          <h2 className="text-3xl sm:text-4xl font-black">Personas que ya empezaron</h2>
          <p className="text-white/40 mt-2">Miembros reales del equipo VitaGloss RD</p>
        </m.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIOS.map((t, i) => (
            <m.div key={i} {...fadeUp(i * 0.1)} className="bg-white/3 border border-white/8 rounded-3xl p-6 flex flex-col gap-4">
              <div className="flex gap-0.5">
                {Array.from({ length: t.estrellas }).map((_, s) => (
                  <span key={s} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-white/65 text-sm leading-relaxed flex-1">"{t.texto}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>
                  {t.inicial}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{t.nombre}</p>
                  <p className="text-white/30 text-xs">{t.ubicacion}</p>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </section>

      {/* ── SOBRE ANDY ──────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <m.div {...fadeUp()} className="flex flex-col sm:flex-row items-center gap-8 bg-white/3 border border-white/8 rounded-3xl p-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden flex-shrink-0 shadow-xl shadow-emerald-900/40">
            <img src="/Foto-profesional.webp" alt="Andy Rosado" className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Tu guía en este proceso</p>
            <h3 className="text-2xl font-black mb-2">Andy Rosado</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Distribuidor independiente Amway y fundador del equipo VitaGloss RD. Llevo años ayudando a personas en República Dominicana a construir su propio negocio desde cero usando productos de salud, ventas por WhatsApp y redes sociales. Cuando te registras conmigo, no estás solo/a — recibes tutoría directa y acceso a la Academia VitaGloss RD.
            </p>
            <a
              href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-bold transition-colors"
            >
              <WaIcon cls="w-4 h-4" />
              Escríbeme directamente →
            </a>
          </div>
        </m.div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <m.div {...fadeUp()} className="text-center mb-8">
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-2">Preguntas frecuentes</p>
          <h2 className="text-3xl font-black">¿Tienes dudas?</h2>
        </m.div>
        <div className="space-y-2">
          {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} idx={i} />)}
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <m.div
          {...fadeUp()}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-10 text-center shadow-2xl shadow-emerald-900/40"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">¿Listo/a para empezar?</h2>
            <p className="text-emerald-100/80 text-lg mb-8 max-w-lg mx-auto">
              Mira el video, elige tu modalidad y escríbeme. El proceso de registro toma menos de 10 minutos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={WA_URL} target="_blank" rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 font-black px-8 py-4 rounded-2xl shadow-lg transition-all hover:scale-105 text-base"
              >
                <WaIcon />
                Hablar con Andy — WhatsApp
              </a>
              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl transition-all text-base"
              >
                ✍️ Dejar mis datos
              </button>
            </div>
          </div>
        </m.div>
      </section>

      {/* ── FOOTER minimal ──────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} VitaGloss RD · Distribuidor Independiente Amway · República Dominicana
        </p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <a href="/privacidad" className="text-white/20 hover:text-white/40 text-xs transition-colors">Privacidad</a>
          <a href="/terminos" className="text-white/20 hover:text-white/40 text-xs transition-colors">Términos</a>
          <a href="/" className="text-white/20 hover:text-white/40 text-xs transition-colors">Tienda VitaGloss RD</a>
        </div>
      </footer>
    </div>
  )
}
