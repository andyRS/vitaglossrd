import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import LoginModal from '../components/LoginModal'
import HowYouEarn from '../components/oportunidad/HowYouEarn'
import BonusExplainer from '../components/oportunidad/BonusExplainer'
import ToolsProvided from '../components/oportunidad/ToolsProvided'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' }
  })
}

// ─── Niveles de ingreso ──────────────────────────────────────────────────────
const NIVELES = [
  {
    nivel: 'Iniciante', emoji: '🌱',
    color: 'from-emerald-400 to-teal-500',
    colorBg: 'bg-emerald-50', colorText: 'text-emerald-700', colorBorder: 'border-emerald-200',
    ventas: '5–10 ventas/mes', ingreso: 'RD$ 3,000 – 8,000',
    desc: 'Dedica 1–2 horas al día vendiendo a familiares y amigos cercanos. Ideal para empezar sin experiencia.',
    acciones: ['Comparte el catálogo por WhatsApp', '5 contactos nuevos por semana', 'Aprende los productos principales'],
  },
  {
    nivel: 'Creciendo', emoji: '🚀',
    color: 'from-blue-500 to-primary',
    colorBg: 'bg-blue-50', colorText: 'text-blue-700', colorBorder: 'border-blue-200',
    ventas: '15–25 ventas/mes', ingreso: 'RD$ 12,000 – 25,000',
    desc: 'Tienes clientes fijos que te refieren amigos. Empiezas a construir tu red y ganar por volumen.',
    acciones: ['Base sólida de 20+ clientes', 'Referencias activas', 'Presenta la oportunidad a 2 personas'],
    destacado: true,
  },
  {
    nivel: 'Líder', emoji: '👑',
    color: 'from-amber-400 to-orange-500',
    colorBg: 'bg-amber-50', colorText: 'text-amber-700', colorBorder: 'border-amber-200',
    ventas: '40+ ventas/mes + red', ingreso: 'RD$ 40,000 – 100,000+',
    desc: 'Tu equipo vende contigo. Ganas por tus ventas directas y por el volumen total de tu red.',
    acciones: ['Equipo de 5+ distribuidores activos', 'Reuniones semanales de equipo', 'Mentorías 1 a 1'],
  },
]

const PASOS = [
  { num: '01', titulo: 'Contáctanos', desc: 'Escríbenos por WhatsApp. Sin formularios complicados ni burocracia.', emoji: '💬' },
  { num: '02', titulo: 'Orientación gratuita', desc: 'Te explicamos todo: productos, márgenes de ganancia, estrategias de venta.', emoji: '🎓' },
  { num: '03', titulo: 'Recibe tu kit', desc: 'Accede a muestras, catálogo digital, plantillas WhatsApp y tu perfil en la web.', emoji: '📦' },
  { num: '04', titulo: 'Primera venta', desc: 'Con nuestra guía logras tu primera venta en menos de 7 días.', emoji: '🏆' },
]

const OBJECIONES = [
  { q: '¿Necesito invertir mucho dinero?', a: 'No. Puedes empezar con tu primer pedido personal y vender desde ahí. No hay cuotas obligatorias ni inventario forzado.' },
  { q: '¿Y si no tengo experiencia vendiendo?', a: 'Nosotros te capacitamos. Te damos plantillas de mensajes, guiones de venta y estrategias paso a paso. El producto se vende solo porque resuelve un problema real.' },
  { q: '¿Es como una pirámide?', a: 'No. Amway es una empresa registrada mundialmente. Ganas dinero real por ventas de productos físicos, no por reclutar. Está avalada en más de 100 países.' },
  { q: '¿Cuánto tiempo necesito dedicarle?', a: 'Con 1–2 horas diarias puedes generar ingresos extra. Tú manejas tu propio horario. Es un negocio que crece a tu ritmo.' },
  { q: '¿Cómo recibo mis ganancias?', a: 'Cobras directamente al cliente. La diferencia entre el precio de distribuidor y el precio de venta es tuya inmediatamente.' },
]

const TESTIMONIOS = [
  { nombre: 'María R.', ciudad: 'Santo Domingo', texto: 'Empecé vendiendo a mis compañeras de trabajo. En 3 meses ya tenía más de 30 clientes fijos y un ingreso extra que me cambió la vida.', ingreso: 'RD$ 18,000/mes extra', emoji: '👩‍💼' },
  { nombre: 'Carlos M.', ciudad: 'Santiago', texto: 'Dudé mucho al principio. Pero la guía del equipo fue increíble. Mi primera semana ya había recuperado lo que invertí en productos.', ingreso: 'RD$ 12,000/mes extra', emoji: '👨‍💻' },
  { nombre: 'Yessenia P.', ciudad: 'La Romana', texto: 'Soy ama de casa y ahora tengo mi propio negocio. Las plantillas de WhatsApp me facilitan todo. Vendo mientras cuido a mis hijos.', ingreso: 'RD$ 9,500/mes extra', emoji: '👩‍🍳' },
]

// ─── Calculadora interactiva ─────────────────────────────────────────────────
function Calculadora() {
  const [ventas, setVentas] = useState(10)
  const [ticket, setTicket] = useState(800)
  const ganancia = Math.round(ventas * ticket * 0.30)
  return (
    <div className="bg-gradient-to-br from-[#0a1628] to-[#1B3A6B] rounded-3xl p-8 text-white">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl" aria-hidden="true">🧮</span>
        <div>
          <h3 className="font-black text-xl">Calculadora de ganancias</h3>
          <p className="text-white/50 text-sm">Estima tu ingreso mensual</p>
        </div>
      </div>
      <div className="space-y-6 mb-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-white/70 text-sm font-medium">Ventas por mes</label>
            <span className="text-secondary font-black text-lg">{ventas}</span>
          </div>
          <input type="range" min={1} max={50} value={ventas} onChange={e => setVentas(+e.target.value)}
            className="w-full accent-teal-400 cursor-pointer" aria-label="Número de ventas por mes" />
          <div className="flex justify-between text-xs text-white/30 mt-1"><span>1</span><span>50</span></div>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-white/70 text-sm font-medium">Ticket promedio (RD$)</label>
            <span className="text-secondary font-black text-lg">RD$ {ticket.toLocaleString()}</span>
          </div>
          <input type="range" min={300} max={3000} step={100} value={ticket} onChange={e => setTicket(+e.target.value)}
            className="w-full accent-teal-400 cursor-pointer" aria-label="Precio promedio por venta" />
          <div className="flex justify-between text-xs text-white/30 mt-1"><span>RD$ 300</span><span>RD$ 3,000</span></div>
        </div>
      </div>
      <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center">
        <p className="text-white/60 text-sm mb-1">Tu ganancia estimada al mes</p>
        <motion.p key={ganancia} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-black text-secondary">
          RD$ {ganancia.toLocaleString()}
        </motion.p>
        <p className="text-white/40 text-xs mt-2">Basado en ~30% de margen de ganancia</p>
      </div>
      <p className="text-white/30 text-xs mt-4 text-center">* Estimado referencial. Los resultados reales varían.</p>
    </div>
  )
}

// ─── FAQ accordion ───────────────────────────────────────────────────────────
function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={index}
      className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
      <button onClick={() => setOpen(o => !o)}
        className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors"
        aria-expanded={open}>
        <span className="font-bold text-primary text-sm pr-4">{q}</span>
        <span className={`text-secondary text-xl font-black transition-transform flex-shrink-0 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Tarjeta miembro ────────────────────────────────────────────────────────
function MiembroCard({ nombre, rol, descripcion, whatsapp, foto, index }) {
  const initials = nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={index}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
      <div className="p-7 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 ring-4 ring-gray-50 shadow-md flex-shrink-0">
          {foto
            ? <img src={foto} alt={nombre} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-black">{initials}</div>
          }
        </div>
        <h3 className="font-black text-primary text-lg mb-1">{nombre}</h3>
        <span className="inline-block bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full mb-3">{rol}</span>
        <p className="text-gray-500 text-sm leading-relaxed mb-5">{descripcion}</p>
        {whatsapp && (
          <a href={`https://wa.me/${whatsapp}?text=Hola!%20Vi%20tu%20perfil%20en%20VitaGloss%20RD%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n`}
            target="_blank" rel="noopener noreferrer" aria-label={`Contactar a ${nombre} por WhatsApp`}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold transition-all hover:scale-105">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Contactar
          </a>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function Equipo() {
  useSEO({
    title: 'Únete al Equipo | VitaGloss RD',
    description: 'Gana dinero extra vendiendo productos Amway en República Dominicana. Sin horarios fijos, sin inversión inicial grande. Únete al equipo VitaGloss RD.',
  })
  const { user } = useAuth()
  const navigate = useNavigate()
  const [miembros, setMiembros] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    api.getMembers()
      .then(({ members }) => setMiembros(members))
      .catch(() => {})
      .finally(() => setLoadingMembers(false))
  }, [])

  const handleDashboardClick = () => {
    if (user) navigate('/dashboard')
    else setLoginOpen(true)
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0a1628] via-[#1B3A6B] to-[#0f2a54] text-white pt-36 pb-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-6">
            Oportunidad de negocio en RD
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black mb-5 leading-tight">
            Gana dinero extra<br /><span className="text-secondary">desde tu celular</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-2xl mx-auto mb-4">
            Vende productos Amway de altísima demanda. Sin inversión grande, sin horario fijo, sin jefes.
            Únete al equipo VitaGloss RD y construye tu negocio propio.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="text-secondary font-black text-2xl md:text-3xl mb-10">
            Desde RD$ 3,000 hasta RD$ 100,000+ al mes
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/18492763532?text=Hola!%20Vi%20la%20p%C3%A1gina%20de%20VitaGloss%20RD%20y%20me%20interesa%20unirme%20al%20equipo.%20%C2%BFPuedes%20contarme%20m%C3%A1s%3F"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-teal-500 text-white font-black px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-secondary/30 text-lg">
              <span aria-hidden="true">💬</span> Quiero unirme ahora
            </a>
            <a href="#como-funciona"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all">
              <span aria-hidden="true">👇</span> Ver cómo funciona
            </a>
          </motion.div>

          {/* ── ACCESO RÁPIDO EQUIPO ──────────────────────────────────── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-8 inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-3">
            <span className="text-white/50 text-sm">¿Ya eres parte del equipo?</span>
            <button onClick={handleDashboardClick}
              className="inline-flex items-center gap-2 bg-white text-primary font-black text-sm px-5 py-2 rounded-xl hover:bg-secondary hover:text-white transition-all hover:scale-105">
              <span aria-hidden="true">🔐</span>
              {user ? 'Ir al Dashboard' : 'Iniciar sesión'}
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-12">
            {[['🌍', 'Amway en 100+ países'], ['✅', 'Sin cuotas obligatorias'], ['📱', 'Vende desde WhatsApp'], ['⏱️', 'Tu propio horario']].map(([e, t]) => (
              <div key={t} className="flex items-center gap-2 text-white/60 text-sm">
                <span aria-hidden="true">{e}</span>{t}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CALCULADORA ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="inline-block bg-secondary/10 text-secondary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">
              Calcula tus ganancias
            </span>
            <h2 className="text-4xl font-black text-primary mb-4 leading-tight">
              ¿Cuánto puedes<br />ganar con nosotros?
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Mueve los controles y descubre tu potencial de ingreso. La clave está en la constancia — no en tener clientes perfectos desde el día 1.
            </p>
            <div className="space-y-3">
              {['Productos de alta demanda y consumo repetido', 'Gana la diferencia entre precio distribuidor y precio de venta', 'Los clientes te recompran todos los meses', 'Puedes crecer formando tu propio equipo'].map(t => (
                <div key={t} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                  </div>
                  <p className="text-gray-600 text-sm">{t}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <Calculadora />
          </motion.div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ─────────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block bg-primary/5 text-primary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">Proceso simple</span>
            <h2 className="text-4xl font-black text-primary mb-3">Tu primera venta en 7 días</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Cuatro pasos para comenzar a generar ingresos. Sin complicaciones.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PASOS.map((p, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="relative bg-gray-50 rounded-3xl p-7 border border-gray-100 hover:border-secondary/30 hover:shadow-lg transition-all duration-300">
                <span className="absolute top-5 right-5 text-gray-200 font-black text-3xl">{p.num}</span>
                <div className="text-4xl mb-5"><span aria-hidden="true">{p.emoji}</span></div>
                <h3 className="font-black text-primary text-lg mb-2">{p.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLAN DE INGRESOS ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block bg-secondary/10 text-secondary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">Plan de ingresos</span>
            <h2 className="text-4xl font-black text-primary mb-3">Tres niveles, tú decides hasta dónde llegar</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">No importa si buscas un ingreso extra pequeño o quieres hacerlo tu negocio principal — hay un nivel para ti.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NIVELES.map((n, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className={`rounded-3xl overflow-hidden border-2 transition-all duration-300 ${n.destacado ? `${n.colorBorder} shadow-2xl scale-[1.03]` : 'border-gray-100 hover:shadow-lg'}`}>
                {n.destacado && (
                  <div className={`bg-gradient-to-r ${n.color} text-white text-xs font-black text-center py-2 tracking-widest uppercase`}>
                    ⭐ Más popular
                  </div>
                )}
                <div className={`${n.colorBg} p-7`}>
                  <div className="text-4xl mb-3"><span aria-hidden="true">{n.emoji}</span></div>
                  <h3 className={`font-black text-xl mb-1 ${n.colorText}`}>{n.nivel}</h3>
                  <p className="text-gray-500 text-xs mb-3">{n.ventas}</p>
                  <p className={`font-black text-2xl ${n.colorText}`}>{n.ingreso}</p>
                </div>
                <div className="bg-white p-7">
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{n.desc}</p>
                  <div className="space-y-2">
                    {n.acciones.map((a, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="text-secondary font-black text-sm mt-0.5">✓</span>
                        <p className="text-gray-600 text-sm">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO SE GANA — ventas directas vs bonus de equipo ────────────── */}
      <HowYouEarn />

      {/* ── ESTRUCTURA DE BONUS ──────────────────────────────────────────── */}
      <BonusExplainer />

      {/* ── TESTIMONIOS ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block bg-primary/5 text-primary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">Historias reales</span>
            <h2 className="text-4xl font-black text-primary mb-3">Personas como tú ya están ganando</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIOS.map((t, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-gray-50 rounded-3xl p-7 border border-gray-100 hover:border-secondary/30 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4"><span aria-hidden="true">{t.emoji}</span></div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.texto}"</p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="font-black text-primary">{t.nombre}</p>
                  <p className="text-gray-400 text-xs mb-2">{t.ciudad}</p>
                  <span className="inline-block bg-secondary/10 text-secondary text-xs font-black px-3 py-1 rounded-full">{t.ingreso}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HERRAMIENTAS INCLUIDAS ────────────────────────────────────────── */}
      <ToolsProvided />

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block bg-secondary/10 text-secondary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">Tus dudas, respondidas</span>
            <h2 className="text-4xl font-black text-primary mb-3">Preguntas frecuentes</h2>
            <p className="text-gray-500">Todo lo que necesitas saber antes de dar el primer paso.</p>
          </motion.div>
          <div className="space-y-3">
            {OBJECIONES.map((o, i) => <FAQItem key={i} q={o.q} a={o.a} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── EQUIPO ACTUAL ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-primary mb-3">Conoce al equipo</h2>
            <p className="text-gray-500">Las personas que te van a acompañar en este camino.</p>
          </motion.div>
          {loadingMembers ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => <div key={i} className="bg-gray-50 rounded-3xl h-56 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(miembros.length > 0 ? miembros.map(m => ({
                _id: m._id, nombre: m.nombre, whatsapp: m.whatsapp, foto: m.foto, descripcion: m.descripcion,
                rol: m.rol === 'admin' ? 'Fundador & Líder' : 'Distribuidor Independiente'
              })) : [{ _id: 'demo', nombre: 'Tu nombre aquí', rol: 'Fundador VitaGloss RD', descripcion: 'Apasionado por el bienestar y por ayudar a otros a crear su propio negocio.', whatsapp: '18492763532', foto: '' }])
                .map((m, i) => <MiembroCard key={m._id} {...m} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#0a1628] via-[#1B3A6B] to-[#0f2a54] relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-2xl mx-auto text-center text-white">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-6xl block mb-6" aria-hidden="true">🚀</span>
            <h2 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
              ¿Listo para empezar<br />tu negocio hoy?
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">
              Una sola conversación puede cambiar tu situación financiera. Escríbenos ahora — sin compromiso, sin presión.
            </p>
            <a href="https://wa.me/18492763532?text=Hola!%20Vi%20el%20plan%20de%20negocios%20en%20VitaGloss%20RD%20y%20quiero%20saber%20c%C3%B3mo%20empezar.%20%C2%BFCu%C3%A1ndo%20podemos%20hablar%3F"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-secondary hover:bg-teal-500 text-white font-black px-10 py-5 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-secondary/30 text-xl mb-6">
              <span aria-hidden="true">💬</span> Hablar por WhatsApp ahora
            </a>
            <p className="text-white/30 text-sm">Respuesta en menos de 1 hora · Orientación 100% gratuita</p>
          </motion.div>
        </div>
      </section>

      {/* ── ACCESO EQUIPO ─────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-sm mx-auto text-center">
          <p className="text-gray-400 text-sm mb-3">¿Eres miembro del equipo?</p>
          <button onClick={handleDashboardClick}
            className="inline-flex items-center gap-2 bg-primary hover:bg-blue-800 text-white font-bold px-7 py-3 rounded-2xl text-sm transition-all hover:scale-105">
            {user ? <><span aria-hidden="true">📊</span> Ir al Dashboard</> : <><span aria-hidden="true">🔐</span> Iniciar sesión</>}
          </button>
        </div>
      </section>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  )
}
