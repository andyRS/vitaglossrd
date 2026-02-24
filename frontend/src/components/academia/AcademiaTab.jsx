import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MODULOS, RECURSOS } from '../../data/academia'

const STORAGE_KEY = 'vg_academia_progreso'

function loadProgress() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || [])
  } catch {
    return new Set()
  }
}

function saveProgress(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

function copyText(text) {
  if (navigator.clipboard) return navigator.clipboard.writeText(text)
  const ta = document.createElement('textarea')
  ta.value = text
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}

const totalLecciones = MODULOS.reduce((acc, m) => acc + m.lecciones.length, 0)

// ─── Video Player Modal ───────────────────────────────────────────────────────
function VideoModal({ leccion, modulo, completadas, onToggleComplete, onClose }) {
  if (!leccion) return null
  const done = completadas.has(leccion.id)
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video */}
        <div className="aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${leccion.videoId}?rel=0&modestbranding=1`}
            title={leccion.titulo}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Info */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2 ${modulo.colorLight} ${modulo.colorText}`}>
                {modulo.emoji} {modulo.titulo}
              </div>
              <h3 className="font-black text-slate-900 text-lg leading-tight">{leccion.titulo}</h3>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-sm transition-colors"
            >
              ✕
            </button>
          </div>

          <p className="text-slate-500 text-sm leading-relaxed mb-5">{leccion.descripcion}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>⏱️</span> {leccion.duracion}
            </span>
            <button
              onClick={() => onToggleComplete(leccion.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                done
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {done ? '✓ Completada' : '☐ Marcar como completada'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Resource Modal ───────────────────────────────────────────────────────────
function RecursoModal({ item, onClose }) {
  const [copiado, setCopiado] = useState(false)
  if (!item || !item.texto) return null

  const handleCopy = () => {
    copyText(item.texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{item.icono}</span>
            <h3 className="font-black text-slate-900">{item.titulo}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <pre className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed font-sans bg-slate-50 rounded-2xl p-4 max-h-72 overflow-y-auto border border-slate-200 mb-4">
            {item.texto}
          </pre>
          <button
            onClick={handleCopy}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
              copiado
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-900 hover:bg-slate-700 text-white'
            }`}
          >
            {copiado ? '✓ ¡Copiado al portapapeles!' : '📋 Copiar todo el texto'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main Academia Tab ────────────────────────────────────────────────────────
export default function AcademiaTab({ onChangeTab }) {
  const [completadas, setCompletadas] = useState(loadProgress)
  const [moduloAbierto, setModuloAbierto] = useState(MODULOS[0].id)
  const [leccionActiva, setLeccionActiva] = useState(null)
  const [moduloLeccion, setModuloLeccion] = useState(null)
  const [recursoModal, setRecursoModal] = useState(null)
  const [vista, setVista] = useState('cursos') // 'cursos' | 'recursos'

  const toggleComplete = useCallback((leccionId) => {
    setCompletadas((prev) => {
      const next = new Set(prev)
      if (next.has(leccionId)) next.delete(leccionId)
      else next.add(leccionId)
      saveProgress(next)
      return next
    })
  }, [])

  const porcentaje = Math.round((completadas.size / totalLecciones) * 100)

  const abrirLeccion = (leccion, modulo) => {
    setLeccionActiva(leccion)
    setModuloLeccion(modulo)
  }

  return (
    <div>
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#1B3A6B] rounded-3xl p-6 mb-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black mb-1">🟢 Equipo VitaGlossRD</h2>
            <p className="text-white/60 text-sm">
              Tu centro de capacitación para vender más y crecer más rápido.
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-black text-secondary">{porcentaje}%</div>
            <div className="text-white/50 text-xs">completado</div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/40 mb-1.5">
            <span>{completadas.size} de {totalLecciones} lecciones completadas</span>
            {porcentaje === 100 && <span className="text-yellow-400 font-bold">🏆 ¡Curso terminado!</span>}
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${porcentaje}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-secondary to-teal-400 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* ── NAVEGACIÓN CURSOS / RECURSOS ──────────────────────────────── */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setVista('cursos')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
            vista === 'cursos'
              ? 'bg-[#1B3A6B] text-white shadow-md'
              : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
          }`}
        >
          🎬 Módulos y lecciones
        </button>
        <button
          onClick={() => setVista('recursos')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
            vista === 'recursos'
              ? 'bg-[#1B3A6B] text-white shadow-md'
              : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
          }`}
        >
          📚 Recursos y materiales
        </button>
      </div>

      {/* ── VISTA: MÓDULOS ──────────────────────────────────────────────── */}
      {vista === 'cursos' && (
        <div className="space-y-4">
          {MODULOS.map((modulo) => {
            const completadasEnModulo = modulo.lecciones.filter((l) => completadas.has(l.id)).length
            const moduloCompleto = completadasEnModulo === modulo.lecciones.length
            const estaAbierto = moduloAbierto === modulo.id

            return (
              <div
                key={modulo.id}
                className={`bg-white rounded-3xl border-2 overflow-hidden transition-all duration-300 ${modulo.colorBorder}`}
              >
                {/* Header del módulo */}
                <button
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setModuloAbierto(estaAbierto ? null : modulo.id)}
                >
                  {/* Ícono módulo */}
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${modulo.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-md`}
                  >
                    {modulo.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-gray-900 text-base">{modulo.titulo}</h3>
                      {moduloCompleto && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                          ✓ Completado
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{modulo.descripcion}</p>
                  </div>

                  {/* Progreso + chevron */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className={`text-sm font-black ${modulo.colorText}`}>
                        {completadasEnModulo}/{modulo.lecciones.length}
                      </div>
                      <div className="text-xs text-gray-400">lecciones</div>
                    </div>
                    <span
                      className={`text-gray-400 text-sm transition-transform duration-300 ${estaAbierto ? 'rotate-180' : ''}`}
                    >
                      ▼
                    </span>
                  </div>
                </button>

                {/* Barra de progreso del módulo */}
                <div className="px-5 pb-1">
                  <div className="w-full bg-gray-100 rounded-full h-1">
                    <div
                      className={`h-1 bg-gradient-to-r ${modulo.color} rounded-full transition-all duration-500`}
                      style={{ width: `${(completadasEnModulo / modulo.lecciones.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Lecciones */}
                <AnimatePresence>
                  {estaAbierto && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 space-y-2">
                        {modulo.lecciones.map((leccion, index) => {
                          const done = completadas.has(leccion.id)
                          return (
                            <div
                              key={leccion.id}
                              className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer group transition-all duration-200 ${
                                done
                                  ? 'bg-emerald-50 border-emerald-200'
                                  : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm'
                              }`}
                              onClick={() => abrirLeccion(leccion, modulo)}
                            >
                              {/* Número / check */}
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 transition-colors ${
                                  done
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-white border-2 border-gray-200 text-gray-400 group-hover:border-gray-400'
                                }`}
                              >
                                {done ? '✓' : index + 1}
                              </div>

                              {/* Info lección */}
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`font-semibold text-sm ${
                                    done ? 'text-emerald-800' : 'text-gray-800 group-hover:text-gray-900'
                                  }`}
                                >
                                  {leccion.titulo}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">⏱️ {leccion.duracion}</p>
                              </div>

                              {/* Play button */}
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                  done
                                    ? 'bg-emerald-200 text-emerald-700'
                                    : 'bg-white border border-gray-200 text-gray-400 group-hover:bg-[#1B3A6B] group-hover:border-[#1B3A6B] group-hover:text-white'
                                }`}
                              >
                                ▶
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      )}

      {/* ── VISTA: RECURSOS ─────────────────────────────────────────────── */}
      {vista === 'recursos' && (
        <div className="space-y-6">
          {/* Nota sobre Plantillas */}
          <div
            className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 cursor-pointer hover:bg-blue-100 transition-colors"
            onClick={() => onChangeTab && onChangeTab(3)}
          >
            <span className="text-2xl">💬</span>
            <div>
              <p className="font-bold text-blue-800 text-sm">¿Buscas plantillas de mensaje?</p>
              <p className="text-blue-600 text-xs mt-0.5">
                El tab <strong>Plantillas</strong> tiene 6 mensajes listos para copiar y pegar. Clic aquí para ir →
              </p>
            </div>
          </div>

          {RECURSOS.map((categoria) => (
            <div key={categoria.id}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{categoria.emoji}</span>
                <h3 className="font-black text-gray-900 text-base">{categoria.categoria}</h3>
              </div>

              <div className="space-y-3">
                {categoria.items.map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl border-2 p-5 ${categoria.color}`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">{item.icono}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-sm ${categoria.colorText} mb-1`}>{item.titulo}</h4>
                        <p className="text-slate-600 text-xs leading-relaxed mb-3">{item.descripcion}</p>
                        <span className="text-xs text-slate-400 italic">{item.tipo}</span>
                      </div>
                    </div>

                    {item.texto && (
                      <button
                        onClick={() => setRecursoModal(item)}
                        className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-400 hover:shadow-sm text-gray-700 font-semibold text-sm py-2.5 rounded-xl transition-all duration-200"
                      >
                        <span>📋</span>
                        {item.accion}
                      </button>
                    )}

                    {item.tab !== undefined && (
                      <button
                        onClick={() => onChangeTab && onChangeTab(item.tab)}
                        className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-400 hover:shadow-sm text-gray-700 font-semibold text-sm py-2.5 rounded-xl transition-all duration-200"
                      >
                        <span>→</span>
                        {item.accion}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODALES ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {leccionActiva && (
          <VideoModal
            leccion={leccionActiva}
            modulo={moduloLeccion}
            completadas={completadas}
            onToggleComplete={toggleComplete}
            onClose={() => { setLeccionActiva(null); setModuloLeccion(null) }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {recursoModal && (
          <RecursoModal
            item={recursoModal}
            onClose={() => setRecursoModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
