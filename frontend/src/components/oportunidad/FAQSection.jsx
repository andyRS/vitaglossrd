import { useState } from 'react'
import { faqs } from '../../data/oportunidad'

/**
 * FAQSection
 * Preguntas frecuentes en formato acordeón
 * Maneja objeciones comunes que frenan el registro
 */
export default function FAQSection() {
  const [open, setOpen] = useState(null)

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-slate-600 bg-slate-100 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            Preguntas frecuentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Resolvemos tus dudas
          </h2>
          <p className="text-slate-500 text-lg">
            Las preguntas más comunes antes de unirse al equipo.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                open === index
                  ? 'border-emerald-300 shadow-md shadow-emerald-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpen(open === index ? null : index)}
              >
                <span
                  className={`font-semibold text-base transition-colors duration-300 ${
                    open === index ? 'text-emerald-700' : 'text-slate-800'
                  }`}
                >
                  {faq.question}
                </span>
                <span
                  className={`ml-4 w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    open === index
                      ? 'bg-emerald-500 text-white rotate-45'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  +
                </span>
              </button>

              {open === index && (
                <div className="px-6 pb-6">
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* More questions */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 mb-4">¿Tienes más preguntas?</p>
          <a
            href="https://wa.me/1XXXXXXXXXX?text=Hola,%20tengo%20preguntas%20sobre%20la%20oportunidad%20de%20negocio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
          >
            <span>💬</span>
            Pregúntanos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
