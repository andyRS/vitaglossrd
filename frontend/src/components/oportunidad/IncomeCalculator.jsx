import { useState, useMemo } from 'react'

/**
 * IncomeCalculator
 * Calculadora interactiva de ingresos estimados
 * Aumenta el deseo de unirse mostrando potencial de ingresos personalizado
 */
export default function IncomeCalculator({ onCTAClick }) {
  const [hours, setHours] = useState(10)
  const [teamSize, setTeamSize] = useState(5)
  const [salesPerWeek, setSalesPerWeek] = useState(3)

  const results = useMemo(() => {
    // Cálculo simplificado para fines ilustrativos
    const avgSaleValue = 1800 // RD$ por venta promedio
    const directMargin = 0.25 // 25% margen en ventas directas
    const teamBonus = 0.06 // 6% bonus promedio de equipo
    const avgTeamSalePerPerson = 3000 // RD$ ventas promedio por persona del equipo/mes

    const directIncome = salesPerWeek * 4 * avgSaleValue * directMargin
    const teamIncome = teamSize * avgTeamSalePerPerson * teamBonus
    const total = directIncome + teamIncome

    return {
      direct: Math.round(directIncome),
      team: Math.round(teamIncome),
      total: Math.round(total),
      level: total < 5000 ? 'Distribuidor' : total < 15000 ? 'Level 6-9%' : total < 30000 ? 'Level 12%' : 'Level 15%+',
    }
  }, [hours, teamSize, salesPerWeek])

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 relative overflow-hidden">
      {/* Decoraciones */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider border border-emerald-400/20">
            Calculadora de ingresos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            ¿Cuánto puedes ganar?
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Ajusta los sliders según tu situación real y descubre tu potencial de ingresos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Sliders */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 space-y-8">
            {/* Ventas por semana */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-white font-semibold text-sm">
                  🛒 Ventas por semana
                </label>
                <span className="text-emerald-400 font-bold text-lg">{salesPerWeek}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={salesPerWeek}
                onChange={(e) => setSalesPerWeek(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1 venta</span>
                <span>20 ventas</span>
              </div>
            </div>

            {/* Horas por semana */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-white font-semibold text-sm">
                  ⏰ Horas dedicadas / semana
                </label>
                <span className="text-emerald-400 font-bold text-lg">{hours}h</span>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>2h (part-time)</span>
                <span>40h (full-time)</span>
              </div>
            </div>

            {/* Tamaño del equipo */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-white font-semibold text-sm">
                  👥 Personas en tu equipo
                </label>
                <span className="text-emerald-400 font-bold text-lg">{teamSize}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Solo yo</span>
                <span>50 personas</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              * Estimación ilustrativa basada en promedios del equipo. Los resultados reales dependen del esfuerzo y condiciones de mercado.
            </p>
          </div>

          {/* Resultados */}
          <div className="space-y-4 sticky top-8">
            {/* Total */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-8 text-white text-center">
              <div className="text-sm font-medium text-emerald-100 mb-2 uppercase tracking-wider">
                Ingreso mensual estimado
              </div>
              <div className="text-5xl sm:text-6xl font-black mb-2">
                RD${results.total.toLocaleString()}
              </div>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium">
                Nivel aproximado: {results.level}
              </div>
            </div>

            {/* Desglose */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider">
                  Ventas directas
                </div>
                <div className="text-2xl font-black text-emerald-400">
                  RD${results.direct.toLocaleString()}
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider">
                  Bonus equipo
                </div>
                <div className="text-2xl font-black text-violet-400">
                  RD${results.team.toLocaleString()}
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={onCTAClick}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 font-bold text-lg px-8 py-5 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>💬</span>
              Quiero empezar a ganar esto
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
