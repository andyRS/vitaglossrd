import { testimonials } from '../../data/oportunidad'

/**
 * TeamTestimonials
 * Carousel de testimonios del equipo real
 * Genera confianza y prueba social
 */
export default function TeamTestimonials() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Decoración */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider border border-emerald-400/20">
            El equipo habla
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Personas reales. Resultados reales.
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Conoce las historias de miembros que tomaron la decisión y transformaron sus ingresos.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-slate-300 leading-relaxed text-sm mb-6 italic">
                "{t.quote}"
              </blockquote>

              {/* Divider */}
              <div className="border-t border-white/10 pt-5">
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.role}</div>
                  </div>
                </div>

                {/* Income badge */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{t.months}</span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                    💰 {t.income}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-black text-emerald-400">200+</div>
            <div className="text-xs text-slate-400">Miembros activos</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <div>
            <div className="text-2xl font-black text-teal-400">87%</div>
            <div className="text-xs text-slate-400">Permanecen +12 meses</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <div>
            <div className="text-2xl font-black text-violet-400">4.9 ★</div>
            <div className="text-xs text-slate-400">Satisfacción del equipo</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <div>
            <div className="text-2xl font-black text-amber-400">RD$15K</div>
            <div className="text-xs text-slate-400">Ingreso promedio mensual</div>
          </div>
        </div>
      </div>
    </section>
  )
}
