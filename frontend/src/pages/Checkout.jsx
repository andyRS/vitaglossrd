/**
 * Checkout.jsx — Página de pago en línea de VitaGloss RD
 *
 * Métodos de pago:
 *   • PayPal  — botones inline con @paypal/react-paypal-js
 *   • Pagadito — redirección a página segura de Pagadito
 *
 * Variables de entorno en frontend/.env.local:
 *   VITE_PAYPAL_CLIENT_ID  → Client ID de PayPal (sandbox o live)
 *
 * Paquete requerido (instalar una vez):
 *   npm install @paypal/react-paypal-js   (dentro de /frontend)
 *
 * Configurar en panel de Pagadito (Configuración técnica → URL de retorno):
 *   https://www.vitaglossrd.com/orden-confirmada?token={value}&ern={ern_value}
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { api } from '../services/api'

// ─── Constantes ───────────────────────────────────────────────────────────────
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || ''
const ENVIO            = 150   // RD$ envío fijo
const USD_RATE         = 58    // Aproximado DOP/USD para mostrar info PayPal
const PAG_PCT          = 0.05  // Pagadito: 5%
const PAG_FIXED        = 15    // Pagadito: ~$0.25 USD ≈ RD$15

const PROVINCIAS = [
  'Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional',
  'Duarte','El Seibo','Elías Piña','Espaillat','Hato Mayor',
  'Hermanas Mirabal','Independencia','La Altagracia','La Romana',
  'La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi',
  'Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná',
  'Sánchez Ramírez','San Cristóbal','San José de Ocoa','San Juan',
  'San Pedro de Macorís','Santiago','Santiago Rodríguez',
  'Santo Domingo','Valverde',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadScript(src, id) {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) return resolve()
    const s = document.createElement('script')
    s.id = id; s.src = src; s.onload = resolve; s.onerror = reject
    document.head.appendChild(s)
  })
}

function calcComisionPagadito(subtotal) {
  return Math.round(subtotal * PAG_PCT) + PAG_FIXED
}

// ─── Campo de formulario ─────────────────────────────────────────────────────
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
      className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors
        ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'}`}
    />
  )
}

function Select({ error, children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors bg-white
        ${error ? 'border-red-400' : 'border-gray-200 focus:border-primary'}`}
    >
      {children}
    </select>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  Botones de PayPal (renderizados inline con el SDK oficial)
// ══════════════════════════════════════════════════════════════════════════════
function PayPalSection({ formData, items, total, onSuccess, onError }) {
  const containerRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [ppError, setPpError] = useState('')

  useEffect(() => {
    if (!PAYPAL_CLIENT_ID) {
      setPpError('⚙️ VITE_PAYPAL_CLIENT_ID no configurado en frontend/.env.local')
      return
    }

    loadScript(
      `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&locale=es_DO&disable-funding=credit,card`,
      'paypal-sdk'
    ).then(() => {
      if (!containerRef.current || !window.paypal) return

      window.paypal.Buttons({
        style: { layout: 'vertical', color: 'blue', shape: 'pill', label: 'pay', height: 48 },
        createOrder: async () => {
          const data = await api.paypalCreate({ items, total })
          return data.id
        },
        onApprove: async (data) => {
          try {
            const refCode = sessionStorage.getItem('vg_ref') || ''
            const result  = await api.paypalCapture(data.orderID, {
              ...formData, items, total, refCode,
            })
            onSuccess(result.orderId, result.invoiceNumber)
          } catch (err) {
            onError(err.message || 'Error al confirmar el pago de PayPal')
          }
        },
        onError: (err) => {
          console.error('PayPal error:', err)
          onError('Error en PayPal. Intenta de nuevo o usa otro método.')
        },
      }).render(containerRef.current)

      setLoaded(true)
    }).catch(() => setPpError('No se pudo cargar PayPal. Verifica tu conexión.'))
  }, []) // eslint-disable-line

  if (ppError) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-xs leading-relaxed">
        {ppError}
      </div>
    )
  }

  return (
    <div>
      {!loaded && (
        <div className="flex items-center justify-center py-6 gap-2 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-[#0070ba] border-t-transparent rounded-full animate-spin" />
          Cargando PayPal…
        </div>
      )}
      <div ref={containerRef} />
      {loaded && (
        <p className="text-center text-[10px] text-gray-400 mt-2">
          Paga con tu cuenta PayPal o con tarjeta a través de PayPal · Sin comisión extra
        </p>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  Sección de Pagadito (redirección)
// ══════════════════════════════════════════════════════════════════════════════
function PagaditoSection({ formData, items, total, onError }) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const comision = calcComisionPagadito(total + ENVIO)

  const handlePagar = async () => {
    setLoading(true)
    try {
      // Generar ERN único para esta transacción
      const ern = `VG-${Date.now()}`

      // Guardar todos los datos en sessionStorage ANTES de salir del sitio
      // Los necesitamos cuando Pagadito nos devuelva al cliente
      sessionStorage.setItem('vg_checkout_data', JSON.stringify({
        ...formData,
        items,
        total,
        refCode: sessionStorage.getItem('vg_ref') || '',
        ern,
      }))

      // Crear la transacción en Pagadito → obtener URL de pago
      const result = await api.pagaditoCreate({
        items,
        total: total,  // el backend suma el envío
        ern,
      })

      if (!result.paymentUrl) throw new Error('No se obtuvo URL de pago')

      // Redirigir al cliente a la página segura de Pagadito
      window.location.href = result.paymentUrl
    } catch (err) {
      setLoading(false)
      onError(err.message || 'Error al iniciar el pago con Pagadito')
    }
  }

  return (
    <div className="space-y-4">
      {/* Desglose de comisión */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-4">
        <div className="flex items-start gap-2.5">
          <span className="text-amber-500 text-base mt-0.5 flex-shrink-0">💳</span>
          <div>
            <p className="text-xs font-bold text-amber-800 mb-1.5">Comisión por pago con tarjeta (Pagadito)</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Pagadito aplica una comisión de <strong>5% + RD$15</strong> (~RD${comision.toLocaleString()})
              por procesar pagos con tarjeta de crédito o débito.
              Esta comisión es cobrada por la pasarela y no la retiene VitaGloss RD.
            </p>
            <p className="text-xs text-amber-600 mt-2">
              💡 Para evitar comisión: usa <strong>PayPal</strong> o pide
              por <strong>WhatsApp</strong> y paga por transferencia.
            </p>
          </div>
        </div>
      </div>

      {/* Tarjetas aceptadas */}
      <div className="flex items-center gap-2 justify-center">
        <span className="text-xs text-gray-400">Acepta:</span>
        {['VISA', 'MC'].map(card => (
          <span key={card}
            className="border border-gray-200 rounded-lg px-2.5 py-1 text-[11px] font-bold text-gray-500 bg-white">
            {card}
          </span>
        ))}
        <span className="text-xs text-gray-400 ml-1">Crédito y débito</span>
      </div>

      {/* Botón de pago */}
      <button
        type="button"
        onClick={handlePagar}
        disabled={loading}
        className="w-full bg-primary hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold py-4
          rounded-2xl transition-colors flex items-center justify-center gap-2 text-base shadow-lg shadow-blue-200"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Conectando con Pagadito…
          </>
        ) : (
          <>🔒 Pagar con tarjeta (Pagadito)</>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Serás redirigido a la página segura de Pagadito · Cifrado SSL
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  Página principal de Checkout
// ══════════════════════════════════════════════════════════════════════════════
export default function Checkout() {
  const { items, total: cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (items.length === 0) navigate('/catalogo', { replace: true })
  }, [items, navigate])

  // ── Estado del formulario ─────────────────────────────────────────────────
  const [form, setForm] = useState({
    nombre: '', apellidos: '', email: '', whatsapp: '',
    calle: '', sector: '', provincia: '', referencia: '',
  })
  const [errors, setErrors] = useState({})
  const [metodo, setMetodo] = useState('paypal')  // 'paypal' | 'pagadito'
  const [apiErr, setApiErr] = useState('')

  const subtotal   = cartTotal
  const comisionPg = calcComisionPagadito(subtotal + ENVIO)
  const totalFinal = metodo === 'pagadito'
    ? subtotal + ENVIO + comisionPg
    : subtotal + ENVIO

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  // ── Validación ───────────────────────────────────────────────────────────
  function validar() {
    const e = {}
    if (!form.nombre.trim())    e.nombre    = 'Campo requerido'
    if (!form.apellidos.trim()) e.apellidos = 'Campo requerido'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.whatsapp.trim())  e.whatsapp  = 'Campo requerido'
    if (!form.calle.trim())     e.calle     = 'Campo requerido'
    if (!form.sector.trim())    e.sector    = 'Campo requerido'
    if (!form.provincia)        e.provincia = 'Selecciona una provincia'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSuccess = (orderId, invoiceNumber) => {
    clearCart()
    navigate(`/orden-confirmada?orderId=${orderId}&invoice=${invoiceNumber}&metodo=${metodo}`)
  }

  const handleError = (msg) => {
    setApiErr(msg)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Wrapper que valida el form antes de activar el pago
  const conValidacion = (fn) => (...args) => {
    if (!validar()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    fn(...args)
  }

  const cartItems = items.map(i => ({
    nombre: i.nombre, articulo: i.articulo || '',
    cantidad: i.cantidad, precio: i.precio,
  }))

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link to="/catalogo" className="text-gray-400 hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <img src="/logo-vitagloss.webp" alt="VitaGloss RD" className="h-7 object-contain"
            onError={e => { e.target.style.display = 'none' }} />
          <span className="text-gray-300">|</span>
          <span className="font-bold text-gray-700 text-sm">Pago en línea</span>
          <span className="ml-auto flex items-center gap-1 text-[11px] text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pago seguro SSL
          </span>
        </div>
      </div>

      {/* ── Error global ── */}
      {apiErr && (
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm flex items-start gap-2">
            <span className="flex-shrink-0 mt-0.5">⚠️</span>
            <div>
              <span>{apiErr}</span>
              <button onClick={() => setApiErr('')}
                className="ml-2 text-red-400 hover:text-red-600 underline text-xs">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Layout ── */}
      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">

        {/* ══════════════════════════════════════════════════════════════════
            COLUMNA IZQUIERDA — Formulario
        ══════════════════════════════════════════════════════════════════ */}
        <div className="space-y-5">

          {/* ── Datos personales ── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
              Datos personales
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Nombre" required error={errors.nombre}>
                <Input placeholder="Juan" value={form.nombre} onChange={set('nombre')} error={errors.nombre} />
              </Field>
              <Field label="Apellidos" required error={errors.apellidos}>
                <Input placeholder="Pérez Martínez" value={form.apellidos} onChange={set('apellidos')} error={errors.apellidos} />
              </Field>
              <Field label="Email" required error={errors.email}>
                <Input type="email" placeholder="juan@correo.com" value={form.email} onChange={set('email')} error={errors.email} />
              </Field>
              <Field label="WhatsApp" required error={errors.whatsapp}>
                <Input type="tel" placeholder="809-555-1234" value={form.whatsapp} onChange={set('whatsapp')} error={errors.whatsapp} />
              </Field>
            </div>
          </section>

          {/* ── Dirección de entrega ── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
              Dirección de entrega
            </h2>
            <div className="space-y-3">
              <Field label="Calle y número" required error={errors.calle}>
                <Input placeholder="Calle Duarte #45" value={form.calle} onChange={set('calle')} error={errors.calle} />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Sector / Barrio" required error={errors.sector}>
                  <Input placeholder="Los Prados" value={form.sector} onChange={set('sector')} error={errors.sector} />
                </Field>
                <Field label="Provincia" required error={errors.provincia}>
                  <Select value={form.provincia} onChange={set('provincia')} error={errors.provincia}>
                    <option value="">Selecciona…</option>
                    {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                  </Select>
                </Field>
              </div>
              <Field label="Referencias (opcional)">
                <Input
                  placeholder="Ej: Casa azul, portón negro, segunda planta…"
                  value={form.referencia} onChange={set('referencia')}
                />
              </Field>
            </div>
          </section>

          {/* ── Método de pago ── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
              Método de pago
            </h2>

            {/* ── Selector ── */}
            <div className="grid grid-cols-2 gap-3 mb-5">

              {/* PayPal */}
              <button type="button" onClick={() => setMetodo('paypal')}
                className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all
                  ${metodo === 'paypal' ? 'border-[#0070ba] bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
              >
                {metodo === 'paypal' && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-[#0070ba] rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                <svg className="h-5" viewBox="0 0 101 32" fill="none">
                  <path d="M12.237 2.017H5.997C5.567 2.017 5.2 2.33 5.133 2.754L2.573 18.9a.61.61 0 0 0 .602.706h3.072c.43 0 .797-.313.864-.737l.694-4.395a.873.873 0 0 1 .864-.737h2.033c4.23 0 6.67-2.046 7.306-6.101.287-1.773.012-3.167-.82-4.143-.913-1.074-2.532-1.476-4.951-1.476z" fill="#003087"/>
                  <path d="M37.58 9.956h-3.082a.873.873 0 0 0-.864.737l-.222 1.407-.352-.511c-1.09-1.582-3.52-2.112-5.946-2.112-5.564 0-10.317 4.215-11.241 10.125-.481 2.95.203 5.769 1.876 7.74 1.535 1.806 3.726 2.559 6.337 2.559 4.484 0 6.974-2.88 6.974-2.88l-.225 1.402a.61.61 0 0 0 .602.706h2.774c.43 0 .797-.313.864-.737l1.665-10.557a.61.61 0 0 0-.606-.679h.446z" fill="#003087"/>
                </svg>
                <span className="text-xs font-semibold text-gray-700">PayPal</span>
                <span className="text-[10px] text-green-600 font-semibold">Sin comisión extra</span>
              </button>

              {/* Pagadito — tarjeta */}
              <button type="button" onClick={() => setMetodo('pagadito')}
                className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all
                  ${metodo === 'pagadito' ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
              >
                {metodo === 'pagadito' && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                <svg className="w-7 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-xs font-semibold text-gray-700">Tarjeta</span>
                <span className="text-[10px] text-gray-400">Visa / Mastercard</span>
              </button>
            </div>

            {/* ── Contenido según método ── */}
            {metodo === 'paypal' && (
              <PayPalSection
                formData={form}
                items={cartItems}
                total={subtotal}
                onSuccess={conValidacion(handleSuccess)}
                onError={handleError}
              />
            )}

            {metodo === 'pagadito' && (
              <PagaditoSection
                formData={form}
                items={cartItems}
                total={subtotal}
                onError={handleError}
              />
            )}

            {/* Aviso de validación de formulario */}
            {Object.keys(errors).length > 0 && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-xs">
                ⚠️ Completa todos los campos obligatorios antes de pagar
              </div>
            )}
          </section>

          {/* ── O bien — pedir por WhatsApp ── */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">o si prefieres pagar en efectivo / transferencia</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <Link to="/"
            onClick={() => {
              clearCart()
              window.open(
                `https://wa.me/18492763532?text=${encodeURIComponent('Hola VitaGloss RD! 👋 Quiero hacer un pedido.')}`,
                '_blank'
              )
            }}
            className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 rounded-2xl
              transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.855L.057 23.169a.75.75 0 0 0 .921.921l5.314-1.474A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.516-5.162-1.415l-.371-.219-3.843 1.067 1.067-3.843-.219-.371A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Pedir por WhatsApp (efectivo o transferencia)
          </Link>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            COLUMNA DERECHA — Resumen del pedido (sticky en desktop)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:sticky lg:top-6 h-fit">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 text-base mb-4">
              Resumen del pedido
            </h2>

            {/* Items */}
            <div className="space-y-3 mb-5">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <img src={item.imagen} alt={item.nombre}
                      className="w-12 h-12 object-contain rounded-xl border border-gray-100 bg-gray-50 p-1" />
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-primary text-white
                      text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {item.cantidad}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{item.nombre}</p>
                    <p className="text-xs text-gray-400">RD${item.precio.toLocaleString()} c/u</p>
                  </div>
                  <span className="text-sm font-bold text-gray-700 flex-shrink-0">
                    RD${(item.precio * item.cantidad).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>RD${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Envío a domicilio</span>
                <span>RD${ENVIO.toLocaleString()}</span>
              </div>
              {metodo === 'pagadito' && (
                <div className="flex justify-between text-sm text-amber-600">
                  <span className="flex items-center gap-1">
                    Comisión Pagadito
                    <span className="text-[10px] text-amber-400">(5%+RD$15)</span>
                  </span>
                  <span>+RD${comisionPg.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-gray-900 text-lg pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>RD${totalFinal.toLocaleString()}</span>
              </div>
              {metodo === 'paypal' && (
                <p className="text-[10px] text-gray-400 text-center">
                  ≈ USD ${(totalFinal / USD_RATE).toFixed(2)} · PayPal convierte automáticamente
                </p>
              )}
            </div>

            {/* Garantías */}
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-1.5">
              {[
                '✅ Productos 100% originales Amway',
                '🔒 Pago cifrado y seguro',
                '🚚 Envío a todo el país (1–3 días)',
                '📦 Confirmación por WhatsApp',
              ].map(g => <p key={g} className="text-[11px] text-gray-500">{g}</p>)}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
