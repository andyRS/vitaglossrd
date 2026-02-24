import { useState } from 'react'
import { bonuses } from '../../data/oportunidad'

/**
 * BonusExplainer
 * Accordeón visual explicando cada tipo de bonus
 */
export default function BonusExplainer() {
  const [open, setOpen] = useState(0)

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider border border-rose-200">
            Estructura de bonus
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            Más bonus = Más ingreso pasivo
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Cada nivel activa nuevos tipos de bonus que se suman a tus ingresos de manera automática.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {bonuses.map((bonus, index) => (
            <div
              key={index}
              className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${bonus.color}`}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpen(open === index ? -1 : index)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{bonus.icon}</span>
                  <span className="font-bold text-slate-900 text-lg">{bonus.title}</span>
                </div>
                <span
                  className={`text-slate-500 text-xl font-light transition-transform duration-300 ${
                    open === index ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>

              {open === index && (
                <div className="px-6 pb-6">
                  <div className="border-t border-current/10 pt-5">
                    <p className="text-slate-700 leading-relaxed mb-4">{bonus.description}</p>
                    <div className="bg-white/70 rounded-xl p-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Ejemplo real
                      </div>
                      <p className="text-slate-800 font-medium text-sm">{bonus.example}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-10 bg-slate-900 rounded-2xl p-6 text-center">
          <p className="text-slate-300 text-sm leading-relaxed">
            🔑 Clave:{' '}
            <span className="text-white font-semibold">
              Los bonus se acumulan y no se cancelan entre sí.
            </span>{' '}
            Cuando llegas a Platino, puedes estar recibiendo los 4 tipos de bonus simultáneamente.
          </p>
        </div>
      </div>
    </section>
  )
}
