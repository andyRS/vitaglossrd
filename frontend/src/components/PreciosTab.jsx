import { useState, useEffect } from 'react'
import { productos } from '../data/productos'
import { COMBO_PRECIOS } from '../../data/precios.js'
import { usePrecios } from '../../context/PreciosContext'
import { api } from '../../services/api'

// Nombres de combos para mostrar
const COMBO_NOMBRES = {
  'kit-glister-completo':      'Kit Glister™ Completo',
  'kit-inmunidad-total':       'Kit Inmunidad Total',
  'kit-energia-vitalidad':     'Kit Energía y Vitalidad',
  'kit-figura-saludable':      'Kit Figura Saludable',
  'kit-belleza-total':         'Kit Belleza Total',
  'kit-huesos-articulaciones': 'Kit Huesos y Articulaciones',
  'kit-bienestar-familiar':    'Kit Bienestar Familiar',
}

// Productos de cada combo (ids)
const COMBO_PRODUCTOS = {
  'kit-glister-completo':      [1, 3, 2],
  'kit-inmunidad-total':       [4, 17, 11],
  'kit-energia-vitalidad':     [7, 16, 18],
  'kit-figura-saludable':      [13, 20, 12],
  'kit-belleza-total':         [19, 14, 4],
  'kit-huesos-articulaciones': [10, 15, 17],
  'kit-bienestar-familiar':    [1, 4, 8],
}

function autoOriginal(precio) {
  return Math.round(Number(precio) / 0.65)
}

export default function PreciosTab() {
  const { preciosMap, comboPreciosMap, setPreciosMap, setComboPreciosMap } = usePrecios()

  // Estado local editable (copia de los live)
  const [rows, setRows] = useState([])
  const [comboRows, setComboRows] = useState([])
  const [autoCalc, setAutoCalc] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null) // {type:'ok'|'error', text}
  const [search, setSearch] = useState('')

  // Inicializa rows desde los precios en vivo
  useEffect(() => {
    const initial = productos.map(p => {
      const live = preciosMap[p.id] ?? { precio: p.precio, precioOriginal: p.precioOriginal }
      return {
        id:             p.id,
        nombre:         p.nombre,
        precio:         live.precio,
        precioOriginal: live.precioOriginal,
      }
    })
    setRows(initial)

    const comboInitial = Object.keys(COMBO_NOMBRES).map(id => ({
      id,
      nombre:      COMBO_NOMBRES[id],
      precioCombo: comboPreciosMap[id]?.precioCombo ?? COMBO_PRECIOS[id]?.precioCombo ?? 0,
    }))
    setComboRows(comboInitial)
  }, [preciosMap, comboPreciosMap])

  function setRow(idx, field, val) {
    setRows(prev => prev.map((r, i) => {
      if (i !== idx) return r
      const updated = { ...r, [field]: val }
      if (field === 'precio' && autoCalc) {
        updated.precioOriginal = autoOriginal(val)
      }
      return updated
    }))
  }

  function setComboRow(idx, val) {
    setComboRows(prev => prev.map((r, i) => i === idx ? { ...r, precioCombo: val } : r))
  }

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    try {
      const productos_payload = rows.map(r => ({
        id:             Number(r.id),
        precio:         Number(r.precio),
        precioOriginal: Number(r.precioOriginal),
      }))
      const combos_payload = comboRows.map(r => ({
        id:          r.id,
        precioCombo: Number(r.precioCombo),
      }))
      await api.updatePrecios({ productos: productos_payload, combos: combos_payload })

      // Actualiza el contexto en vivo
      const newMap = {}
      productos_payload.forEach(r => { newMap[r.id] = { precio: r.precio, precioOriginal: r.precioOriginal } })
      setPreciosMap(newMap)
      const newComboMap = {}
      combos_payload.forEach(r => { newComboMap[r.id] = { precioCombo: r.precioCombo } })
      setComboPreciosMap(newComboMap)

      setMsg({ type: 'ok', text: '✅ Precios guardados correctamente. Los cambios ya son visibles en la tienda.' })
    } catch (err) {
      setMsg({ type: 'error', text: `❌ Error al guardar: ${err.message}` })
    } finally {
      setSaving(false)
    }
  }

  const filtered = rows.filter(r =>
    r.nombre.toLowerCase().includes(search.toLowerCase()) ||
    String(r.id).includes(search)
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary">💲 Gestor de Precios</h2>
          <p className="text-gray-500 text-sm mt-1">
            Edita los precios del catálogo. Los cambios se aplican en tiempo real.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-all shadow-md"
        >
          {saving ? '⏳ Guardando...' : '💾 Guardar precios'}
        </button>
      </div>

      {/* Mensaje feedback */}
      {msg && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${msg.type === 'ok' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {msg.text}
        </div>
      )}

      {/* Opciones */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoCalc}
            onChange={e => setAutoCalc(e.target.checked)}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-sm text-gray-700 font-medium">
            Auto-calcular precio tachado (precio ÷ 0.65)
          </span>
        </label>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Buscar producto..."
          className="ml-auto border border-gray-200 rounded-xl px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* ── TABLA PRODUCTOS ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 grid grid-cols-[40px_1fr_150px_150px] gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <span>#</span>
          <span>Producto</span>
          <span>Precio RD$</span>
          <span>Precio tachado RD$</span>
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.map((r, i) => {
            const idx = rows.findIndex(row => row.id === r.id)
            const precioActual = Number(r.precio)
            const descuento = r.precioOriginal ? Math.round(((r.precioOriginal - precioActual) / r.precioOriginal) * 100) : 0
            return (
              <div key={r.id} className="px-4 py-3 grid grid-cols-[40px_1fr_150px_150px] gap-3 items-center hover:bg-gray-50/50 transition-colors">
                <span className="text-xs font-bold text-gray-300">{r.id}</span>
                <span className="text-sm font-medium text-gray-800 truncate">{r.nombre}</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">RD$</span>
                  <input
                    type="number"
                    value={r.precio}
                    onChange={e => setRow(idx, 'precio', e.target.value)}
                    className="w-full pl-10 pr-2 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">RD$</span>
                    <input
                      type="number"
                      value={r.precioOriginal}
                      onChange={e => setRow(idx, 'precioOriginal', e.target.value)}
                      disabled={autoCalc}
                      className="w-full pl-10 pr-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-400 line-through focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  {descuento > 0 && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg whitespace-nowrap">-{descuento}%</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── TABLA COMBOS ────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">🎁 Kits y Combos</h3>
        <p className="text-sm text-gray-500 mb-4">
          El precio normal se calcula automáticamente sumando los productos del kit. Solo edita el <strong>precio combo</strong>.
        </p>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 grid grid-cols-[1fr_140px_140px_70px] gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Kit / Combo</span>
            <span>Precio normal</span>
            <span>Precio combo RD$</span>
            <span>Ahorro</span>
          </div>
          <div className="divide-y divide-gray-50">
            {comboRows.map((combo, i) => {
              const productIds = COMBO_PRODUCTOS[combo.id] || []
              const precioNormal = productIds.reduce((sum, pid) => {
                const liveRow = rows.find(r => r.id === pid)
                return sum + (liveRow ? Number(liveRow.precio) : 0)
              }, 0)
              const ahorro = precioNormal - Number(combo.precioCombo)
              const pct = precioNormal > 0 ? Math.round((ahorro / precioNormal) * 100) : 0
              return (
                <div key={combo.id} className="px-4 py-3 grid grid-cols-[1fr_140px_140px_70px] gap-3 items-center hover:bg-gray-50/50">
                  <span className="text-sm font-medium text-gray-800">{combo.nombre}</span>
                  <span className="text-sm text-gray-400">RD${precioNormal.toLocaleString('es-DO')}</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">RD$</span>
                    <input
                      type="number"
                      value={combo.precioCombo}
                      onChange={e => setComboRow(i, e.target.value)}
                      className="w-full pl-10 pr-2 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg text-center ${ahorro > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                    {ahorro > 0 ? `-${pct}%` : '⚠️'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Botón inferior */}
      <div className="flex justify-end pt-2 pb-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-all shadow-md text-base"
        >
          {saving ? '⏳ Guardando...' : '💾 Guardar todos los precios'}
        </button>
      </div>
    </div>
  )
}
