/**
 * CertPagadito.jsx — Página interna para completar la Certificación Técnica TECNICA-V1
 *
 * URL: /cert-pagadito (no indexada, solo uso interno)
 *
 * Simula el flujo web completo:
 *  1. Guarda datos en sessionStorage (como el checkout real)
 *  2. Llama a /api/checkout/pagadito/cert/:caso → obtiene paymentUrl
 *  3. Redirige a Pagadito
 *  4. Al volver, /orden-confirmada funciona normalmente y crea la orden en DB
 */

import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const CASOS = [
  {
    caso: 1,
    label: 'Caso 1 — 1 artículo',
    monto: '$18.44 USD',
    instruccion: 'Completar el pago',
    items: [{ nombre: 'Vitamina C Nutrilite', articulo: '4', cantidad: 1, precio: 1099 }],
  },
  {
    caso: 2,
    label: 'Caso 2 — 3 artículos',
    monto: '$23.79 USD',
    instruccion: 'Completar el pago',
    items: [
      { nombre: 'Vitamina C Nutrilite', articulo: '4', cantidad: 1, precio: 700 },
      { nombre: 'Cal Mag D Nutrilite',  articulo: '10', cantidad: 1, precio: 408 },
      { nombre: 'Vitamina D Nutrilite', articulo: '17', cantidad: 1, precio: 279 },
    ],
  },
  {
    caso: 3,
    label: 'Caso 3 — Cancelar',
    monto: '$99.91 USD',
    instruccion: '⚠️ CANCELAR en la pasarela (no pagar)',
    items: [{ nombre: 'Double X 31 días', articulo: '6', cantidad: 1, precio: 5819 }],
  },
  {
    caso: 4,
    label: 'Caso 4 — get_status',
    monto: '$104.12 USD',
    instruccion: 'Completar el pago',
    items: [
      { nombre: 'Double X 31 días',     articulo: '6', cantidad: 1, precio: 3200 },
      { nombre: 'Omega-3 Nutrilite',    articulo: '18', cantidad: 1, precio: 1748 },
      { nombre: 'Pelo Piel y Uñas',     articulo: '19', cantidad: 1, precio: 990 },
    ],
  },
]

// Datos del cliente de prueba fijos
const CLIENTE = {
  nombre: 'Andy', apellidos: 'Rosado',
  email: 'vitaglossrd@hotmail.com', whatsapp: '8492763532',
  calle: 'Calle Duarte 45', sector: 'Los Prados',
  municipio: 'Santo Domingo Norte', provincia: 'Santo Domingo',
  referencia: 'Certificacion TECNICA-V1',
  refCode: '',
}

export default function CertPagadito() {
  const [loading, setLoading] = useState(null)
  const [error, setError]     = useState('')

  const iniciarCaso = async (caso) => {
    setLoading(caso.caso)
    setError('')
    try {
      // 1. Guardar datos en sessionStorage (igual que el checkout real)
      sessionStorage.setItem('vg_checkout_data', JSON.stringify({
        ...CLIENTE,
        items: caso.items,
        total: caso.items.reduce((s, i) => s + i.precio * i.cantidad, 0),
      }))

      // 2. Llamar al endpoint de cert para obtener paymentUrl (montos USD exactos)
      const res = await fetch(`${API_BASE}/checkout/pagadito/cert/${caso.caso}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()

      if (!data.ok || !data.paymentUrl) {
        setError(data.error || 'Error al generar la URL de pago')
        setLoading(null)
        return
      }

      // 3. Redirigir a Pagadito — al volver, /orden-confirmada usará el sessionStorage
      window.location.href = data.paymentUrl
    } catch (err) {
      setError('Error de conexión: ' + err.message)
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
          <h1 className="text-xl font-black text-gray-800 mb-1">Certificación Técnica Pagadito</h1>
          <p className="text-sm text-gray-500">TECNICA-V1 — Uso interno VitaGloss RD</p>
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-blue-700 text-xs">
            <strong>Instrucciones:</strong> Haz clic en cada caso → en Pagadito usa <strong>PAGO CON Pagadito</strong> → 
            inicia sesión con la cuenta <strong>Compradores</strong> (país: El Salvador) → sigue la instrucción de cada caso.
            Al volver, la página de confirmación se mostrará automáticamente.
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-4">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-3">
          {CASOS.map((caso) => (
            <div key={caso.caso} className="bg-white rounded-2xl shadow border border-gray-100 p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-gray-800">{caso.label}</p>
                <p className="text-sm text-gray-500 mt-0.5">Monto: <strong>{caso.monto}</strong></p>
                <p className={`text-xs mt-1 ${caso.caso === 3 ? 'text-amber-600 font-semibold' : 'text-green-600'}`}>
                  {caso.instruccion}
                </p>
              </div>
              <button
                onClick={() => iniciarCaso(caso)}
                disabled={loading === caso.caso}
                className={`shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 ${
                  caso.caso === 3
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading === caso.caso ? 'Cargando…' : `Iniciar Caso ${caso.caso}`}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gray-100 rounded-2xl p-4 text-xs text-gray-500 space-y-1">
          <p><strong>Datos de cliente usados:</strong> {CLIENTE.nombre} {CLIENTE.apellidos} — {CLIENTE.email}</p>
          <p><strong>Tarjeta sandbox:</strong> PAGO CON Pagadito (cuenta Compradores, El Salvador)</p>
          <p><strong>Caso 1:</strong> ERN 628089188 — Aprobación 727BDAF1 ✅</p>
          <p><strong>Caso 2:</strong> ERN 664190078 — Aprobación 4796CF2B ✅</p>
        </div>
      </div>
    </div>
  )
}
