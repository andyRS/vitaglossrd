import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { api } from '../services/api'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const ENVIO_GRATIS  = ['Santo Domingo', 'Santo Domingo Este', 'Santo Domingo Oeste', 'Distrito Nacional']
const ENVIO_INTERIOR = 280

const PROVINCIAS = [
  'Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional',
  'Duarte','El Seibo','Elías Piña','Espaillat','Hato Mayor',
  'Hermanas Mirabal','Independencia','La Altagracia','La Romana',
  'La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi',
  'Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná',
  'Sánchez Ramírez','San Cristóbal','San José de Ocoa','San Juan',
  'San Pedro de Macorís','Santiago','Santiago Rodríguez',
  'Santo Domingo','Santo Domingo Este','Santo Domingo Oeste','Valverde',
]

const MUNICIPIOS_POR_PROVINCIA = {
  'Distrito Nacional': ['Santo Domingo de Guzmán'],
  'Santo Domingo': ['Santo Domingo Este','Santo Domingo Norte','Santo Domingo Oeste','Boca Chica','Pedro Brand','Los Alcarrizos','San Antonio de Guerra'],
  'Santiago': ['Santiago de los Caballeros','Bisonó','Jánico','Licey al Medio','San José de las Matas','Tamboril','Villa González','Puñal'],
  'La Vega': ['Concepción de La Vega','Constanza','Jarabacoa','Moca (Espaillat)'],
  'San Pedro de Macorís': ['San Pedro de Macorís','Guayacanes','Quisqueya','San José de los Llanos'],
  'La Romana': ['La Romana','Casa de Campo','Guaymate','Villa Hermosa'],
  'La Altagracia': ['Higüey','San Rafael del Yuma'],
  'Puerto Plata': ['Puerto Plata','Altamira','Guananico','Imbert','Los Hidalgos','Luperón','Sosúa','Villa Isabela','Villa Montellano'],
  'San Cristóbal': ['San Cristóbal','Bajos de Haina','Cambita Garabitos','Los Cacaos','Sabana Grande de Palenque','San Gregorio de Nigua','Yaguate','Villa Altagracia'],
  'Espaillat': ['Moca','Cayetano Germosén','Gaspar Hernández','Jamao al Norte'],
  'Duarte': ['San Francisco de Macorís','Arenoso','Castillo','Eugenio María de Hostos','Las Guáranas','Pimentel','Villa Riva'],
  'Azua': ['Azua de Compostela','Estebanía','Guayabal','Las Charcas','Las Yayas de Viajama','Padre Las Casas','Peralta','Pueblo Viejo','Sabana Yegua','Tábara Arriba'],
  'Barahona': ['Barahona','Cabral','El Peñón','Enriquillo','Fundación','Jaquimeyes','La Ciénaga','Las Salinas','Paraíso','Polo','Vicente Noble'],
  'Peravia': ['Baní','Nizao'],
  'San Juan': ['San Juan de la Maguana','Bohechío','El Cercado','Juan de Herrera','Las Matas de Farfán','Vallejuelo'],
  'María Trinidad Sánchez': ['Nagua','Cabrera','El Factor','Río San Juan'],
  'Monseñor Nouel': ['Bonao','Jayaco','Maimón','Piedra Blanca'],
  'Monte Plata': ['Monte Plata','Bayaguana','Peralvillo','Sabana Grande de Boyá','Yamasá'],
  'Hato Mayor': ['Hato Mayor del Rey','El Valle','Sabana de la Mar'],
  'El Seibo': ['El Seibo','Miches'],
  'Samaná': ['Samaná','Las Terrenas','Sánchez'],
  'Sánchez Ramírez': ['Cotuí','Cevicos','Fantino','La Mata'],
  'Monte Cristi': ['Monte Cristi','Castañuelas','Guayubín','Las Matas de Santa Cruz','Pepillo Salcedo','Villa Vásquez'],
  'Valverde': ['Mao','Esperanza','Laguna Salada'],
  'Santiago Rodríguez': ['Sabaneta','Los Almácigos','Monción'],
  'Dajabón': ['Dajabón','El Pino','Loma de Cabrera','Partido','Restauración'],
  'Elías Piña': ['Comendador','Bánica','El Llano','Hondo Valle','Juan Santiago','Pedro Santana'],
  'Independencia': ['Jimaní','Cristóbal','Duvergé','La Descubierta','Mella','Postrer Río'],
  'Bahoruco': ['Neiba','Galván','Los Ríos','Tamayo','Villa Jaragua'],
  'Pedernales': ['Pedernales','Oviedo'],
  'Hermanas Mirabal': ['Salcedo','Tenares','Villa Tapia'],
  'San José de Ocoa': ['San José de Ocoa','Sabana Larga','Rancho Arriba'],
}

const METODOS = [
  { id: 'transferencia', icon: '🏦', titulo: 'Transferencia / Depósito', desc: 'Paga por transferencia bancaria o depósito' },
  { id: 'contraentrega', icon: '💵', titulo: 'Pago contra entrega',       desc: 'Pagas en efectivo al recibir tu pedido' },
  { id: 'pagadito',      icon: '💳', titulo: 'Tarjeta de crédito/débito', desc: 'Pago seguro con Pagadito — Visa, Mastercard' },
]

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
    </div>
  )
}

function Input({ error, ...props }) {
  return (
    <input
      {...props}
      className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'}`}
    />
  )
}

function Select({ error, children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors bg-white ${error ? 'border-red-400' : 'border-gray-200 focus:border-primary'}`}
    >
      {children}
    </select>
  )
}

export default function Checkout() {
  const { items, total: cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (items.length === 0) navigate('/catalogo', { replace: true })
  }, [items, navigate])

  const [form, setForm] = useState({ nombre: '', apellidos: '', email: '', whatsapp: '', calle: '', sector: '', municipio: '', provincia: '', referencia: '' })
  const [errors, setErrors]     = useState({})
  const [metodo, setMetodo]     = useState('transferencia')
  const [enviando, setEnviando] = useState(false)

  const subtotal   = cartTotal
  const costoEnvio  = ENVIO_GRATIS.includes(form.provincia) ? 0 : (form.provincia ? ENVIO_INTERIOR : ENVIO_INTERIOR)
  const totalFinal  = subtotal + costoEnvio
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  function validar() {
    const e = {}
    if (!form.nombre.trim())    e.nombre    = 'Campo requerido'
    if (!form.apellidos.trim()) e.apellidos = 'Campo requerido'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.whatsapp.trim())  e.whatsapp  = 'Campo requerido'
    if (!form.calle.trim())     e.calle     = 'Campo requerido'
    if (!form.sector.trim())    e.sector    = 'Campo requerido'
    if (!form.municipio.trim()) e.municipio = 'Campo requerido'
    if (!form.provincia)        e.provincia = 'Selecciona una provincia'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const buildMsg = () => {
    const lineas = items.map(i => `• *${i.nombre}* x${i.cantidad} — RD$${(i.precio * i.cantidad).toLocaleString()}`)
    const ml = METODOS.find(m => m.id === metodo)?.titulo || metodo
    const envioMsg = costoEnvio === 0 ? 'GRATIS' : `RD$${costoEnvio.toLocaleString()}`
    return [
      '🛍️ *Nuevo pedido — VitaGloss RD*', '',
      `👤 *Cliente:* ${form.nombre} ${form.apellidos}`,
      `📧 *Email:* ${form.email}`, `📱 *WhatsApp:* ${form.whatsapp}`, '',
      '📦 *Productos:*', ...lineas, '',
      `💰 *Subtotal:* RD$${subtotal.toLocaleString()}`,
      `🚚 *Envío:* ${envioMsg}`,
      `🏙️ *Provincia:* ${form.provincia}`,
      `💳 *Total: RD$${totalFinal.toLocaleString()}*`, '',
      '📍 *Dirección:*', form.calle, `${form.sector}, ${form.municipio}, ${form.provincia}`,
      form.referencia ? `Ref: ${form.referencia}` : '', '',
      `💳 *Método de pago:* ${ml}`, '', '¡Gracias por tu pedido! 🙏',
    ].filter(Boolean).join('\n')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    setEnviando(true)
    const refCode = sessionStorage.getItem('vg_ref') || ''
    const dir = `${form.calle}, ${form.sector}, ${form.municipio}, ${form.provincia}${form.referencia ? ` — ${form.referencia}` : ''}`
    const orderItems = items.map(i => ({ nombre: i.nombre, articulo: i.articulo || '', cantidad: i.cantidad, precio: i.precio }))

    // ── Pagadito: redirigir a pasarela de pago ────────────────────────────
    if (metodo === 'pagadito') {
      try {
        // Guardar datos del pedido en sessionStorage para recuperar en orden-confirmada
        sessionStorage.setItem('vg_checkout_data', JSON.stringify({
          ...form, refCode, items: orderItems, total: totalFinal,
        }))
        // ERN: numérico puro, 9 dígitos máx → cabe en int 32-bit de PHP (max 2147483647)
        // Date.now() en 2026 = 13 dígitos; tomamos los últimos 9 para evitar overflow
        const ern = String(Date.now() % 1000000000)
        const res = await fetch(`${API_BASE}/checkout/pagadito/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: orderItems,
            total: subtotal,
            ern,
            provincia: form.provincia,
          }),
        })
        const data = await res.json()
        if (!data.ok || !data.paymentUrl) {
          alert(data.error || 'Error al iniciar el pago. Intenta de nuevo.')
          setEnviando(false)
          return
        }
        clearCart()
        window.location.href = data.paymentUrl
        return
      } catch {
        alert('No se pudo conectar con Pagadito. Intenta con otro método de pago.')
        setEnviando(false)
        return
      }
    }

    // ── Transferencia / Contra entrega: flujo WhatsApp ────────────────────
    api.createOrder({
      nombre: `${form.nombre} ${form.apellidos}`.trim(),
      whatsapp: form.whatsapp, email: form.email, direccionEntrega: dir,
      metodoPago: metodo,
      items: orderItems,
      total: totalFinal, refCode,
    }).catch(() => {})
    window.open(`https://wa.me/18492763532?text=${encodeURIComponent(buildMsg())}`, '_blank')
    clearCart()
    navigate('/')
    setEnviando(false)
  }

  if (items.length === 0) return null

  return (
    <form onSubmit={handleSubmit} noValidate className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link to="/catalogo" className="text-gray-400 hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <span className="font-bold text-gray-700 text-sm">Finalizar pedido</span>
          <span className="ml-auto text-[11px] text-gray-400 flex items-center gap-1">🔒 Pedido seguro</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <div className="space-y-5">

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-800 text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
              Datos personales
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Nombre" required error={errors.nombre}><Input placeholder="Juan" value={form.nombre} onChange={set('nombre')} error={errors.nombre} /></Field>
              <Field label="Apellidos" required error={errors.apellidos}><Input placeholder="Pérez Martínez" value={form.apellidos} onChange={set('apellidos')} error={errors.apellidos} /></Field>
              <Field label="Email" required error={errors.email}><Input type="email" placeholder="juan@correo.com" value={form.email} onChange={set('email')} error={errors.email} /></Field>
              <Field label="WhatsApp" required error={errors.whatsapp}><Input type="tel" placeholder="809-555-1234" value={form.whatsapp} onChange={set('whatsapp')} error={errors.whatsapp} /></Field>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-800 text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
              Dirección de entrega
            </h2>
            <div className="space-y-3">
              <Field label="Calle y número" required error={errors.calle}><Input placeholder="Calle Duarte #45" value={form.calle} onChange={set('calle')} error={errors.calle} /></Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Provincia" required error={errors.provincia}>
                  <Select value={form.provincia} onChange={e => { set('provincia')(e); setForm(f => ({ ...f, municipio: '' })) }} error={errors.provincia}>
                    <option value="">Selecciona tu provincia…</option>
                    {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                  </Select>
                </Field>
                <Field label="Municipio / Ciudad" required error={errors.municipio}>
                  {form.provincia && MUNICIPIOS_POR_PROVINCIA[form.provincia] ? (
                    <Select value={form.municipio} onChange={set('municipio')} error={errors.municipio}>
                      <option value="">Selecciona municipio…</option>
                      {(MUNICIPIOS_POR_PROVINCIA[form.provincia] || []).map(m => <option key={m} value={m}>{m}</option>)}
                    </Select>
                  ) : (
                    <Input placeholder="Ej: Santo Domingo Norte" value={form.municipio} onChange={set('municipio')} error={errors.municipio} />
                  )}
                </Field>
              </div>
              <Field label="Sector / Barrio" required error={errors.sector}><Input placeholder="Los Prados" value={form.sector} onChange={set('sector')} error={errors.sector} /></Field>
              <Field label="Referencias (opcional)"><Input placeholder="Ej: Casa azul, portón negro, cerca del parque…" value={form.referencia} onChange={set('referencia')} /></Field>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-800 text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
              Método de pago
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {METODOS.map(m => (
                <button key={m.id} type="button" onClick={() => setMetodo(m.id)}
                  className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all ${metodo === m.id ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                >
                  {metodo === m.id && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-gray-800 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </span>
                  )}
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-xs font-bold text-gray-800 text-center">{m.titulo}</span>
                  <span className="text-[10px] text-gray-500 text-center">{m.desc}</span>
                </button>
              ))}
            </div>
            {metodo === 'pagadito' && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-blue-700 text-xs space-y-1">
                <p className="flex items-center gap-2"><span className="text-lg">🔒</span><span>Serás redirigido a la pasarela segura de <strong>Pagadito</strong> para completar tu pago con tarjeta.</span></p>
                <p className="text-blue-500 pl-7">⚠️ Pagadito puede cobrar un cargo por procesamiento de tarjeta, visible en su pantalla de pago.</p>
              </div>
            )}
            {Object.keys(errors).length > 0 && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-xs">
                ⚠️ Completa todos los campos obligatorios antes de continuar
              </div>
            )}
          </section>
        </div>

        <div className="lg:sticky lg:top-6 h-fit">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 text-base mb-4">Resumen del pedido</h2>
            <div className="space-y-3 mb-5">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <img src={item.imagen} alt={item.nombre} className="w-12 h-12 object-contain rounded-xl border border-gray-100 bg-gray-50 p-1" />
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-gray-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">{item.cantidad}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{item.nombre}</p>
                    <p className="text-xs text-gray-400">RD${item.precio.toLocaleString()} c/u</p>
                  </div>
                  <span className="text-sm font-bold text-gray-700 flex-shrink-0">RD${(item.precio * item.cantidad).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>RD${subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Envío a domicilio</span>
                <span className={costoEnvio === 0 ? 'text-green-600 font-semibold' : ''}>
                  {costoEnvio === 0 ? 'GRATIS 🎉' : `RD$${costoEnvio.toLocaleString()}`}
                </span>
              </div>
              {!form.provincia && (
                <p className="text-[10px] text-gray-400">Selecciona tu provincia para ver el costo de envío</p>
              )}
              <div className="flex justify-between font-black text-gray-900 text-lg pt-2 border-t border-gray-100"><span>Total</span><span>RD${totalFinal.toLocaleString()}</span></div>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-1.5">
              {['✅ Productos 100% originales Amway','🔒 Pedido confirmado por WhatsApp','🚚 Envío a todo el país (1–3 días)','💬 Te contactamos para coordinar'].map(g => <p key={g} className="text-[11px] text-gray-500">{g}</p>)}
            </div>
            <button type="submit" disabled={enviando} className={`mt-6 w-full font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 text-base shadow-lg disabled:bg-gray-300 ${metodo === 'pagadito' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200' : 'bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-green-200'}`}>
              {enviando ? 'Procesando…' : metodo === 'pagadito' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  Pagar con tarjeta — RD${totalFinal.toLocaleString()}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.855L.057 23.169a.75.75 0 0 0 .921.921l5.314-1.474A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.516-5.162-1.415l-.371-.219-3.843 1.067 1.067-3.843-.219-.371A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  Hacer mi pedido
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
