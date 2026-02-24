import { startSteps } from '../../data/oportunidad'

/**
 * HowToStart
 * Stepper de 3 pasos para empezar
 * Reduce fricción mostrando lo simple que es comenzar
 */
export default function HowToStart({ onCTAClick }) {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Decoración */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-teal-400 bg-teal-400/10 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider border border-teal-400/20">
            Empezar es fácil
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            3 pasos para iniciar
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Desde que decides hasta que estás activo, el proceso toma menos de 24 horas.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Línea conectora */}
          <div className="hidden lg:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {startSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                {/* Step circle */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-3xl shadow-2xl shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-700 border-2 border-emerald-500 rounded-full flex items-center justify-center text-xs font-black text-emerald-400">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{step.description}</p>

                {/* Arrow between steps */}
                {index < startSteps.length - 1 && (
                  <div className="lg:hidden mt-6 text-2xl text-emerald-500">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <button
            onClick={onCTAClick}
            className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            <span>🚀</span>
            Empezar ahora — Es gratis
          </button>
          <p className="text-slate-500 text-sm">
            Sin compromiso. Recibe información completa antes de decidir.
          </p>
        </div>
      </div>
    </section>
  )
}
