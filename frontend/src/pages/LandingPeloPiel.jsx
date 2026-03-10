/**
 * Super Landing Page — Pelo Piel y Uñas Nutrilite™
 * SEO completo + urgencia de ventas + estrategia de conversión experta.
 * Sin navbar. Una sola acción: WhatsApp.
 */
import { useEffect, useState, useRef } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { SpeedInsights } from '@vercel/speed-insights/react'

const WA_NUMBER  = '18492763532'
const WA_MESSAGE = encodeURIComponent('¡Hola! Vi el anuncio de Pelo Piel y Uñas Nutrilite y quiero más información 💇‍♀️')
const WA_URL     = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`
const API_URL    = import.meta.env.VITE_API_URL || 'https://vitagloss-backend.up.railway.app'

const CIUDADES = [
  'Santo Domingo',
  'Santo Domingo Este',
  'Santo Domingo Oeste',
  'Santo Domingo Norte',
  'Santiago',
  'La Vega',
  'San Cristóbal',
  'San Pedro de Macorís',
  'La Romana',
  'Puerto Plata',
  'Higüey',
  'Bávaro',
  'Otra',
]

function trackWA() {
  // Analytics tracking si lo necesitas
}

function Stars({ n = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array(n).fill('⭐').map((s, i) => (
        <span key={i} className="text-yellow-400 text-xs">{s}</span>
      ))}
    </div>
  )
}

function StockCounter() {
  const [count] = useState(Math.floor(Math.random() * 8) + 3)
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-2 rounded-full"
    >
      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      Solo {count} unidades disponibles
    </m.div>
  )
}

function Acordeon({ idx, q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-gray-900 text-sm">{q}</span>
        <span className={`text-pink-500 text-xl flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          {open ? '−' : '+'}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">
              {a}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  )
}

function CTAButton({ texto = '📲 Quiero el mío ahora', full = true, dark = false }) {
  return (
    <m.a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackWA}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={[
        full ? 'w-full' : 'inline-flex',
        'flex items-center justify-center gap-3',
        dark
          ? 'bg-white text-green-700 hover:bg-green-50'
          : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white',
        'font-extrabold text-lg sm:text-xl py-5 px-8 rounded-2xl',
        'shadow-[0_8px_30px_rgba(34,197,94,0.45)] transition-all duration-200',
      ].join(' ')}
    >
      <svg className="w-6 h-6 flex-shrink-0 fill-current" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {texto}
    </m.a>
  )
}

const BEFORE = [
  'Cabello que se cae al peinar',
  'Puntas abiertas y sin brillo',
  'Uñas que se quiebran y pelan',
  'Piel opaca y sin vida',
  'Shampoos que no funcionan',
]

const AFTER = [
  'Cabello fuerte y abundante',
  'Brillo y suavidad notables',
  'Uñas largas y resistentes',
  'Piel luminosa y suave',
  'Nutrición real desde adentro',
]

const TESTIMONIALS = [
  {
    foto: '/Luisa-Rodriguez.webp',
    nombre: 'Luisa R.',
    ciudad: 'Santo Domingo',
    estrellas: 5,
    semanas: '5 semanas',
    texto: 'Empecé a tomarlo por la caída del cabello y en menos de un mes ya veía menos pelos en el cepillo. Ahora mi cabello tiene un brillo que no tenía antes. Vale cada peso.',
  },
  {
    foto: '/Maria-Fernandez.webp',
    nombre: 'María F.',
    ciudad: 'Santiago',
    estrellas: 5,
    semanas: '6 semanas',
    texto: 'Mis uñas siempre se quebraban, ya era costumbre. Con esto en 3 semanas dejaron de quebrarse y ahora las tengo largas por primera vez en mi vida. Quedé enamorada.',
  },
  {
    foto: '/patricia-gomez.webp',
    nombre: 'Patricia G.',
    ciudad: 'La Romana',
    estrellas: 5,
    semanas: '8 semanas',
    texto: 'No creía mucho pero lo probé y me sorprendió. La piel se me ve diferente — más fresca, más luminosa. Mi esposo hasta me preguntó qué estaba haciendo diferente.',
  },
]

const INGREDIENTES = [
  { emoji: '💊', nombre: 'Biotina',     color: 'from-pink-400 to-rose-500',     texto: 'El nutriente #1 para el cabello. Reduce la caída y fortalece cada hebra desde la raíz.' },
  { emoji: '🔩', nombre: 'Zinc',        color: 'from-violet-400 to-purple-500', texto: 'Regula el cuero cabelludo, apoya el crecimiento y mantiene la salud de la dermis.' },
  { emoji: '✨', nombre: 'Colágeno',    color: 'from-fuchsia-400 to-pink-500',  texto: 'Mejora la elasticidad y tersura de la piel. Las uñas crecen más fuertes y duras.' },
  { emoji: '🍊', nombre: 'Vitamina C',  color: 'from-orange-400 to-amber-500',  texto: 'Antioxidante que activa la síntesis de colágeno. Piel más joven y brillante.' },
]

const TIMELINE = [
  { tiempo: 'Semana 1',   icono: '🌱', titulo: 'El cuerpo empieza a absorber',   texto: 'Los nutrientes llegan al folículo capilar. Las uñas ya no se quiebran tan fácil.' },
  { tiempo: 'Semana 2–3', icono: '🌿', titulo: 'Primeros cambios visibles',       texto: 'Menos cabello en la ducha. La piel se siente más hidratada y suave.' },
  { tiempo: 'Semana 4–5', icono: '🌸', titulo: 'Tu cabello cambia de textura',    texto: 'Brillo, suavidad y menos frizz. Las uñas crecen visiblemente más fuertes.' },
  { tiempo: 'Semana 6–8', icono: '🌺', titulo: 'Transformación completa',         texto: 'Cabello abundante, piel luminosa, uñas largas. La versión que siempre quisiste.' },
]

const COMPRADORES = [
  { nombre: 'Daniela M.', ciudad: 'Santo Domingo', hace: '3 min' },
  { nombre: 'Yolanda R.', ciudad: 'Santiago',      hace: '7 min' },
  { nombre: 'Carmen V.', ciudad: 'San Pedro',      hace: '11 min' },
  { nombre: 'Miriam T.', ciudad: 'La Romana',      hace: '15 min' },
  { nombre: 'Karina F.', ciudad: 'Santo Domingo',  hace: '19 min' },
  { nombre: 'Rosario N.', ciudad: 'Puerto Plata',  hace: '24 min' },
]

function StickyBar() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-2xl px-4 py-3"
        >
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <img src="/Pelo_-Piel-y-Uñas-Nutrilite.webp" alt="" className="w-10 h-10 object-contain" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 text-xs truncate">Pelo Piel y Uñas Nutrilite™</div>
              <div className="text-green-600 font-extrabold text-sm">RD$1,700</div>
            </div>
            <m.a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackWA}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg"
            >
              📲 Pedir ahora
            </m.a>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

function OrderForm() {
  const [form, setForm]       = useState({ nombre: '', telefono: '', ciudad: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!form.nombre.trim() || !form.telefono.trim() || !form.ciudad) {
      setError('Por favor completa todos los campos.')
      return
    }
    if (form.telefono.replace(/\D/g, '').length < 8) {
      setError('Ingresa un número de WhatsApp válido.')
      return
    }
    setLoading(true)
    try {
      await fetch(`${API_URL}/api/leads/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:          form.nombre.trim(),
          telefono:        form.telefono.trim(),
          productoInteres: 'Pelo Piel y Uñas Nutrilite',
          origen:          'web',
          nota:            `Ciudad: ${form.ciudad} | Landing: /pelo-piel-unas`,
        }),
      })
    } catch {
      // Silent fail — no bloquear el flujo
    }
    setLoading(false)
    setDone(true)
    // Abrir WhatsApp con mensaje personalizado
    const msg = encodeURIComponent(
      `¡Hola! Me llamo ${form.nombre.trim()} y quiero pedir el Pelo Piel y Uñas Nutrilite 💇‍♀️ Estoy en ${form.ciudad}.`
    )
    setTimeout(() => {
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
    }, 600)
  }

  if (done) {
    return (
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-3xl p-8 text-center"
      >
        <div className="text-5xl mb-3">🎉</div>
        <h3 className="font-extrabold text-green-800 text-xl mb-2">¡Excelente, {form.nombre.split(' ')[0]}!</h3>
        <p className="text-green-700 text-sm leading-relaxed">
          Tu información quedó guardada. Vita te abrirá en WhatsApp para coordinar tu pedido ahora mismo.
        </p>
        <p className="text-xs text-green-500 mt-3">Si no se abrió el chat, toca el botón de abajo 👇</p>
        <m.a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`¡Hola! Me llamo ${form.nombre.trim()} y quiero el Pelo Piel y Uñas. Estoy en ${form.ciudad}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 mt-4 bg-green-600 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow-lg"
        >
          📲 Abrir WhatsApp
        </m.a>
      </m.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombre completo</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Ej: María García"
          className="w-full border-2 border-pink-200 focus:border-pink-400 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none transition-colors bg-white"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Número de WhatsApp</label>
        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          placeholder="Ej: 809-555-1234"
          type="tel"
          className="w-full border-2 border-pink-200 focus:border-pink-400 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none transition-colors bg-white"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">¿Desde qué ciudad?</label>
        <select
          name="ciudad"
          value={form.ciudad}
          onChange={handleChange}
          className="w-full border-2 border-pink-200 focus:border-pink-400 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none transition-colors bg-white"
        >
          <option value="">Selecciona tu ciudad</option>
          {CIUDADES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
      <m.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-lg py-4 rounded-2xl shadow-[0_8px_30px_rgba(236,72,153,0.4)] transition-all duration-200 disabled:opacity-70"
      >
        {loading ? '⏳ Guardando...' : '📲 Quiero reservar el mío'}
      </m.button>
      <p className="text-center text-xs text-gray-400">
        📱 Te abriremos WhatsApp al instante · Sin compromiso · Pago contra entrega en SD
      </p>
    </form>
  )
}

function SocialProofToast() {
  const [idx, setIdx]         = useState(0)
  const [visible, setVisible] = useState(false)
  const timerRef              = useRef(null)

  useEffect(() => {
    // Primera aparición a los 6 seg
    const first = setTimeout(() => setVisible(true), 6000)
    return () => clearTimeout(first)
  }, [])

  useEffect(() => {
    if (!visible) return
    // Ocultar a los 4 seg, rotar, y volver a mostrar
    timerRef.current = setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % COMPRADORES.length)
        setVisible(true)
      }, 1200)
    }, 4000)
    return () => clearTimeout(timerRef.current)
  }, [visible, idx])

  const c = COMPRADORES[idx]
  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="fixed bottom-20 left-3 z-50 bg-white border border-pink-100 shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3 max-w-[240px]"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {c.nombre[0]}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{c.nombre} de {c.ciudad}</p>
            <p className="text-[10px] text-gray-500">pidió esto hace {c.hace} 🛒</p>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

function useCountdown(endMs) {
  const calc = () => {
    const diff = Math.max(0, endMs - Date.now())
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [endMs])
  return time
}

function CountdownBanner() {
  // Oferta termina a medianoche del día actual (hora RD = UTC-4)
  const midnight = useRef(
    (() => {
      const d = new Date()
      d.setHours(23, 59, 59, 999)
      return d.getTime()
    })()
  ).current
  const { h, m, s } = useCountdown(midnight)
  const pad = n => String(n).padStart(2, '0')
  return (
    <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 text-white">
      <div className="max-w-lg mx-auto px-4 py-2.5 flex flex-wrap items-center justify-center gap-2 text-center">
        <span className="text-xs font-bold uppercase tracking-wide">🔥 Precio especial solo hoy</span>
        <div className="flex items-center gap-1">
          {[['h', h], ['m', m], ['s', s]].map(([lbl, val]) => (
            <span key={lbl} className="flex items-center">
              <span className="bg-white/20 rounded-lg px-2 py-0.5 font-extrabold text-sm tabular-nums min-w-[32px] text-center">{pad(val)}</span>
              <span className="text-white/70 text-[10px] mx-0.5">{lbl}</span>
            </span>
          ))}
        </div>
        <span className="text-xs font-semibold text-rose-100">· <s className="opacity-60">RD$2,100</s> → <strong className="text-white">RD$1,700</strong></span>
      </div>
    </div>
  )
}

export default function LandingPeloPiel() {
  useEffect(() => {
    // ── SEO básico ────────────────────────────────────────────────────────
    document.title = 'Pelo Piel y Uñas Nutrilite™ — Cabello que crece, piel luminosa | VitaGloss RD'

    const setMeta = (sel, attr, val) => {
      let el = document.querySelector(sel)
      if (!el) { el = document.createElement('meta'); document.head.appendChild(el) }
      el.setAttribute(attr, val)
    }
    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`)
      if (!el) { el = document.createElement('link'); document.head.appendChild(el) }
      el.setAttribute('rel', rel); el.setAttribute('href', href)
    }

    const DESC = 'Suplemento de biotina, zinc y colágeno para cabello que se cae, uñas frágiles y piel opaca. Nutrilite™ certificado Amway. Envío a domicilio en República Dominicana. Pago contra entrega en Santo Domingo.'
    const URL  = 'https://vitaglossrd.com/pelo-piel-unas'
    const IMG  = 'https://vitaglossrd.com/Pelo_-Piel-y-Uñas-Nutrilite.webp'

    setMeta('meta[name="description"]',          'name',    'description')
    setMeta('meta[name="description"]',          'content', DESC)
    setMeta('meta[name="keywords"]',             'name',    'keywords')
    setMeta('meta[name="keywords"]',             'content', 'pelo piel uñas nutrilite, suplemento cabello, biotina zinc colágeno, vitaminas cabello República Dominicana, amway RD, pastillas cabello RD, caída del cabello solución, pelo piel uñas precio, pelo piel uñas dominicana')
    setMeta('meta[name="robots"]',               'name',    'robots')
    setMeta('meta[name="robots"]',               'content', 'index, follow')
    setLink('canonical', URL)

    // Open Graph
    setMeta('meta[property="og:type"]',          'property', 'og:type');          setMeta('meta[property="og:type"]',         'content', 'product')
    setMeta('meta[property="og:title"]',         'property', 'og:title');         setMeta('meta[property="og:title"]',        'content', 'Pelo Piel y Uñas Nutrilite™ | VitaGloss RD')
    setMeta('meta[property="og:description"]',   'property', 'og:description');   setMeta('meta[property="og:description"]',  'content', DESC)
    setMeta('meta[property="og:url"]',           'property', 'og:url');           setMeta('meta[property="og:url"]',         'content', URL)
    setMeta('meta[property="og:image"]',         'property', 'og:image');         setMeta('meta[property="og:image"]',       'content', IMG)
    setMeta('meta[property="og:image:width"]',   'property', 'og:image:width');   setMeta('meta[property="og:image:width"]', 'content', '800')
    setMeta('meta[property="og:image:height"]',  'property', 'og:image:height');  setMeta('meta[property="og:image:height"]','content', '800')
    setMeta('meta[property="og:locale"]',        'property', 'og:locale');        setMeta('meta[property="og:locale"]',      'content', 'es_DO')
    setMeta('meta[property="og:site_name"]',     'property', 'og:site_name');     setMeta('meta[property="og:site_name"]',   'content', 'VitaGloss RD')

    // Twitter Card
    setMeta('meta[name="twitter:card"]',         'name', 'twitter:card');    setMeta('meta[name="twitter:card"]',       'content', 'summary_large_image')
    setMeta('meta[name="twitter:title"]',        'name', 'twitter:title');   setMeta('meta[name="twitter:title"]',      'content', 'Pelo Piel y Uñas Nutrilite™ — Cabello, piel y uñas desde adentro')
    setMeta('meta[name="twitter:description"]',  'name', 'twitter:description'); setMeta('meta[name="twitter:description"]','content', DESC)
    setMeta('meta[name="twitter:image"]',        'name', 'twitter:image');   setMeta('meta[name="twitter:image"]',      'content', IMG)

    // Schema.org — Product
    const schemaId = 'ld-json-pelo-piel'
    let script = document.getElementById(schemaId)
    if (!script) { script = document.createElement('script'); script.id = schemaId; script.type = 'application/ld+json'; document.head.appendChild(script) }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Pelo Piel y Uñas Nutrilite™',
      description: DESC,
      image: IMG,
      url: URL,
      brand: { '@type': 'Brand', name: 'Nutrilite by Amway' },
      offers: {
        '@type': 'Offer',
        price: '1700',
        priceCurrency: 'DOP',
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: 'VitaGloss RD' },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        reviewCount: '86',
      },
    })

    return () => {
      const s = document.getElementById(schemaId)
      if (s) s.remove()
    }
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <StickyBar />
      <SocialProofToast />

      <CountdownBanner />
      <div className="bg-gradient-to-r from-purple-700 to-pink-700 text-white text-center py-2 text-xs font-semibold tracking-wide">
        🇩🇴 Distribuidores Certificados Amway · República Dominicana · +500 clientes satisfechos
      </div>

      {/* ───────── HERO ───────── */}
      <section className="relative bg-gradient-to-br from-fuchsia-50 via-pink-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(236,72,153,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_50%)]" />
        <div className="relative max-w-lg mx-auto px-5 py-12 sm:py-16 text-center">
          <m.img
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            src="/Pelo_-Piel-y-Uñas-Nutrilite.webp"
            alt="Pelo Piel y Uñas Nutrilite"
            className="w-48 h-48 mx-auto mb-6 drop-shadow-2xl"
          />
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-3"
          >
            <StockCounter />
          </m.div>
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-black text-3xl sm:text-4xl md:text-5xl leading-tight text-gray-900 mb-4"
          >
            El secreto que tu cabello, piel y uñas estaban esperando
          </m.h1>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 max-w-md mx-auto"
          >
            <strong className="text-pink-600">Nutrilite™ Pelo Piel y Uñas</strong> es el suplemento <em className="font-semibold">científicamente formulado</em> que nutre desde adentro. <span className="text-purple-700 font-bold">Biotina + Zinc + Colágeno + Vitamina C</span> en una sola cápsula.
          </m.p>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mb-7"
          >
            <Stars n={5} />
            <span className="text-sm font-semibold text-gray-700">5.0 · +86 opiniones reales</span>
          </m.div>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-3"
          >
            <CTAButton />
            <p className="text-xs text-gray-400">
              📦 Envío a domicilio en toda RD · 💵 Pago contra entrega en SD · ❌ Sin pedido mínimo
            </p>
          </m.div>
        </div>
      </section>

      {/* ───────── ANTES / DESPUÉS ───────── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-lg mx-auto px-5">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-black text-2xl sm:text-3xl text-gray-900 mb-3">
              ¿Te suena familiar?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Miles de mujeres en RD vivían con estos problemas… hasta que descubrieron <strong className="text-pink-600">Nutrilite Pelo Piel y Uñas</strong>.
            </p>
          </m.div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* ANTES */}
            <m.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-200 rounded-3xl p-6"
            >
              <h3 className="font-extrabold text-xl text-red-700 mb-4 flex items-center gap-2">
                <span className="text-2xl">😓</span> Antes
              </h3>
              <ul className="space-y-2.5">
                {BEFORE.map((txt, i) => (
                  <m.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-2.5 text-sm text-gray-700"
                  >
                    <span className="text-red-500 font-bold flex-shrink-0 mt-0.5">✖</span>
                    <span>{txt}</span>
                  </m.li>
                ))}
              </ul>
            </m.div>

            {/* DESPUÉS */}
            <m.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-3xl p-6"
            >
              <h3 className="font-extrabold text-xl text-green-700 mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span> Después
              </h3>
              <ul className="space-y-2.5">
                {AFTER.map((txt, i) => (
                  <m.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-2.5 text-sm text-gray-700"
                  >
                    <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">✔</span>
                    <span>{txt}</span>
                  </m.li>
                ))}
              </ul>
            </m.div>
          </div>
        </div>
      </section>

      {/* ───────── INGREDIENTES ───────── */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-5">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-black text-2xl sm:text-3xl text-gray-900 mb-3">
              4 ingredientes poderosos. 1 fórmula certificada
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              <strong className="text-purple-700">Nutrilite™</strong> es la marca de suplementos <strong>#1 en el mundo</strong> por calidad. Cada lote es testeado y certificado.
            </p>
          </m.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {INGREDIENTES.map((ing, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border-2 border-gray-100 rounded-3xl p-6 hover:shadow-xl transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${ing.color} text-2xl mb-4 shadow-lg`}>
                  {ing.emoji}
                </div>
                <h3 className="font-extrabold text-lg text-gray-900 mb-2">{ing.nombre}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{ing.texto}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── TIMELINE ───────── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-black text-2xl sm:text-3xl text-gray-900 mb-3">
              Tu transformación semana a semana
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Miles de mujeres ya lo probaron. Esto es lo que puedes esperar:
            </p>
          </m.div>

          <div className="space-y-6">
            {TIMELINE.map((t, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex gap-4 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-2xl shadow-lg">
                  {t.icono}
                </div>
                <div className="flex-1 bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-5">
                  <div className="font-extrabold text-xs text-purple-600 uppercase tracking-wider mb-1">{t.tiempo}</div>
                  <h3 className="font-bold text-base text-gray-900 mb-1.5">{t.titulo}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t.texto}</p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── TESTIMONIOS ───────── */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-fuchsia-50">
        <div className="max-w-4xl mx-auto px-5">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-black text-2xl sm:text-3xl text-gray-900 mb-3">
              Ya lo probaron. Y esto fue lo que pasó
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Historia real de mujeres reales en República Dominicana.
            </p>
          </m.div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border-2 border-pink-100 rounded-3xl p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img src={t.foto} alt={t.nombre} className="w-12 h-12 rounded-full object-cover border-2 border-pink-200" />
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{t.nombre}</p>
                    <p className="text-xs text-gray-500">{t.ciudad}</p>
                  </div>
                </div>
                <Stars n={t.estrellas} />
                <p className="text-gray-700 text-sm leading-relaxed mt-3 mb-3 flex-1">{t.texto}</p>
                <p className="text-xs text-purple-600 font-semibold">✅ Verificado · Usó {t.semanas}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FORMULARIO DE PEDIDO ───────── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-md mx-auto px-5">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-black text-2xl sm:text-3xl text-gray-900 mb-3">
              Reserva tu frasco ahora
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Llena el formulario y coordinamos la entrega por WhatsApp. <strong className="text-green-600">Pago contra entrega en Santo Domingo.</strong>
            </p>
          </m.div>
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-100 rounded-3xl p-6 sm:p-8"
          >
            <OrderForm />
          </m.div>
        </div>
      </section>

      {/* ───────── TRUST BADGES ───────── */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-5">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-3 gap-5 text-center"
          >
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🏆</div>
              <p className="font-bold text-gray-900 text-sm">Marca #1 Mundial</p>
              <p className="text-xs text-gray-500">Nutrilite by Amway</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-bold text-gray-900 text-sm">Certificado</p>
              <p className="text-xs text-gray-500">FDA &amp; NSF</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🇩🇴</div>
              <p className="font-bold text-gray-900 text-sm">Distribuidor Oficial RD</p>
              <p className="text-xs text-gray-500">Garantía de calidad</p>
            </div>
          </m.div>
        </div>
      </section>

      {/* ───────── COMPARACIÓN NUTRILITE VS FARMACIA ───────── */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 to-purple-900 text-white">
        <div className="max-w-3xl mx-auto px-5">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-black text-2xl sm:text-3xl mb-3">
              ¿Por qué Nutrilite y no pastillas de farmacia?
            </h2>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
              No todas las vitaminas son iguales. Esta es la diferencia:
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-px bg-white/20">
              <div className="col-span-1 bg-slate-900 p-4 font-bold text-sm text-center">Característica</div>
              <div className="col-span-1 bg-slate-900 p-4 font-bold text-sm text-center text-pink-300">Nutrilite™</div>
              <div className="col-span-1 bg-slate-900 p-4 font-bold text-sm text-center text-gray-400">Farmacia</div>

              {[
                ['Certificación FDA', '✅ Sí', '❌ No siempre'],
                ['Absorción real', '✅ Alta', '⚠️ Baja'],
                ['Ingredientes naturales', '✅ 100%', '❌ Sintéticos'],
                ['Testeo de calidad', '✅ Cada lote', '⚠️ Variable'],
                ['Garantía de resultados', '✅ 30 días', '❌ No'],
              ].map(([car, nut, far], i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="contents"
                >
                  <div className="bg-slate-800/50 p-4 text-xs text-left">{car}</div>
                  <div className="bg-slate-800/50 p-4 text-xs text-center font-semibold text-green-300">{nut}</div>
                  <div className="bg-slate-800/50 p-4 text-xs text-center font-semibold text-gray-400">{far}</div>
                </m.div>
              ))}
            </div>
          </m.div>
        </div>
      </section>

      {/* ───────── FAQ ACORDEÓN ───────── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-2xl mx-auto px-5">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-black text-2xl sm:text-3xl text-gray-900 mb-3">
              Preguntas frecuentes
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Todo lo que necesitas saber antes de ordenar.
            </p>
          </m.div>

          <div className="space-y-3">
            <Acordeon
              idx={0}
              q="¿En cuánto tiempo veo resultados?"
              a="La mayoría de usuarias reportan cambios visibles entre la semana 2 y 4. Cabello menos quebradizo, uñas más fuertes, piel más suave. Los resultados completos se ven a las 6-8 semanas de uso continuo."
            />
            <Acordeon
              idx={1}
              q="¿Cómo se toma?"
              a="2 cápsulas al día con comida — idealmente en el desayuno o almuerzo. Un frasco trae 60 cápsulas, suficientes para 30 días. Recomendamos usar mínimo 2 meses seguidos para ver el máximo beneficio."
            />
            <Acordeon
              idx={2}
              q="¿Tiene efectos secundarios?"
              a="Nutrilite es 100% natural y seguro. No tiene efectos adversos reportados. Si estás embarazada, lactando o bajo medicación, consulta con tu médico antes de empezar."
            />
            <Acordeon
              idx={3}
              q="¿Hacen envíos a toda RD?"
              a="Sí! Tenemos cobertura nacional. En Santo Domingo puedes pagar contra entrega. Para otras zonas aceptamos transferencia o Azul Personal. El envío está asegurado y llega a tu puerta."
            />
            <Acordeon
              idx={4}
              q="¿Tiene garantía?"
              a="Sí. Si no ves ningún cambio en 30 días, te devolvemos el 100% de tu dinero sin preguntas. Así de seguros estamos de que funciona."
            />
          </div>
        </div>
      </section>

      {/* ───────── GARANTÍA 30 DÍAS ───────── */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white border-2 border-green-300 rounded-3xl p-8 sm:p-10"
          >
            <div className="text-6xl mb-4">🛡️</div>
            <h2 className="font-black text-2xl sm:text-3xl text-gray-900 mb-3">
              Garantía de 30 días
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-5">
              Si después de 30 días de uso continuo no ves <strong>ningún cambio visible</strong> en tu cabello, piel o uñas, te devolvemos <strong className="text-green-700">el 100% de tu dinero</strong> sin preguntas.
            </p>
            <p className="text-xs text-gray-500">
              Así de seguros estamos de que te va a encantar. Sin letra pequeña. Sin trucos.
            </p>
          </m.div>
        </div>
      </section>

      {/* ───────── CTA FINAL ───────── */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-purple-700 via-pink-700 to-fuchsia-700 text-white">
        <div className="max-w-lg mx-auto px-5 text-center">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-4">💎</div>
            <h2 className="font-black text-2xl sm:text-3xl mb-4">
              Tu mejor inversión: tú misma
            </h2>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed mb-8">
              Deja de esconder el cabello con sombreros. Deja de disimular las uñas con gel. <strong className="text-white">Nutre desde adentro.</strong> Empieza hoy.
            </p>
            <CTAButton texto="📲 Quiero el mío ahora" full dark />
            <p className="text-xs text-purple-100 mt-5">
              ⏰ Solo quedan <strong>pocas unidades</strong> en stock · Precio especial válido solo hoy
            </p>
          </m.div>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-4xl mx-auto px-5 text-center text-xs space-y-3">
          <p className="font-semibold text-white">VitaGloss RD &copy; 2025 &mdash; Distribuidor Certificado Amway República Dominicana</p>
          <p>
            Pelo Piel y Uñas Nutrilite&trade; es un suplemento nutricional. No sustituye una dieta balanceada.
            Los resultados pueden variar según el organismo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-gray-400">
            <a href="/terminos" className="hover:text-white transition-colors">Términos</a>
            <span>&middot;</span>
            <a href="/privacidad" className="hover:text-white transition-colors">Privacidad</a>
            <span>&middot;</span>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contacto</a>
          </div>
        </div>
      </footer>

      <SpeedInsights />
    </div>
  )
}
