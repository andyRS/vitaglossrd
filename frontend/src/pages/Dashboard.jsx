import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { useSEO } from '../hooks/useSEO'
import AcademiaTab from '../components/academia/AcademiaTab'

// ─── helpers ────────────────────────────────────────────────────────────────
const ESTADO_LEAD = ['nuevo', 'contactado', 'interesado', 'cerrado', 'perdido']
const ESTADO_VENTA = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado']
const METODO_PAGO = ['transferencia', 'efectivo', 'tarjeta', 'pago_movil', 'otro']

const BADGE_LEAD = {
  nuevo:       'bg-sky-100 text-sky-700',
  contactado:  'bg-yellow-100 text-yellow-700',
  interesado:  'bg-purple-100 text-purple-700',
  cerrado:     'bg-green-100 text-green-700',
  perdido:     'bg-red-100 text-red-700',
}
const BADGE_VENTA = {
  pendiente:  'bg-yellow-100 text-yellow-700',
  pagado:     'bg-sky-100 text-sky-700',
  enviado:    'bg-purple-100 text-purple-700',
  entregado:  'bg-green-100 text-green-700',
  cancelado:  'bg-red-100 text-red-700',
}

const TABS = ['📊 Resumen', '👥 Leads', '💰 Ventas', '💬 Plantillas', '🟢 Equipo VitaGlossRD', '⚙️ Perfil']

const WA_TEMPLATES = [
  { producto: 'Glister™ Pasta Dental', msg: '¡Hola! 👋 Te cuento sobre *Glister™*, la pasta dental con flúor activo de Amway. Combate caries, blanquea los dientes y elimina el mal aliento desde la primera semana. 🦷✨ ¿Te interesa saber el precio y cómo pedirla?' },
  { producto: 'Enjuague Bucal Glister™', msg: '¡Hola! 🙂 Tengo disponible el *Enjuague Bucal Glister™* antibacterial que destruye gérmenes por 12 horas sin alcohol. Ideal para una boca siempre fresca. ¿Quieres más información?' },
  { producto: 'Nutrilite™ Vitamina C Plus', msg: '¡Hola! 👋 Te recuerdo que tenemos *Nutrilite™ Vitamina C Plus* con bioflavonoides naturales. Refuerza el sistema inmune, reduce cansancio y cuida tu piel. Viene en 90 tabletas masticables. ¿Te interesa?' },
  { producto: 'Nutrilite™ Daily (Multivitamínico)', msg: '¡Hola! ¿Sabías que con *Nutrilite™ Daily* tienes 24 vitaminas y minerales en una sola pastilla al día? 💊 Energía, defensas altas y bienestar total. Precio especial esta semana. ¿Hablamos?' },
  { producto: 'Combo Salud Completa', msg: '¡Hola! 🌟 Tengo un *Combo Salud Completa* con pasta Glister™ + enjuague bucal + vitamina C Nutrilite™. Todo junto tiene un descuento especial. ¿Te lo detallo?' },
  { producto: 'Seguimiento de cliente', msg: '¡Hola! 😊 Quería saber cómo te fue con el producto que pediste. ¿Notaste algún cambio? Tu opinión me importa mucho. ¡Cualquier duda, aquí estoy! 💪' },
]

function copyToClipboard(text) {
  if (navigator.clipboard) return navigator.clipboard.writeText(text)
  const ta = document.createElement('textarea')
  ta.value = text
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}

// ─── stat card ──────────────────────────────────────────────────────────────
function StatCard({ titulo, valor, sub, icono, color = 'primary' }) {
  const colors = {
    primary: 'from-[#0a1628] to-[#1B3A6B]',
    green:   'from-green-600 to-emerald-500',
    purple:  'from-purple-700 to-violet-500',
    orange:  'from-orange-500 to-amber-400',
  }
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-3xl p-6 text-white`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-white/60 text-sm font-medium">{titulo}</p>
        <span className="text-2xl" aria-hidden="true">{icono}</span>
      </div>
      <p className="text-3xl font-black">{valor}</p>
      {sub && <p className="text-white/50 text-xs mt-1">{sub}</p>}
    </div>
  )
}

// ─── section wrapper ─────────────────────────────────────────────────────────
function Section({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      {children}
    </motion.div>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  useSEO({ title: 'Dashboard – VitaGloss RD', description: 'Panel de gestión para el equipo de ventas VitaGloss RD.' })

  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)

  // stats
  const [stats, setStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)

  // leads
  const [leads, setLeads] = useState([])
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [leadForm, setLeadForm] = useState({ nombre: '', telefono: '', productoInteres: '', nota: '', origen: 'whatsapp' })
  const [leadFormOpen, setLeadFormOpen] = useState(false)
  const [savingLead, setSavingLead] = useState(false)

  // sales
  const [sales, setSales] = useState([])
  const [loadingSales, setLoadingSales] = useState(false)
  const [saleForm, setSaleForm] = useState({ cliente: '', telefono: '', productos: [{ nombre: '', cantidad: 1, precio: '' }], metodoPago: 'transferencia', notas: '' })
  const [saleFormOpen, setSaleFormOpen] = useState(false)
  const [savingSale, setSavingSale] = useState(false)

  // profile
  const [profileForm, setProfileForm] = useState({ nombre: '', descripcion: '', whatsapp: '', metaMensual: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')

  // kanban view toggle
  const [kanbanView, setKanbanView] = useState(false)

  // templates copy feedback
  const [copied, setCopied] = useState(null)

  // ── fetch on tab change ──────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    setLoadingStats(true)
    try { const d = await api.getDashboard(); setStats(d) } catch {}
    finally { setLoadingStats(false) }
  }, [])

  const loadLeads = useCallback(async () => {
    setLoadingLeads(true)
    try { const d = await api.getLeads(); setLeads(d.leads || []) } catch {}
    finally { setLoadingLeads(false) }
  }, [])

  const loadSales = useCallback(async () => {
    setLoadingSales(true)
    try { const d = await api.getSales(); setSales(d.sales || []) } catch {}
    finally { setLoadingSales(false) }
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  useEffect(() => {
    if (tab === 1) loadLeads()
    if (tab === 2) loadSales()
    if (tab === 5 && user) setProfileForm({ nombre: user.nombre || '', descripcion: user.descripcion || '', whatsapp: user.whatsapp || '', metaMensual: user.metaMensual || 10000 })
  }, [tab]) // eslint-disable-line

  // ── lead actions ─────────────────────────────────────────────────────────
  const submitLead = async (e) => {
    e.preventDefault()
    setSavingLead(true)
    try {
      await api.createLead(leadForm)
      setLeadFormOpen(false)
      setLeadForm({ nombre: '', telefono: '', productoInteres: '', nota: '', origen: 'whatsapp' })
      loadLeads()
    } catch (err) { alert(err.message) }
    finally { setSavingLead(false) }
  }

  const changeLeadEstado = async (id, estado) => {
    try { await api.updateLead(id, { estado }); loadLeads() } catch {}
  }

  const deleteLead = async (id) => {
    if (!confirm('¿Eliminar este lead?')) return
    try { await api.deleteLead(id); loadLeads() } catch {}
  }

  // ── sale actions ─────────────────────────────────────────────────────────
  const addProductoRow = () => setSaleForm(f => ({ ...f, productos: [...f.productos, { nombre: '', cantidad: 1, precio: '' }] }))
  const removeProductoRow = (i) => setSaleForm(f => ({ ...f, productos: f.productos.filter((_, idx) => idx !== i) }))
  const updateProductoRow = (i, field, val) => setSaleForm(f => {
    const p = [...f.productos]; p[i] = { ...p[i], [field]: val }
    return { ...f, productos: p }
  })

  const calcTotal = () => saleForm.productos.reduce((sum, p) => sum + (parseFloat(p.precio) || 0) * (parseInt(p.cantidad) || 1), 0)

  const submitSale = async (e) => {
    e.preventDefault()
    setSavingSale(true)
    try {
      await api.createSale({ ...saleForm, total: calcTotal() })
      setSaleFormOpen(false)
      setSaleForm({ cliente: '', telefono: '', productos: [{ nombre: '', cantidad: 1, precio: '' }], metodoPago: 'transferencia', notas: '' })
      loadSales()
      loadStats()
    } catch (err) { alert(err.message) }
    finally { setSavingSale(false) }
  }

  // ── profile ──────────────────────────────────────────────────────────────
  const submitProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMsg('')
    try {
      const updated = await api.updateProfile(profileForm)
      updateUser(updated.user)
      setProfileMsg('¡Perfil actualizado correctamente!')
    } catch (err) { setProfileMsg('Error: ' + err.message) }
    finally { setSavingProfile(false) }
  }

  const handleLogout = () => { logout(); navigate('/equipo') }

  // ── template copy ────────────────────────────────────────────────────────
  const handleCopy = (msg, i) => {
    copyToClipboard(msg)
    setCopied(i)
    setTimeout(() => setCopied(null), 2000)
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#1B3A6B] px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} aria-label="Ir al inicio"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-sm">
            ←
          </button>
          <div className="flex items-center gap-2">
            <img src="/vg-logo.png" alt="" className="h-7 w-auto hidden sm:block" onError={e => e.target.style.display='none'} />
            <div>
              <p className="text-white font-black text-base leading-none">VitaGloss RD</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Panel de equipo</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right mr-1">
            <p className="text-white font-semibold text-sm leading-none">{user?.nombre}</p>
            <p className="text-secondary text-[10px] capitalize font-medium">{user?.rol}</p>
          </div>
          {/* Avatar iniciales */}
          <div className="w-9 h-9 rounded-xl bg-secondary/30 border border-secondary/40 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
            {user?.nombre?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() || '?'}
          </div>
          <button onClick={handleLogout} aria-label="Cerrar sesión"
            className="bg-white/10 hover:bg-red-500/80 border border-white/20 hover:border-red-400 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all ml-1">
            Salir
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[65px] z-30 overflow-x-auto">
        <div className="flex gap-0 max-w-5xl mx-auto px-4">
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`flex-shrink-0 px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                tab === i ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── TAB 0: RESUMEN ─────────────────────────────────────────────── */}
        {tab === 0 && (
          <Section>
            {/* Saludo personalizado */}
            <div className="bg-gradient-to-r from-[#0a1628] to-[#1B3A6B] rounded-3xl p-6 mb-6 flex items-center justify-between overflow-hidden relative">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full" />
              <div className="absolute -right-4 -bottom-8 w-28 h-28 bg-secondary/10 rounded-full" />
              <div className="relative">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
                  {new Date().toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <h2 className="text-white font-black text-xl leading-tight">
                  ¡Hola, {user?.nombre?.split(' ')[0]}! 👋
                </h2>
                <p className="text-white/50 text-sm mt-1">Aquí está el resumen de tu negocio.</p>
              </div>
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-white font-black text-xl">
                  {user?.nombre?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() || '?'}
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Nuevo lead', icon: '👤', color: 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100', action: () => { setTab(1); setTimeout(() => setLeadFormOpen(true), 100) } },
                { label: 'Nueva venta', icon: '💰', color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100', action: () => { setTab(2); setTimeout(() => setSaleFormOpen(true), 100) } },
                { label: 'Plantillas WA', icon: '💬', color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100', action: () => setTab(3) },
                { label: 'Mi equipo', icon: '🟢', color: 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100', action: () => setTab(4) },
              ].map(({ label, icon, color, action }) => (
                <button key={label} onClick={action}
                  className={`border rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all hover:scale-105 font-semibold text-xs ${color}`}>
                  <span className="text-2xl" aria-hidden="true">{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {loadingStats ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-3xl h-32 animate-pulse" />)}
              </div>
            ) : stats ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard titulo="Ventas este mes" valor={`RD$ ${(stats.ventas?.totalMes || 0).toLocaleString()}`} icono="💰" sub={`${stats.ventas?.cantidadMes || 0} transacciones`} color="green" />
                  <StatCard titulo="Crecimiento" valor={`${stats.ventas?.crecimiento >= 0 ? '+' : ''}${stats.ventas?.crecimiento || 0}%`} icono="📈" sub="vs mes anterior" color="purple" />
                  <StatCard titulo="Leads activos" valor={stats.leads?.total || 0} icono="👥" sub={`${stats.leads?.cerrados || 0} cerrados`} color="orange" />
                  <StatCard titulo="Conversión" valor={`${stats.leads?.tasaConversion || 0}%`} icono="🎯" sub="leads → ventas" color="primary" />
                </div>

                {/* Progress bar meta */}
                {stats.ventas?.meta > 0 && (
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-6">
                    <div className="flex justify-between mb-3">
                      <span className="font-bold text-primary text-sm">Meta mensual</span>
                      <span className="text-secondary font-black text-sm">{stats.ventas.progreso}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-4 bg-gradient-to-r from-secondary to-teal-400 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(stats.ventas.progreso, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-400 text-xs">RD$ 0</span>
                      <span className="text-gray-400 text-xs">Meta: RD$ {stats.ventas.meta.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Últimas ventas */}
                {stats.ultimos?.ventas?.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-6">
                    <h3 className="font-black text-primary mb-4">Últimas ventas</h3>
                    <div className="divide-y divide-gray-50">
                      {stats.ultimos.ventas.map(v => (
                        <div key={v._id} className="flex justify-between items-center py-3">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{v.cliente}</p>
                            <p className="text-gray-400 text-xs">{new Date(v.fecha).toLocaleDateString('es-DO')}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-secondary text-sm">RD$ {v.total.toLocaleString()}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_VENTA[v.estado] || ''}`}>{v.estado}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Últimos leads */}
                {stats.ultimos?.leads?.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 border border-gray-100">
                    <h3 className="font-black text-primary mb-4">Últimos leads</h3>
                    <div className="divide-y divide-gray-50">
                      {stats.ultimos.leads.map(l => (
                        <div key={l._id} className="flex justify-between items-center py-3">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{l.nombre}</p>
                            <p className="text-gray-400 text-xs">{l.productoInteres || 'Sin producto'}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_LEAD[l.estado] || ''}`}>{l.estado}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                <p className="text-4xl mb-3" aria-hidden="true">📡</p>
                <p className="text-gray-500">No se pudieron cargar las estadísticas.</p>
                <button onClick={loadStats} className="mt-4 text-sm text-secondary font-semibold hover:underline">Reintentar</button>
              </div>
            )}
          </Section>
        )}

        {/* ── TAB 1: LEADS ───────────────────────────────────────────────── */}
        {tab === 1 && (
          <Section>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              <h2 className="text-2xl font-black text-primary">Gestión de Leads</h2>
              <div className="flex items-center gap-2">
                {/* Toggle lista/kanban */}
                <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
                  <button
                    onClick={() => setKanbanView(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!kanbanView ? 'bg-white shadow text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    ☰ Lista
                  </button>
                  <button
                    onClick={() => setKanbanView(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${kanbanView ? 'bg-white shadow text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    ⬛ Kanban
                  </button>
                </div>
                <button onClick={() => setLeadFormOpen(true)}
                  className="bg-primary hover:bg-blue-800 text-white text-sm font-bold px-5 py-2.5 rounded-2xl flex items-center gap-2 transition-all hover:scale-105">
                  <span aria-hidden="true">+</span> Nuevo lead
                </button>
              </div>
            </div>

            {/* Form modal */}
            <AnimatePresence>
              {leadFormOpen && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl p-6 border border-secondary/30 mb-6 shadow-lg">
                  <h3 className="font-black text-primary mb-4">Nuevo lead</h3>
                  <form onSubmit={submitLead} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input required placeholder="Nombre del cliente *" value={leadForm.nombre} onChange={e => setLeadForm(f => ({ ...f, nombre: e.target.value }))}
                      className="border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                    <input placeholder="Teléfono" value={leadForm.telefono} onChange={e => setLeadForm(f => ({ ...f, telefono: e.target.value }))}
                      className="border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                    <input placeholder="Producto de interés" value={leadForm.productoInteres} onChange={e => setLeadForm(f => ({ ...f, productoInteres: e.target.value }))}
                      className="border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                    <select value={leadForm.origen} onChange={e => setLeadForm(f => ({ ...f, origen: e.target.value }))}
                      className="border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary">
                      {['whatsapp','referido','web','instagram','facebook','otro'].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <textarea placeholder="Nota adicional" value={leadForm.nota} onChange={e => setLeadForm(f => ({ ...f, nota: e.target.value }))}
                      rows={2} className="sm:col-span-2 border border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary" />
                    <div className="sm:col-span-2 flex gap-3">
                      <button type="submit" disabled={savingLead}
                        className="bg-primary text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all hover:scale-105 disabled:opacity-60">
                        {savingLead ? 'Guardando…' : 'Guardar lead'}
                      </button>
                      <button type="button" onClick={() => setLeadFormOpen(false)}
                        className="bg-gray-100 text-gray-600 font-semibold px-6 py-3 rounded-2xl text-sm transition-all hover:bg-gray-200">
                        Cancelar
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {loadingLeads ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-3xl h-20 animate-pulse border border-gray-100" />)}</div>
            ) : leads.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                <p className="text-4xl mb-3" aria-hidden="true">👥</p>
                <p className="text-gray-500 mb-4">No tienes leads registrados aún.</p>
                <button onClick={() => setLeadFormOpen(true)} className="text-sm text-secondary font-semibold hover:underline">+ Agregar primer lead</button>
              </div>
            ) : kanbanView ? (
              /* ── KANBAN BOARD ── */
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                  {ESTADO_LEAD.map(estado => {
                    const col = { nuevo: { label: 'Nuevos', color: 'bg-sky-500', bg: 'bg-sky-50', border: 'border-sky-200' }, contactado: { label: 'Contactados', color: 'bg-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' }, interesado: { label: 'Interesados', color: 'bg-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' }, cerrado: { label: 'Cerrados', color: 'bg-green-500', bg: 'bg-green-50', border: 'border-green-200' }, perdido: { label: 'Perdidos', color: 'bg-red-400', bg: 'bg-red-50', border: 'border-red-200' } }[estado]
                    const colLeads = leads.filter(l => l.estado === estado)
                    return (
                      <div key={estado} className={`w-64 flex-shrink-0 rounded-2xl border ${col.border} ${col.bg} p-3`}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                          <span className="font-bold text-sm text-gray-700">{col.label}</span>
                          <span className="ml-auto bg-white border border-gray-200 text-gray-500 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{colLeads.length}</span>
                        </div>
                        <div className="space-y-2 min-h-[60px]">
                          {colLeads.map(l => (
                            <div key={l._id} className="bg-white rounded-xl p-3 border border-white shadow-sm">
                              <p className="font-semibold text-gray-800 text-sm leading-tight mb-1">{l.nombre}</p>
                              {l.productoInteres && <p className="text-gray-400 text-xs mb-2 truncate">{l.productoInteres}</p>}
                              <div className="flex items-center justify-between gap-1 mt-2">
                                {l.telefono ? (
                                  <a href={`https://wa.me/${l.telefono.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                                    className="text-green-600 text-xs font-semibold hover:underline">📲 {l.telefono}</a>
                                ) : <span />}
                                <select
                                  value={l.estado}
                                  onChange={e => changeLeadEstado(l._id, e.target.value)}
                                  className="text-[10px] font-bold bg-gray-50 border border-gray-200 rounded-lg px-1.5 py-1 cursor-pointer focus:outline-none"
                                >
                                  {ESTADO_LEAD.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              /* ── TABLA LISTA ── */
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="hidden sm:grid grid-cols-5 px-6 py-3 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <span>Cliente</span><span>Producto</span><span>Origen</span><span>Estado</span><span></span>
                </div>
                <div className="divide-y divide-gray-50">
                  {leads.map(l => (
                    <div key={l._id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-0 px-6 py-4 items-center hover:bg-gray-50">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{l.nombre}</p>
                        {l.telefono && (
                          <a href={`https://wa.me/${l.telefono.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                            className="text-green-600 text-xs hover:underline">{l.telefono}</a>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs">{l.productoInteres || '—'}</p>
                      <span className="text-gray-400 text-xs capitalize">{l.origen}</span>
                      <select value={l.estado} onChange={e => changeLeadEstado(l._id, e.target.value)} aria-label="Cambiar estado del lead"
                        className={`text-xs font-bold px-2 py-1.5 rounded-xl border-0 cursor-pointer focus:ring-2 focus:ring-primary/20 ${BADGE_LEAD[l.estado] || 'bg-gray-100'}`}>
                        {ESTADO_LEAD.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button onClick={() => deleteLead(l._id)} aria-label="Eliminar lead"
                        className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors justify-self-end">
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* ── TAB 2: VENTAS ──────────────────────────────────────────────── */}
        {tab === 2 && (
          <Section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-primary">Registro de Ventas</h2>
              <button onClick={() => setSaleFormOpen(true)}
                className="bg-secondary hover:bg-teal-500 text-white text-sm font-bold px-5 py-2.5 rounded-2xl flex items-center gap-2 transition-all hover:scale-105">
                <span aria-hidden="true">+</span> Nueva venta
              </button>
            </div>

            {/* Sale form */}
            <AnimatePresence>
              {saleFormOpen && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl p-6 border border-secondary/30 mb-6 shadow-lg">
                  <h3 className="font-black text-primary mb-4">Registrar venta</h3>
                  <form onSubmit={submitSale}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <input required placeholder="Nombre del cliente *" value={saleForm.cliente} onChange={e => setSaleForm(f => ({ ...f, cliente: e.target.value }))}
                        className="border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-secondary" />
                      <input placeholder="Teléfono" value={saleForm.telefono} onChange={e => setSaleForm(f => ({ ...f, telefono: e.target.value }))}
                        className="border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-secondary" />
                    </div>

                    {/* Productos */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-bold text-gray-600">Productos</p>
                        <button type="button" onClick={addProductoRow} className="text-xs text-secondary font-bold hover:underline">+ Añadir producto</button>
                      </div>
                      {saleForm.productos.map((p, i) => (
                        <div key={i} className="grid grid-cols-6 gap-2 mb-2">
                          <input placeholder="Producto" value={p.nombre} onChange={e => updateProductoRow(i, 'nombre', e.target.value)}
                            className="col-span-3 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-secondary" />
                          <input type="number" min={1} placeholder="Cant." value={p.cantidad} onChange={e => updateProductoRow(i, 'cantidad', e.target.value)}
                            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-secondary" />
                          <input type="number" min={0} placeholder="RD$" value={p.precio} onChange={e => updateProductoRow(i, 'precio', e.target.value)}
                            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-secondary" />
                          <button type="button" onClick={() => removeProductoRow(i)} disabled={saleForm.productos.length === 1}
                            className="text-red-400 hover:text-red-600 text-sm disabled:opacity-30">✕</button>
                        </div>
                      ))}
                      <div className="text-right text-sm font-black text-secondary mt-1">
                        Total: RD$ {calcTotal().toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <select value={saleForm.metodoPago} onChange={e => setSaleForm(f => ({ ...f, metodoPago: e.target.value }))}
                        className="border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-secondary">
                        {METODO_PAGO.map(m => <option key={m}>{m}</option>)}
                      </select>
                      <textarea placeholder="Notas adicionales" value={saleForm.notas} onChange={e => setSaleForm(f => ({ ...f, notas: e.target.value }))}
                        rows={1} className="border border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-secondary" />
                    </div>

                    <div className="flex gap-3">
                      <button type="submit" disabled={savingSale}
                        className="bg-secondary text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all hover:scale-105 disabled:opacity-60">
                        {savingSale ? 'Guardando…' : 'Registrar venta'}
                      </button>
                      <button type="button" onClick={() => setSaleFormOpen(false)}
                        className="bg-gray-100 text-gray-600 font-semibold px-6 py-3 rounded-2xl text-sm hover:bg-gray-200">Cancelar</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {loadingSales ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-3xl h-20 animate-pulse border border-gray-100" />)}</div>
            ) : sales.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                <p className="text-4xl mb-3" aria-hidden="true">💰</p>
                <p className="text-gray-500 mb-4">No hay ventas registradas aún.</p>
                <button onClick={() => setSaleFormOpen(true)} className="text-sm text-secondary font-semibold hover:underline">+ Registrar primera venta</button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="hidden sm:grid grid-cols-5 px-6 py-3 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <span>Cliente</span><span>Fecha</span><span>Total</span><span>Pago</span><span>Estado</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {sales.map(v => (
                    <div key={v._id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-0 px-6 py-4 items-center hover:bg-gray-50">
                      <p className="font-semibold text-gray-800 text-sm">{v.cliente}</p>
                      <p className="text-gray-400 text-xs">{new Date(v.fecha).toLocaleDateString('es-DO')}</p>
                      <p className="font-black text-secondary text-sm">RD$ {v.total.toLocaleString()}</p>
                      <p className="text-gray-500 text-xs capitalize">{v.metodoPago}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${BADGE_VENTA[v.estado] || ''}`}>{v.estado}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* ── TAB 3: PLANTILLAS ──────────────────────────────────────────── */}
        {tab === 3 && (
          <Section>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-primary mb-1">Plantillas WhatsApp</h2>
              <p className="text-gray-500 text-sm">Copia el mensaje con un clic y envíalo a tus clientes potenciales.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {WA_TEMPLATES.map((t, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 hover:border-secondary/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-black text-primary text-sm">{t.producto}</h3>
                    <span className="text-xl" aria-hidden="true">💬</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 bg-gray-50 rounded-2xl p-3">{t.msg}</p>
                  <button
                    onClick={() => handleCopy(t.msg, i)}
                    className={`w-full py-2.5 rounded-2xl text-sm font-bold transition-all ${
                      copied === i
                        ? 'bg-green-500 text-white'
                        : 'bg-primary/5 hover:bg-primary text-primary hover:text-white'
                    }`}
                    aria-label={`Copiar plantilla: ${t.producto}`}
                  >
                    {copied === i ? '✓ Copiado!' : '📋 Copiar mensaje'}
                  </button>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── TAB 4: ACADEMIA ─────────────────────────────────────────────── */}
        {tab === 4 && (
          <Section>
            <AcademiaTab onChangeTab={setTab} />
          </Section>
        )}

        {/* ── TAB 5: PERFIL ──────────────────────────────────────────────── */}
        {tab === 5 && (
          <Section>
            <div className="max-w-lg mx-auto">
              <h2 className="text-2xl font-black text-primary mb-6">Mi perfil</h2>
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-br from-[#0a1628] to-[#1B3A6B] p-6 text-white flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-2xl font-black">
                    {user?.nombre?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-xl">{user?.nombre}</p>
                    <p className="text-white/50 text-sm capitalize">{user?.rol} · {user?.email}</p>
                  </div>
                </div>
                <div className="p-6">
                  <form onSubmit={submitProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre completo</label>
                      <input value={profileForm.nombre} onChange={e => setProfileForm(f => ({ ...f, nombre: e.target.value }))}
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp</label>
                      <input placeholder="18091234567" value={profileForm.whatsapp} onChange={e => setProfileForm(f => ({ ...f, whatsapp: e.target.value }))}
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descripción</label>
                      <textarea value={profileForm.descripcion} onChange={e => setProfileForm(f => ({ ...f, descripcion: e.target.value }))}
                        rows={3} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta mensual (RD$)</label>
                      <input type="number" min={0} value={profileForm.metaMensual} onChange={e => setProfileForm(f => ({ ...f, metaMensual: parseInt(e.target.value) || 0 }))}
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                    </div>

                    <AnimatePresence>
                      {profileMsg && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className={`text-sm font-semibold rounded-2xl px-4 py-3 ${profileMsg.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                          {profileMsg}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <button type="submit" disabled={savingProfile}
                      className="w-full bg-primary hover:bg-blue-800 text-white font-black py-3.5 rounded-2xl transition-all hover:scale-[1.02] disabled:opacity-60">
                      {savingProfile ? 'Guardando…' : 'Guardar cambios'}
                    </button>
                  </form>
                </div>
              </div>

              {/* ─ Enlace de referido ─ */}
              {user?.refCode && (
                <div className="mt-6 bg-gradient-to-br from-[#0a1628] to-[#1B3A6B] rounded-3xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🔗</span>
                    <div>
                      <p className="font-black text-base">Tu enlace de referido</p>
                      <p className="text-white/50 text-xs">Comparte este link y rastrea cada visita</p>
                    </div>
                    <span className="ml-auto bg-secondary/20 border border-secondary/40 text-secondary text-xs font-bold px-3 py-1 rounded-full">
                      {user.refClicks ?? 0} clicks
                    </span>
                  </div>
                  <div className="bg-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 mb-4">
                    <p className="flex-1 text-white/80 text-xs truncate font-mono">
                      {window.location.origin}/?ref={user.refCode}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(`${window.location.origin}/?ref=${user.refCode}`)
                        setCopied('ref')
                        setTimeout(() => setCopied(null), 2000)
                      }}
                      className="flex-shrink-0 bg-secondary hover:bg-teal-400 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      {copied === 'ref' ? '✓ Copiado' : '📋 Copiar'}
                    </button>
                  </div>
                  <p className="text-white/40 text-xs">
                    Cuando alguien entra por tu enlace y deja sus datos en el popup de descuento, el lead queda registrado a tu nombre.
                  </p>
                </div>
              )}
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}
