import { tools } from '../../data/oportunidad'

/**
 * ToolsProvided
 * Grid mostrando todas las herramientas disponibles desde el día 1
 * Reduce fricción: "no necesitas crear nada por tu cuenta"
 */
export default function ToolsProvided() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider border border-blue-200">
            Herramientas incluidas
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            Tienes todo desde el día 1
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            No necesitas crear tu propio sistema. Todo está construido y listo para usar.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-colors duration-300">
                {tool.icon}
              </div>

              {/* Content */}
              <h3 className="font-bold text-slate-900 text-lg mb-2">{tool.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{tool.description}</p>

              {/* Included badge */}
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="text-emerald-500">✓</span>
                Incluido sin costo
              </div>
            </div>
          ))}
        </div>

        {/* Bottom banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <div className="text-2xl font-black mb-2">
            Todo esto lo recibes cuando te unes al equipo
          </div>
          <p className="text-blue-100 text-sm">
            Sin cargos adicionales. Sin suscripciones. Sin complicaciones.
          </p>
        </div>
      </div>
    </section>
  )
}
