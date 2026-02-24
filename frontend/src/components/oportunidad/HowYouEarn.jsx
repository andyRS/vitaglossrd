import { useState } from 'react'
import { earningMethods } from '../../data/oportunidad'

/**
 * HowYouEarn
 * Explica los dos métodos de ingreso: ventas directas + bonus de equipo
 * Toggle interactivo entre los dos métodos
 */
export default function HowYouEarn() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            Tus ingresos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            ¿Cómo ganas dinero?
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Tienes dos fuentes de ingreso que se complementan y se potencian entre sí.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-slate-100 rounded-2xl p-1.5 gap-1">
            {earningMethods.map((method, index) => (
              <button
                key={method.id}
                onClick={() => setActive(index)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  active === index
                    ? 'bg-white shadow-md text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>{method.icon}</span>
                {method.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {earningMethods.map((method, index) => (
          <div
            key={method.id}
            className={`transition-all duration-500 ${
              active === index ? 'opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Info card */}
              <div className={`bg-gradient-to-br ${method.color} rounded-3xl p-8 text-white`}>
                <div className="text-5xl mb-6">{method.icon}</div>
                <h3 className="text-2xl font-black mb-4">{method.title}</h3>
                <p className="text-white/90 text-lg leading-relaxed mb-8">{method.description}</p>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-sm font-medium text-white/70 mb-2 uppercase tracking-wider">
                    Ejemplo práctico
                  </div>
                  <p className="text-white font-semibold text-lg">{method.example}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-3xl p-8">
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-2">
                    {method.percentage}
                  </div>
                  <div className="text-slate-600 text-lg">{method.label}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 rounded-2xl p-5 text-center">
                    <div className="text-2xl font-bold text-emerald-700 mb-1">Sin tope</div>
                    <div className="text-sm text-slate-500">de ingresos</div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-5 text-center">
                    <div className="text-2xl font-bold text-blue-700 mb-1">Mensual</div>
                    <div className="text-sm text-slate-500">pago puntual</div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-amber-500 text-xl mt-0.5">💡</span>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      La magia está en combinar ambas fuentes. Los mejores líderes del equipo
                      generan 70% de su ingreso del bonus de equipo sin vender activamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
