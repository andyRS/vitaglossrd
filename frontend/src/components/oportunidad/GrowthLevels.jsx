import { useState } from 'react'
import { growthLevels } from '../../data/oportunidad'

/**
 * GrowthLevels
 * Timeline interactivo de niveles de crecimiento
 * Click en nivel → Modal con detalle de ingresos y beneficios
 */
export default function GrowthLevels() {
  const [selected, setSelected] = useState(null)

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider border border-amber-200">
            Ruta de crecimiento
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            Sube de nivel. Aumenta tus ingresos.
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Cada nivel desbloquea más bonus y beneficios. Click en cualquier nivel para ver los detalles.
          </p>
        </div>

        {/* Levels grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {growthLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelected(level)}
              className={`group text-left p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${level.borderColor} bg-white`}
            >
              {/* Badge */}
              <div
                className={`inline-flex items-center gap-2 ${level.color} text-white text-xs font-bold px-3 py-1.5 rounded-lg mb-4`}
              >
                {level.title}
              </div>

              {/* Porcentaje */}
              <div className={`text-3xl font-black ${level.textColor} mb-2`}>
                {level.percentage}
              </div>
              <div className="text-xs text-slate-400 font-medium mb-3">{level.pv}</div>

              {/* Ingreso estimado */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Ingreso estimado</div>
                  <div className="text-sm font-bold text-slate-700">{level.income}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors duration-300">
                  <span className="text-slate-400 group-hover:text-emerald-600 text-sm">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Nota */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            * Los ingresos son estimados basados en rendimiento promedio del equipo.
            Los resultados individuales dependen del esfuerzo y dedicación.
          </p>
        </div>
      </div>

      {/* Modal de detalle */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between mb-6">
              <div
                className={`inline-flex items-center gap-2 ${selected.color} text-white text-sm font-bold px-4 py-2 rounded-xl`}
              >
                {selected.title}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="text-xs text-slate-400 mb-1">Porcentaje bonus</div>
                <div className={`text-2xl font-black ${selected.textColor}`}>
                  {selected.percentage}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="text-xs text-slate-400 mb-1">Ingreso mensual est.</div>
                <div className="text-2xl font-black text-emerald-600">{selected.income}</div>
              </div>
            </div>

            {/* Descripción */}
            <p className="text-slate-600 text-sm leading-relaxed mb-6">{selected.description}</p>

            {/* Unlocks */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-slate-700 mb-3">
                🔓 Qué desbloqueas en este nivel:
              </div>
              <ul className="space-y-2">
                {selected.unlocks.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Volumen requerido */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <span className="font-semibold">Volumen requerido:</span> {selected.pv}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
