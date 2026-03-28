/**
 * OrdenConfirmada.jsx — Página de confirmación de compra
 *
 * Flujo PayPal:
 *   URL: /orden-confirmada?orderId=xxx&invoice=yyy&metodo=paypal
 *   → La orden ya fue creada en backend (captura PayPal), solo mostrar datos.
 *
 * Flujo Pagadito:
 *   URL: /orden-confirmada?token=xxx&ern=xxx
 *   → Pagadito redirige aquí tras el pago. Hay que:
 *       1. Leer sessionStorage "vg_checkout_data" (guardado antes del redirect)
 *       2. Llamar api.pagaditoVerify() con token + datos del cliente
 *       3. Si OK → limpiar sessionStorage y mostrar confirmación
 *       4. Si error → mostrar mensaje + botón WhatsApp de soporte
 */

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../services/api'
import { useCart } from '../context/CartContext'

const METODO_LABEL = {
  paypal:    'PayPal',
  pagadito:  'Pagadito (Tarjeta / Transferencia)',
  whatsapp:  'WhatsApp',
}

const METODO_ICON = {
  paypal:   '🟦',
  pagadito: '💳',
  whatsapp: '💬',
}

// ─── Estado de carga ─────────────────────────────────────────────────────────
function LoadingCard() {
  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-8 py-10 text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
        <h1 className="text-white font-black text-2xl mb-1">Verificando pago…</h1>
        <p className="text-blue-100 text-sm">Por favor espera, estamos confirmando tu transacción con Pagadito</p>
      </div>
      <div className="px-8 py-8 text-center text-gray-400 text-sm">
        Esto puede tomar unos segundos. No cierres esta ventana.
      </div>
    </div>
  )
}

// ─── Estado de error ──────────────────────────────────────────────────────────
function ErrorCard({ mensaje, onRetry, retrying }) {
  const waText = encodeURIComponent(
    'Hola VitaGloss RD! 👋 Intenté pagar en línea con Pagadito pero hubo un problema al confirmar mi pago. ¿Pueden ayudarme?'
  )
  const waLink = `https://wa.me/18492763532?text=${waText}`

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-br from-red-500 to-rose-600 px-8 py-10 text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-white font-black text-2xl mb-1">Error al confirmar</h1>
        <p className="text-red-100 text-sm">No pudimos verificar tu pago automáticamente</p>
      </div>

      <div className="px-8 py-6 space-y-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
          <p className="text-sm text-red-700 leading-relaxed">
            <strong>¿Qué pasó?</strong> {mensaje || 'Ocurrió un error al verificar el pago con Pagadito.'}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Importante:</strong> Si tu pago fue debitado, contáctanos por WhatsApp y lo resolveremos de inmediato.
            Tu dinero está seguro.
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            disabled={retrying}
            className="w-full bg-primary hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-2xl transition-colors text-sm"
          >
            {retrying ? 'Verificando…' : '🔄 Reintentar verificación'}
          </button>
        )}

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-4 rounded-2xl
            transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-200"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.855L.057 23.169a.75.75 0 0 0 .921.921l5.314-1.474A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.516-5.162-1.415l-.371-.219-3.843 1.067 1.067-3.843-.219-.371A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Contactar soporte por WhatsApp
        </a>

        <Link
          to="/catalogo"
          className="w-full block text-center text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors"
        >
          Volver al catálogo
        </Link>
      </div>
    </div>
  )
}

// ─── Tarjeta de éxito ─────────────────────────────────────────────────────────
function SuccessCard({ invoiceNumber, metodo, pgApproval }) {
  const WALink = `https://wa.me/18492763532?text=${encodeURIComponent(
    `Hola VitaGloss RD! 👋 Acabo de realizar un pago en línea.\nN.° de orden: #${invoiceNumber}\nPagado con: ${METODO_LABEL[metodo] || metodo}\n¿Pueden confirmarme el estado de mi pedido? ¡Gracias!`
  )}`

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header verde */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-8 py-10 text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-white font-black text-2xl mb-1">¡Pago confirmado!</h1>
        <p className="text-green-100 text-sm">Tu pedido fue procesado exitosamente</p>
      </div>

      {/* Detalles */}
      <div className="px-8 py-6 space-y-4">
        {/* N.° de orden */}
        {invoiceNumber && (
          <div className="bg-gray-50 rounded-2xl px-5 py-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">N.° de orden</span>
            <span className="font-black text-primary text-lg">#{invoiceNumber}</span>
          </div>
        )}

        {/* Número de aprobación Pagadito — requerido por certificación Pagadito */}
        {pgApproval && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">N.° aprobación Pagadito</span>
            <span className="font-black text-green-700 text-base tracking-widest">{pgApproval}</span>
          </div>
        )}

        {/* Método de pago */}
        <div className="bg-gray-50 rounded-2xl px-5 py-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pagado con</span>
          <span className="font-bold text-gray-700 text-sm flex items-center gap-1.5">
            <span>{METODO_ICON[metodo] || '💳'}</span>
            {METODO_LABEL[metodo] || metodo}
          </span>
        </div>

        {/* Mensaje de seguimiento */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>¿Qué sigue?</strong> Recibirás una confirmación por WhatsApp
            en las próximas horas con el seguimiento de tu envío.
            Tu pedido llega en <strong>1 a 3 días hábiles</strong>.
          </p>
        </div>

        {/* Botón WhatsApp */}
        <a
          href={WALink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-4 rounded-2xl
            transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-200"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.855L.057 23.169a.75.75 0 0 0 .921.921l5.314-1.474A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.516-5.162-1.415l-.371-.219-3.843 1.067 1.067-3.843-.219-.371A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Hablar con VitaGloss RD por WhatsApp
        </a>

        <Link
          to="/catalogo"
          className="w-full block text-center text-primary font-semibold text-sm py-2 hover:underline transition-colors"
        >
          Seguir comprando →
        </Link>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function OrdenConfirmada() {
  const [params] = useSearchParams()

  // Params de PayPal (ya confirmado en backend)
  const orderId       = params.get('orderId')  || ''
  const invoiceNumber = params.get('invoice')  || ''
  const metodoParam   = params.get('metodo')   || ''

  // Params de Pagadito redirect
  const tokenTrans    = params.get('token')    || ''
  const ern           = params.get('ern')      || ''

  // Determinar flujo
  const isPagadito = !!tokenTrans && !orderId

  // Estado
  const { clearCart } = useCart()
  const [status, setStatus]     = useState(isPagadito ? 'loading' : 'success')
  const [invoice, setInvoice]   = useState(invoiceNumber)
  const [pgApproval, setPgApproval] = useState('')
  const [error, setError]       = useState('')
  const [retrying, setRetrying] = useState(false)
  const didVerify = useRef(false)

  const verify = async (isRetry = false) => {
    if (isRetry) setRetrying(true)

    try {
      // Recuperar datos guardados antes del redirect
      const raw = sessionStorage.getItem('vg_checkout_data')

      if (!raw) {
        // Sin datos de sesión (Postman cert, browser refresh, etc.)
        // Verificar solo el estado del pago con Pagadito — sin crear orden
        const result = await api.pagaditoVerify({ tokenTrans, statusOnly: true })
        if (result.pgApproval) setPgApproval(result.pgApproval)
        setInvoice(ern || '-')
        setStatus('success')
        return
      }

      const savedData = JSON.parse(raw)

      const result = await api.pagaditoVerify({
        tokenTrans,
        ...savedData,
      })

      // Limpiar sessionStorage
      sessionStorage.removeItem('vg_checkout_data')

      setInvoice(String(result.invoiceNumber))
      if (result.pgApproval) setPgApproval(result.pgApproval)
      clearCart()  // Limpiar carrito DESPUÉS de confirmar el pago exitosamente
      setStatus('success')
    } catch (err) {
      setError(err.message || 'Error al verificar el pago con Pagadito.')
      setStatus('error')
    } finally {
      setRetrying(false)
    }
  }

  useEffect(() => {
    if (isPagadito && !didVerify.current) {
      didVerify.current = true
      verify()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Determinar método a mostrar
  const metodo = metodoParam || (isPagadito ? 'pagadito' : 'paypal')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">

      {status === 'loading' && <LoadingCard />}

      {status === 'error' && (
        <ErrorCard
          mensaje={error}
          onRetry={() => { setStatus('loading'); verify(true) }}
          retrying={retrying}
        />
      )}

      {status === 'success' && (
        <SuccessCard invoiceNumber={invoice} metodo={metodo} pgApproval={pgApproval} />
      )}

      {/* Logo */}
      <img
        src="/logo_final.webp"
        srcSet="/logo_final-200w.webp 200w, /logo_final-400w.webp 400w, /logo_final.webp 1536w"
        sizes="120px"
        alt="VitaGloss RD"
        className="h-10 object-contain mt-8 opacity-60"
      />
    </div>
  )
}
