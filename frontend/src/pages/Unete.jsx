import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../services/api'
import { useSEO } from '../hooks/useSEO'

// ── Cuenta regresiva al próximo webinar (puedes cambiar esta fecha) ──────────
const WEBINAR_DATE = new Date('2026-03-15T19:00:00-04:00') // Sábado 15 marzo 7pm RD

function useCountdown(target) {
  const [diff, setDiff] = useState(target - Date.now())
  useEffect(() => {
    const t = setInterval(() => setDiff(target - Date.now()), 1000)
    return () => clearInterval(t)
  }, [target])
  const total = Math.max(0, diff)
  const d = Math.floor(total / 86400000)
  const h = Math.floor((total % 86400000) / 3600000)
  const m = Math.floor((total % 3600000) / 60000)
  const s = Math.floor((total % 60000) / 1000)
  return { d, h, m, s, ended: total === 0 }
}

const STATS = [
  { val: '200+', label: 'Clientes activos' },
  { val: '3+',   label: 'Años en Amway' },
  { val: '26',   label: 'Productos disponibles' },
  { val: 'RD$',  label: 'Ingresos reales cada mes' },
]

const BENEFICIOS = [
  { icon: '📦', title: 'Productos que se venden solos', desc: 'Amway lleva 65 años en el mercado. Los productos se conocen, tienen certificaciones y resultados reales.' },
  { icon: '📱', title: 'Capacitación completa', desc: 'Te enseño todo desde cero: cómo vender, cómo usar las redes, cómo fidelizar clientes.' },
  { icon: '💰', title: 'Ingresos reales', desc: 'Ganas desde tu primera venta. Sin mínimos de compra al inicio. Tú decides cuánto trabajas.' },
  { icon: '🤝', title: 'Equipo que te respalda', desc: 'No estás solo/a. Tenemos un grupo privado, materiales, campañas y llamadas de apoyo.' },
  { icon: '🌐', title: 'Tu propio negocio', desc: 'No eres empleado. Trabajas a tu ritmo, desde donde quieras, con tu celular.' },
  { icon: '🎓', title: 'Academia digital', desc: 'Acceso a nuestra plataforma de formación con videos, guías y estrategias de ventas.' },
]

const TESTIMONIOS = [
  { nombre: 'María R.', ciudad: 'Santo Domingo', texto: 'Empecé sin saber nada de ventas y en 3 meses ya tenía mis primeros 15 clientes fijos. El apoyo del equipo hace la diferencia.', stars: 5 },
  { nombre: 'Carlos M.', ciudad: 'Santiago', texto: 'Trabajo desde casa, cuido a mis hijos y genero un extra que me permite pagar mis deudas. No esperé milagros, pero sí resultados reales.', stars: 5 },
  { nombre: 'Luisa P.', ciudad: 'La Romana', texto: 'Dudé mucho al principio. Pero el webinar me aclaró todo y vi que esto era serio. Llevo 8 meses y sigo creciendo.', stars: 5 },
]

const FAQS = [
  { q: '¿Necesito experiencia en ventas?', a: 'No. Yo empecé sin ninguna experiencia. En el webinar y la academia te enseño todo paso a paso.' },
  { q: '¿Cuánto dinero necesito para empezar?', a: 'La inversión inicial es mínima. En el webinar explico exactamente cuánto es y cómo recuperarlo rápido.' },
  { q: '¿Es esto una pirámide?', a: 'No. Amway es una empresa con más de 65 años, operando en 100+ países. El ingreso viene de vender productos reales, no de reclutar.' },
  { q: '¿Puedo hacer esto si tengo otro trabajo?', a: 'Absolutamente. La mayoría de mi equipo empezó así. Lo haces a tu tiempo libre, desde tu teléfono.' },
  { q: '¿Qué pasa después del webinar?', a: 'Si te interesa, hablamos por WhatsApp y te guío en los primeros pasos personalmente.' },
]

export default function Unete() {
  useSEO({
    title: 'Únete al equipo VitaGloss RD — Gana un extra vendiendo Amway',
    description: 'Regístrate gratis al webinar y descubre cómo generar ingresos extras desde casa vendiendo productos Amway. Capacitación incluida.',
    canonical: 'https://www.vitaglossrd.com/unete',
  })

  const formRef = useRef(null)
  const { d, h, m, s, ended } = useCountdown(WEBINAR_DATE)

  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', horario: '' })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre || !form.telefono) { setError('Por favor ingresa tu nombre y teléfono.'); return }
    setSending(true); setError('')

    // Intentar guardar en backend; si falla, igual completamos el flujo por WA
    try {
      await api.createPublicLead({
        nombre: form.nombre,
        telefono: form.telefono,
        productoInteres: `WEBINAR — ${form.horario || 'sin preferencia horaria'}`,
        nota: form.email ? `Email: ${form.email}` : '',
        origen: 'webinar',
      })
    } catch {
      // Backend no disponible — continuamos igual, el contacto llega por WA
    }

    // Abrir WhatsApp con los datos del prospecto para no perder ningún registro
    const msg = encodeURIComponent(
      `🎙️ *Registro Webinar Amway*\n\n` +
      `👤 Nombre: ${form.nombre}\n` +
      `📲 Teléfono: ${form.telefono}\n` +
      (form.email ? `📧 Email: ${form.email}\n` : '') +
      (form.horario ? `🕐 Horario: ${form.horario}\n` : '') +
      `\n¡Quiero reservar mi lugar!`
    )
    window.open(`https://wa.me/18492763532?text=${msg}`, '_blank')

    setDone(true)
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── BARRA SUPERIOR ───────────────────────────────────────────────── */}
      <div className="bg-[#0a1628] py-3 px-6 flex items-center justify-between">
        <img src="/logo_final.png" alt="VitaGloss RD" className="h-8 w-auto" />
        <span className="text-xs text-white/60 hidden sm:block">vitaglossrd.com · Distribuidora Amway independiente</span>
        <a
          href="https://wa.me/18492763532?text=Hola, vi el webinar y quiero más información"
          target="_blank" rel="noopener noreferrer"
          className="text-xs bg-[#25D366] text-white font-bold px-3 py-1.5 rounded-full hover:bg-[#1ebe5d] transition-colors"
        >
          💬 WhatsApp
        </a>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0a1628] via-[#1B3A6B] to-[#0a1628] overflow-hidden">
        {/* Destellos decorativos */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2EC4B6]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-[#2EC4B6]/20 border border-[#2EC4B6]/40 text-[#2EC4B6] text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
              🎙️ Webinar gratuito · Cupos limitados
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              ¿Quieres ganar un&nbsp;
              <span className="text-[#2EC4B6]">ingreso extra</span>
              <br />desde tu teléfono?
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Únete a mi equipo Amway. Te enseño exactamente cómo empecé, cuánto gano, y cómo puedes hacerlo tú también — sin experiencia previa, sin jefe, desde donde estés.
            </p>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 bg-[#2EC4B6] hover:bg-teal-400 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-xl transition-all hover:scale-105"
            >
              Quiero registrarme gratis →
            </button>
            <p className="text-white/40 text-sm mt-4">Sin costo · Sin compromiso · 100% online</p>
          </motion.div>

          {/* Cuenta regresiva */}
          {!ended && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="mt-14 inline-flex flex-wrap justify-center gap-4"
            >
              <p className="w-full text-white/50 text-sm font-semibold uppercase tracking-widest mb-2">
                Próximo webinar — sáb 15 de marzo, 7:00 pm
              </p>
              {[{ v: d, l: 'Días' }, { v: h, l: 'Horas' }, { v: m, l: 'Minutos' }, { v: s, l: 'Segundos' }].map(({ v, l }) => (
                <div key={l} className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl px-6 py-4 min-w-[80px] text-center">
                  <p className="text-3xl font-black text-white">{String(v).padStart(2, '0')}</p>
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mt-1">{l}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="bg-[#2EC4B6] py-8">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map(({ val, label }) => (
            <div key={label}>
              <p className="text-3xl font-black text-white">{val}</p>
              <p className="text-sm text-white/80 font-semibold mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ¿PARA QUIÉN ES? ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a1628] text-center mb-4">¿Esto es para ti?</h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">Si te identificas con alguna de estas situaciones, el webinar es exactamente para ti:</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              '💸 Quieres generar un ingreso extra sin renunciar a tu trabajo actual',
              '🏠 Quieres trabajar desde casa con horarios flexibles',
              '📱 Tienes teléfono e internet y quieres monetizarlos',
              '🌱 Quieres emprender pero no sabes por dónde empezar',
              '👩‍👧 Eres mamá/papá en casa y necesitas flexibilidad total',
              '🎯 Estás cansado/a de que el dinero no te alcance',
            ].map(txt => (
              <div key={txt} className="flex items-start gap-3 bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm">
                <span className="text-xl flex-shrink-0 mt-0.5">{txt.slice(0, 2)}</span>
                <p className="text-gray-700 font-medium text-sm leading-relaxed">{txt.slice(3)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUÉ VAS A APRENDER ───────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a1628] text-center mb-4">En el webinar aprenderás</h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">Una sesión en vivo de 60 minutos donde voy a mostrarte todo sin filtros</p>
          <div className="space-y-3">
            {[
              { n: '01', t: 'Mi historia real', d: 'Cómo empecé con cero clientes y llegué a más de 200 en 3 años' },
              { n: '02', t: 'El modelo de negocio', d: 'Cómo funciona Amway, cómo ganas dinero y cuánto puedes esperar realistamente' },
              { n: '03', t: 'Cómo conseguir tus primeros clientes', d: 'Las estrategias exactas que yo uso: WhatsApp, redes sociales y referidos' },
              { n: '04', t: 'Los productos que más se venden', d: 'Top productos por categoría y cómo presentarlos para que la gente compre' },
              { n: '05', t: 'La capacitación que te doy', d: 'Qué incluye mi academia, el material, el grupo y el acompañamiento personal' },
              { n: '06', t: 'Preguntas y respuestas en vivo', d: 'Respondo todas tus dudas al final. Nada queda sin respuesta' },
            ].map(({ n, t, d }) => (
              <div key={n} className="flex items-start gap-5 bg-gray-50 rounded-2xl px-6 py-5 border border-gray-100">
                <span className="text-3xl font-black text-[#2EC4B6] opacity-60 flex-shrink-0 w-10">{n}</span>
                <div>
                  <p className="font-black text-[#0a1628] text-base">{t}</p>
                  <p className="text-gray-500 text-sm mt-1">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0a1628] to-[#1B3A6B]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-4">Lo que obtienes al unirte</h2>
          <p className="text-center text-white/60 mb-12 max-w-xl mx-auto">No estás solo/a. Tienes un equipo, materiales y un plan claro desde el día uno</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {BENEFICIOS.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl p-6">
                <span className="text-3xl block mb-3">{icon}</span>
                <h3 className="font-black text-white text-base mb-2">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a1628] text-center mb-12">Lo que dicen los que ya empezaron</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIOS.map(({ nombre, ciudad, texto, stars }) => (
              <div key={nombre} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{texto}"</p>
                <div>
                  <p className="font-black text-[#0a1628] text-sm">{nombre}</p>
                  <p className="text-gray-400 text-xs">{ciudad}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULARIO DE REGISTRO ───────────────────────────────────────── */}
      <section ref={formRef} className="py-20 px-6 bg-white">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-[#2EC4B6]/15 text-[#2EC4B6] text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              Registro gratuito
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0a1628] mb-3">Reserva tu lugar ahora</h2>
            <p className="text-gray-500">Los cupos son limitados. Completa el formulario y te enviamos el link del webinar por WhatsApp.</p>
          </div>

          <AnimatePresence>
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center bg-green-50 border border-green-200 rounded-3xl p-10"
              >
                <span className="text-5xl block mb-4">🎉</span>
                <h3 className="text-2xl font-black text-green-800 mb-2">¡Estás registrado/a!</h3>
                <p className="text-green-700 mb-6">Te abrió WhatsApp con tu registro. Envía el mensaje y te confirmo tu lugar al instante. ¡Nos vemos el 15 de marzo!</p>
                <a
                  href="https://wa.me/18492763532?text=Hola! Me registré para el webinar de Amway"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#1ebe5d] transition-colors"
                >
                  💬 Escríbeme por WhatsApp
                </a>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-xl space-y-5"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre completo *</label>
                  <input
                    required
                    value={form.nombre}
                    onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                    placeholder="Ej: María Rodríguez"
                    className="w-full border-2 border-gray-200 focus:border-[#2EC4B6] rounded-2xl px-4 py-3 text-sm focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp / Teléfono *</label>
                  <input
                    required
                    value={form.telefono}
                    onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                    placeholder="(849) 000-0000"
                    className="w-full border-2 border-gray-200 focus:border-[#2EC4B6] rounded-2xl px-4 py-3 text-sm focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email (opcional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="tu@email.com"
                    className="w-full border-2 border-gray-200 focus:border-[#2EC4B6] rounded-2xl px-4 py-3 text-sm focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">¿Cuándo prefieres el webinar?</label>
                  <select
                    value={form.horario}
                    onChange={e => setForm(f => ({ ...f, horario: e.target.value }))}
                    className="w-full border-2 border-gray-200 focus:border-[#2EC4B6] rounded-2xl px-4 py-3 text-sm focus:outline-none transition-colors"
                  >
                    <option value="">Selecciona un horario</option>
                    <option value="sabado-7pm">Sábado 15 marzo · 7:00 pm</option>
                    <option value="cualquier-dia">Cualquier día en la noche</option>
                    <option value="fin-de-semana">Fin de semana</option>
                    <option value="entre-semana">Entre semana</option>
                  </select>
                </div>

                {error && <p className="text-red-600 text-sm font-semibold bg-red-50 rounded-xl px-4 py-3">{error}</p>}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[#1B3A6B] hover:bg-[#0a1628] text-white font-black py-4 rounded-2xl text-base transition-all hover:scale-[1.01] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {sending
                    ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Registrando...</>
                    : '🎙️ Reservar mi lugar gratis'}
                </button>

                <p className="text-center text-gray-400 text-xs">
                  Al registrarte aceptas que te contactemos por WhatsApp con el link del evento.
                </p>
              </motion.form>
            )}
          </AnimatePresence>

          {/* CTA alternativo WA */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-3">¿Prefieres hablar directamente?</p>
            <a
              href="https://wa.me/18492763532?text=Hola! Vi el webinar de Amway y quiero más información"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3 rounded-2xl transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Escríbeme por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-[#0a1628] text-center mb-10">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-3"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-[#0a1628] text-sm">{q}</span>
                  <span className={`text-[#2EC4B6] text-xl flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0a1628] to-[#1B3A6B] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">El momento es ahora</h2>
          <p className="text-white/60 mb-10 leading-relaxed">
            No necesitas experiencia. No necesitas mucho dinero. Solo necesitas tomar la decisión de hacer algo diferente. Yo te guío en el resto.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-[#2EC4B6] hover:bg-teal-400 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-xl transition-all hover:scale-105"
          >
            Registrarme gratis al webinar →
          </button>
        </div>
      </section>

      {/* ── FOOTER MÍNIMO ────────────────────────────────────────────────── */}
      <footer className="bg-[#0a1628] py-6 px-6 text-center">
        <p className="text-white/30 text-xs">
          © 2026 VitaGloss RD · Distribuidora Amway independiente · República Dominicana ·{' '}
          <a href="/privacidad" className="hover:text-white/60 transition-colors">Privacidad</a>
        </p>
      </footer>

    </div>
  )
}
