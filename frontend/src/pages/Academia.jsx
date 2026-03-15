import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import { useAuth } from '../context/AuthContext'
import { MODULOS, RECURSOS } from '../data/academia'

// ─── helpers ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'vg_academia_v2'
const NOTES_KEY   = 'vg_academia_notes'

function loadProgress() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []) }
  catch { return new Set() }
}
function saveProgress(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...s]))
}
function loadNotes() {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY)) || {} }
  catch { return {} }
}
function saveNotes(n) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(n))
}
function copyText(text) {
  if (navigator.clipboard) return navigator.clipboard.writeText(text)
  const ta = document.createElement('textarea')
  ta.value = text
  document.body.appendChild(ta); ta.select()
  document.execCommand('copy'); document.body.removeChild(ta)
}

const ALL_LECCIONES = MODULOS.flatMap(m => m.lecciones.map(l => ({ ...l, modulo: m })))
const TOTAL = ALL_LECCIONES.length

// ─── Resource Modal ───────────────────────────────────────────────────────────
function RecursoModal({ item, onClose }) {
  const [copiado, setCopiado] = useState(false)
  const handleCopy = () => {
    copyText(item.texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <m.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{item.icono}</span>
            <h3 className="font-black text-slate-900 text-sm">{item.titulo}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-slate-400 text-sm transition-colors">✕</button>
        </div>
        <div className="p-6">
          <pre className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed font-sans bg-slate-50 rounded-2xl p-4 max-h-64 overflow-y-auto border border-slate-200 mb-4">{item.texto}</pre>
          <button onClick={handleCopy} className={`w-full py-3 rounded-2xl font-bold text-sm transition-all ${copiado ? 'bg-emerald-500 text-white' : 'bg-[#0a1628] hover:bg-[#1B3A6B] text-white'}`}>
            {copiado ? '✓ ¡Copiado!' : '📋 Copiar todo el texto'}
          </button>
        </div>
      </m.div>
    </div>
  )
}

// ─── Sidebar Module Tree ──────────────────────────────────────────────────────
function Sidebar({ completadas, leccionActiva, onSelect, onClose, visible }) {
  const [abiertos, setAbiertos] = useState(() => new Set([MODULOS[0]?.id]))

  const toggleModulo = (id) => setAbiertos(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  return (
    <>
      {/* Overlay mobile */}
      {visible && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}

      <aside className={`fixed top-0 left-0 h-full w-80 bg-[#0d1b2e] z-40 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-auto lg:h-auto lg:flex lg:flex-col ${visible ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Mi Equipo VitaGloss</p>
            <h2 className="text-white font-black text-base leading-tight">Academia de Ventas</h2>
          </div>
          <button onClick={onClose} className="lg:hidden w-8 h-8 rounded-full bg-white/10 text-white/60 hover:text-white flex items-center justify-center text-sm">✕</button>
        </div>

        {/* Progress bar */}
        <div className="px-5 py-3 border-b border-white/10 flex-shrink-0">
          <div className="flex justify-between text-[11px] text-white/40 mb-1.5">
            <span>{completadas.size}/{TOTAL} lecciones</span>
            <span className="text-emerald-400 font-bold">{Math.round((completadas.size / TOTAL) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.round((completadas.size / TOTAL) * 100)}%` }}
            />
          </div>
        </div>

        {/* Module list */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-1 px-2">
          {MODULOS.map((modulo, mIdx) => {
            const completadasModulo = modulo.lecciones.filter(l => completadas.has(l.id)).length
            const completo = completadasModulo === modulo.lecciones.length
            const open = abiertos.has(modulo.id)
            return (
              <div key={modulo.id}>
                <button
                  onClick={() => toggleModulo(modulo.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
                >
                  <span className="text-lg flex-shrink-0">{modulo.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 group-hover:text-white font-semibold text-xs leading-tight truncate">{modulo.titulo}</p>
                    <p className="text-white/30 text-[10px] mt-0.5">{completadasModulo}/{modulo.lecciones.length} completadas</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {completo && <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px]">✓</span>}
                    <span className={`text-white/30 text-[10px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }} className="overflow-hidden pl-3"
                    >
                      {modulo.lecciones.map((leccion, lIdx) => {
                        const done = completadas.has(leccion.id)
                        const active = leccionActiva?.id === leccion.id
                        return (
                          <button
                            key={leccion.id}
                            onClick={() => { onSelect(leccion, modulo); onClose() }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left mb-0.5 group ${active ? 'bg-white/10 border border-white/15' : 'hover:bg-white/5'}`}
                          >
                            <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black border transition-all ${done ? 'bg-emerald-500 border-emerald-500 text-white' : active ? 'border-white/50 text-white/50' : 'border-white/20 text-white/30'}`}>
                              {done ? '✓' : lIdx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs leading-snug truncate font-medium transition-colors ${active ? 'text-white' : done ? 'text-white/50' : 'text-white/60 group-hover:text-white/80'}`}>{leccion.titulo}</p>
                              <p className="text-white/25 text-[10px]">⏱ {leccion.duracion}</p>
                            </div>
                            {active && <span className="text-emerald-400 text-[10px] flex-shrink-0">▶</span>}
                          </button>
                        )
                      })}
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </nav>

        {/* Recursos link */}
        <div className="px-4 py-3 border-t border-white/10 flex-shrink-0">
          <p className="text-white/25 text-[10px] uppercase tracking-widest mb-2 font-semibold">Materiales</p>
          <div className="space-y-1">
            {RECURSOS.map(r => (
              <div key={r.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg">
                <span className="text-sm">{r.emoji}</span>
                <span className="text-white/40 text-xs">{r.categoria}</span>
                <span className="text-white/20 text-[10px] ml-auto">{r.items.length} items</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}

// ─── Video Player ─────────────────────────────────────────────────────────────
function VideoPlayer({ leccion, modulo, completadas, onToggle, onNext, onPrev, hasNext, hasPrev }) {
  const done = completadas.has(leccion.id)
  const [notaTxt, setNotaTxt] = useState('')
  const [notes, setNotes] = useState(loadNotes)
  const [notaGuardada, setNotaGuardada] = useState(false)
  const [activeTab, setActiveTab] = useState('descripcion')

  const leccionNotes = notes[leccion.id] || []

  const guardarNota = () => {
    if (!notaTxt.trim()) return
    const nueva = { texto: notaTxt.trim(), fecha: new Date().toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' }) }
    const updated = { ...notes, [leccion.id]: [nueva, ...(notes[leccion.id] || [])] }
    setNotes(updated)
    saveNotes(updated)
    setNotaTxt('')
    setNotaGuardada(true)
    setTimeout(() => setNotaGuardada(false), 2000)
  }

  const eliminarNota = (idx) => {
    const updated = { ...notes, [leccion.id]: notes[leccion.id].filter((_, i) => i !== idx) }
    setNotes(updated)
    saveNotes(updated)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-auto bg-white">
      {/* Video */}
      <div className="bg-black w-full" style={{ aspectRatio: '16/9' }}>
        <iframe
          key={leccion.id}
          src={`https://www.youtube.com/embed/${leccion.videoId}?rel=0&modestbranding=1&autoplay=1`}
          title={leccion.titulo}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Lesson header */}
      <div className="px-6 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5 flex-wrap">
              <span className="text-lg">{modulo.emoji}</span>
              <span className="font-semibold text-gray-500">{modulo.titulo}</span>
              <span>·</span>
              <span>⏱ {leccion.duracion}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">{leccion.titulo}</h1>
          </div>
          <button
            onClick={() => onToggle(leccion.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all border-2 ${
              done
                ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600'
                : 'border-gray-200 text-gray-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <span>{done ? '✓' : '○'}</span>
            <span className="hidden sm:inline">{done ? 'Completada' : 'Marcar hecha'}</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 bg-gray-50">
        <button
          onClick={onPrev} disabled={!hasPrev}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-white border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >← Anterior</button>
        <button
          onClick={onNext} disabled={!hasNext}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#1B3A6B] text-white hover:bg-[#0a1628] disabled:opacity-30 disabled:cursor-not-allowed transition-all ml-auto"
        >Siguiente →</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-100 px-6">
        {[
          { key: 'descripcion', label: '📋 Descripción' },
          { key: 'notas', label: `📝 Notas${leccionNotes.length > 0 ? ` (${leccionNotes.length})` : ''}` },
        ].map(t => (
          <button
            key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === t.key ? 'border-[#1B3A6B] text-[#1B3A6B]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >{t.label}</button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-6 py-5 flex-1">
        {activeTab === 'descripcion' && (
          <div>
            <p className="text-gray-600 leading-relaxed text-sm">{leccion.descripcion}</p>

            {done && (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="text-emerald-800 font-bold text-sm">¡Lección completada!</p>
                  <p className="text-emerald-600 text-xs mt-0.5">Sigue avanzando para dominar la estrategia.</p>
                </div>
              </div>
            )}

            {hasNext && (
              <button
                onClick={onNext}
                className="mt-5 w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1B3A6B] hover:bg-[#0a1628] text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all"
              >
                Continuar → <span className="opacity-70">siguiente lección</span>
              </button>
            )}
          </div>
        )}

        {activeTab === 'notas' && (
          <div>
            <div className="flex gap-2 mb-4">
              <textarea
                value={notaTxt} onChange={e => setNotaTxt(e.target.value)}
                placeholder="Escribe una nota personal sobre esta lección..."
                className="flex-1 text-sm border border-gray-200 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:border-[#1B3A6B] transition-colors bg-gray-50"
                rows={3}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) guardarNota() }}
              />
            </div>
            <button
              onClick={guardarNota}
              className={`mb-5 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${notaGuardada ? 'bg-emerald-500 text-white' : 'bg-[#1B3A6B] hover:bg-[#0a1628] text-white'}`}
            >{notaGuardada ? '✓ Guardada' : '+ Guardar nota'}</button>

            {leccionNotes.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Sin notas aún. Escribe lo que aprendes aquí.</p>
            ) : (
              <div className="space-y-3">
                {leccionNotes.map((nota, i) => (
                  <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3 group">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-800 leading-relaxed flex-1">{nota.texto}</p>
                      <button onClick={() => eliminarNota(i)} className="text-gray-300 hover:text-red-400 text-xs flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">{nota.fecha}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Home / Landing (no lesson selected) ─────────────────────────────────────
function AcademiaHome({ completadas, onSelect, nombre }) {
  const [recursoModal, setRecursoModal] = useState(null)
  const porcentaje = Math.round((completadas.size / TOTAL) * 100)
  const nombreCorto = nombre?.split(' ')[0] || 'crack'

  // Find last completed or first lesson
  const nextLesson = ALL_LECCIONES.find(l => !completadas.has(l.id)) || ALL_LECCIONES[0]

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-[#0a1628] via-[#0d2040] to-[#f0f4f8]">
      {/* Hero */}
      <div className="px-6 pt-10 pb-14 text-white max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-xs font-semibold text-white/70 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Academia en vivo · Equipo VitaGloss RD
        </div>
        <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
          Bienvenido,<br />
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{nombreCorto} 🔥</span>
        </h1>
        <p className="text-white/60 text-lg leading-relaxed mb-8">
          Aquí aprenderás exactamente cómo funciona la estrategia de Andy para vender productos Amway usando redes sociales, WhatsApp y automatización.
        </p>

        {/* Progress circle + stats */}
        <div className="bg-white/8 border border-white/12 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6">
          {/* Circle */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="48" cy="48" r="40" fill="none"
                stroke="url(#grad)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - porcentaje / 100)}`}
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
              <defs>
                <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">{porcentaje}%</span>
              <span className="text-[9px] text-white/40 uppercase">avance</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <p className="text-3xl font-black text-white">{completadas.size}</p>
              <p className="text-white/40 text-xs mt-0.5">completadas</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">{TOTAL - completadas.size}</p>
              <p className="text-white/40 text-xs mt-0.5">pendientes</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">{MODULOS.length}</p>
              <p className="text-white/40 text-xs mt-0.5">módulos</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        {porcentaje < 100 && nextLesson && (
          <button
            onClick={() => onSelect(nextLesson, nextLesson.modulo)}
            className="mt-6 flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black px-7 py-4 rounded-2xl shadow-xl shadow-emerald-900/30 transition-all hover:scale-105 text-left"
          >
            <span className="text-2xl">▶</span>
            <div>
              <p className="text-sm">{porcentaje === 0 ? 'Empezar desde el principio' : 'Continuar donde quedé'}</p>
              <p className="text-emerald-100/70 text-xs font-normal truncate max-w-[220px]">{nextLesson.titulo}</p>
            </div>
          </button>
        )}
        {porcentaje === 100 && (
          <div className="mt-6 bg-yellow-400/20 border border-yellow-400/40 rounded-2xl px-6 py-4 text-center">
            <span className="text-4xl">🏆</span>
            <p className="text-yellow-300 font-black text-lg mt-2">¡Curso completado! ¡Eres una máquina!</p>
          </div>
        )}
      </div>

      {/* Modules grid */}
      <div className="bg-[#f0f4f8] -mt-4 rounded-t-[2.5rem] px-6 pt-10 pb-16 max-w-full">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Todos los módulos</h2>
          <div className="space-y-4 mb-12">
            {MODULOS.map(modulo => {
              const done = modulo.lecciones.filter(l => completadas.has(l.id)).length
              const pct = Math.round((done / modulo.lecciones.length) * 100)
              const completo = pct === 100
              const firstPending = modulo.lecciones.find(l => !completadas.has(l.id))
              return (
                <div key={modulo.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${modulo.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-md`}>
                      {modulo.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="font-black text-gray-900 text-base">{modulo.titulo}</h3>
                        {completo && <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">✓ Completado</span>}
                      </div>
                      <p className="text-gray-400 text-xs truncate">{modulo.descripcion}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${modulo.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={`text-xs font-bold flex-shrink-0 ${modulo.colorText}`}>{done}/{modulo.lecciones.length}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelect(firstPending || modulo.lecciones[0], modulo)}
                      className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1B3A6B] hover:text-white text-gray-500 flex items-center justify-center text-sm transition-all"
                    >▶</button>
                  </div>

                  {/* Lesson list preview */}
                  <div className="border-t border-gray-50 px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      {modulo.lecciones.map((l, i) => {
                        const d = completadas.has(l.id)
                        return (
                          <button
                            key={l.id} onClick={() => onSelect(l, modulo)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${d ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'}`}
                          >
                            <span>{d ? '✓' : i + 1}</span>
                            <span className="truncate max-w-[140px]">{l.titulo}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Resources section */}
          <h2 className="text-2xl font-black text-gray-900 mb-6">Recursos y materiales</h2>
          <div className="space-y-4">
            {RECURSOS.map(cat => (
              <div key={cat.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-5 pt-5 pb-3">
                  <span className="text-xl">{cat.emoji}</span>
                  <h3 className="font-black text-gray-900">{cat.categoria}</h3>
                </div>
                <div className="px-5 pb-5 grid gap-3 sm:grid-cols-2">
                  {cat.items.map((item, idx) => (
                    <div key={idx} className={`rounded-2xl border-2 p-4 ${cat.color}`}>
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-xl flex-shrink-0">{item.icono}</span>
                        <div>
                          <p className={`font-bold text-sm ${cat.colorText}`}>{item.titulo}</p>
                          <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{item.descripcion}</p>
                        </div>
                      </div>
                      {item.texto && (
                        <button onClick={() => setRecursoModal(item)} className="w-full py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-bold hover:shadow-sm transition-all">
                          📋 {item.accion}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {recursoModal && <RecursoModal item={recursoModal} onClose={() => setRecursoModal(null)} />}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Academia Page ───────────────────────────────────────────────────────
export default function Academia() {
  useSEO({
    title: 'Academia VitaGloss RD – Mi Equipo de Ventas',
    description: 'Plataforma de capacitación exclusiva del equipo VitaGloss RD. Aprende la estrategia completa de ventas con Amway.',
  })

  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [completadas, setCompletadas] = useState(loadProgress)
  const [leccionActiva, setLeccionActiva] = useState(null)
  const [moduloActivo, setModuloActivo] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleComplete = useCallback((id) => {
    setCompletadas(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      saveProgress(next)
      return next
    })
  }, [])

  const seleccionarLeccion = useCallback((leccion, modulo) => {
    setLeccionActiva(leccion)
    setModuloActivo(modulo)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const currentIdx = leccionActiva ? ALL_LECCIONES.findIndex(l => l.id === leccionActiva.id) : -1
  const hasNext = currentIdx < ALL_LECCIONES.length - 1
  const hasPrev = currentIdx > 0
  const goNext = () => { if (hasNext) { const l = ALL_LECCIONES[currentIdx + 1]; seleccionarLeccion(l, l.modulo) } }
  const goPrev = () => { if (hasPrev) { const l = ALL_LECCIONES[currentIdx - 1]; seleccionarLeccion(l, l.modulo) } }

  const porcentaje = Math.round((completadas.size / TOTAL) * 100)

  return (
    <div className="h-screen flex flex-col bg-[#0d1b2e] overflow-hidden">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 h-13 flex items-center justify-between px-4 bg-[#0a1628] border-b border-white/10 z-50">
        <div className="flex items-center gap-3">
          {/* Hamburger - mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/70 text-sm transition-colors"
          >☰</button>
          <button
            onClick={() => { setLeccionActiva(null); setModuloActivo(null) }}
            className="hidden lg:flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold transition-colors"
          >
            <span className="text-emerald-400 text-lg">⬡</span>
            <span className="font-black">Academia</span>
          </button>
          {leccionActiva && (
            <>
              <span className="text-white/20 hidden lg:inline">/</span>
              <span className="text-white/50 text-xs hidden lg:inline truncate max-w-[200px]">{leccionActiva.titulo}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Progress pill */}
          <div className="hidden sm:flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-3 py-1.5">
            <div className="w-16 bg-white/15 rounded-full h-1 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-700" style={{ width: `${porcentaje}%` }} />
            </div>
            <span className="text-white/60 text-xs font-bold">{porcentaje}%</span>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="text-white/50 hover:text-white/80 text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all border border-white/10"
          >← Dashboard</button>
          <button
            onClick={logout}
            className="text-white/40 hover:text-red-400 text-xs transition-colors px-2 py-1.5"
          >Salir</button>
        </div>
      </header>

      {/* ── Body: Sidebar + Main ─────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        <Sidebar
          completadas={completadas}
          leccionActiva={leccionActiva}
          onSelect={seleccionarLeccion}
          onClose={() => setSidebarOpen(false)}
          visible={sidebarOpen}
        />

        {/* Main area */}
        <main className="flex-1 min-w-0 overflow-auto">
          <AnimatePresence mode="wait">
            {!leccionActiva ? (
              <m.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col h-full">
                <AcademiaHome
                  completadas={completadas}
                  onSelect={seleccionarLeccion}
                  nombre={user?.nombre}
                />
              </m.div>
            ) : (
              <m.div key={leccionActiva.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex flex-col h-full">
                <VideoPlayer
                  leccion={leccionActiva}
                  modulo={moduloActivo}
                  completadas={completadas}
                  onToggle={toggleComplete}
                  onNext={goNext}
                  onPrev={goPrev}
                  hasNext={hasNext}
                  hasPrev={hasPrev}
                />
              </m.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
