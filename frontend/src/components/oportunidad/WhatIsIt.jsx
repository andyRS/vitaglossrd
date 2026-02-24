import { howItWorks } from '../../data/oportunidad'

/**
 * WhatIsIt
 * Explica el modelo de negocio en 3 conceptos simples
 * Posición: después del Hero
 */
export default function WhatIsIt() {
  return (
    <section id="como-funciona" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            El modelo
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            ¿Cómo funciona exactamente?
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            El negocio se basa en tres pilares simples que cualquier persona puede ejecutar.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map((item, index) => (
            <div
              key={index}
              className="group relative bg-slate-50 hover:bg-gradient-to-br hover:from-emerald-600 hover:to-teal-600 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 cursor-default"
            >
              {/* Step number */}
              <div className="absolute top-6 right-6 text-6xl font-black text-slate-200 group-hover:text-white/10 transition-colors duration-500 select-none">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Icon */}
              <div className="text-4xl mb-6">{item.icon}</div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-white mb-3 transition-colors duration-500">
                {item.title}
              </h3>
              <p className="text-slate-600 group-hover:text-emerald-100 leading-relaxed transition-colors duration-500">
                {item.description}
              </p>

              {/* Connector arrow (except last) */}
              {index < howItWorks.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-2xl text-emerald-400">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            💡 No necesitas experiencia previa. El equipo te capacita desde el día uno.
          </p>
        </div>
      </div>
    </section>
  )
}
