import { createContext, useContext, useEffect, useState } from 'react'
import { PRECIOS, COMBO_PRECIOS } from '../data/precios.js'
import { api } from '../services/api'

const PreciosCtx = createContext(null)

// ── LocalStorage cache ────────────────────────────────────────────────────────
const CACHE_KEY = 'vg_precios_v1'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutos

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(CACHE_KEY); return null }
    return data
  } catch { return null }
}

function writeCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })) } catch {}
}
// ─────────────────────────────────────────────────────────────────────────────

// Convierte array [{id,precio,precioOriginal}] a objeto {1: {...}, 2: {...}}
function arrayToMap(arr) {
  return arr.reduce((m, item) => { m[item.id] = item; return m }, {})
}

export function PreciosProvider({ children }) {
  // Inicializa con los valores estáticos de precios.js como fallback
  const [preciosMap, setPreciosMap]     = useState(PRECIOS)            // {[id]: {precio, precioOriginal}}
  const [comboPreciosMap, setComboPreciosMap] = useState(COMBO_PRECIOS) // {[comboId]: {precioCombo}}
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    // Serve from cache first — skips the 1.5 s API call on repeat visits
    const cached = readCache()
    if (cached) {
      if (cached.productos) setPreciosMap(arrayToMap(cached.productos))
      if (cached.combos) {
        const comboMap = cached.combos.reduce((m, c) => { m[c.id] = { precioCombo: c.precioCombo }; return m }, {})
        setComboPreciosMap(comboMap)
      }
      setLoading(false)
      return
    }

    api.getPrecios()
      .then(({ productos, combos }) => {
        if (productos && productos.length > 0) {
          setPreciosMap(arrayToMap(productos))
        }
        if (combos && combos.length > 0) {
          const comboMap = combos.reduce((m, c) => { m[c.id] = { precioCombo: c.precioCombo }; return m }, {})
          setComboPreciosMap(comboMap)
        }
        writeCache({ productos, combos })
      })
      .catch(() => {/* silently fallback to static */})
      .finally(() => setLoading(false))
  }, [])

  /**
   * Devuelve { precio, precioOriginal } para un producto por su id.
   * Usa el valor en vivo de DB; fallback al objeto del producto.
   */
  function getPrecio(id) {
    return preciosMap[id] ?? PRECIOS[id]
  }

  /**
   * Devuelve { precioCombo } para un kit/combo por su id string.
   */
  function getComboPrecio(id) {
    return comboPreciosMap[id] ?? COMBO_PRECIOS[id]
  }

  return (
    <PreciosCtx.Provider value={{ preciosMap, comboPreciosMap, getPrecio, getComboPrecio, loading, setPreciosMap, setComboPreciosMap }}>
      {children}
    </PreciosCtx.Provider>
  )
}

export function usePrecios() {
  const ctx = useContext(PreciosCtx)
  if (!ctx) throw new Error('usePrecios debe usarse dentro de PreciosProvider')
  return ctx
}
