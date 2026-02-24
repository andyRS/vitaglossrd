import { useState } from 'react'

/**
 * JoinCTA
 * Sección final de conversión
 * Formulario rápido + WhatsApp — Objetivo: generar el lead
 */
export default function JoinCTA() {
  const [form, setForm] = useState({ name: '', phone: '', interest: '' })
  const [submitted, setSubmitted] = useState(false)

  const WHATSAPP_NUMBER = '18091234567' // ← Cambiar por número real

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hola! Me interesa unirme al equipo VitaGloss RD. Mi nombre es ${form.name || 'visitante'} y me gustaría recibir más información.`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí se puede conectar al backend /api/leads
    setSubmitted(true)
    handleWhatsApp()
  }

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
      {/* Decoraciones */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-900/30 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Cupos limitados este mes
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
          Tu momento es ahora.
          <br />
          <span className="text-emerald-100">¿Entramos juntos?</span>
        </h2>

        <p className="text-emerald-100 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Deja tus datos y uno de nuestros líderes te contactará en menos de 24 horas para
          explicarte todo sin compromiso.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-8 max-w-md mx-auto shadow-2xl"
          >
            <h3 className="text-xl font-black text-slate-900 mb-6 text-left">
              Recibe información gratuita
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 text-left">
                  Tu nombre
                </label>
                <input
                  type="text"
                  required
                  placeholder="¿Cómo te llamas?"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 text-left">
                  WhatsApp / Teléfono
                </label>
                <input
                  type="tel"
                  required
                  placeholder="809-000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 text-left">
                  ¿Qué te interesa más?
                </label>
                <select
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="ventas">Solo quiero vender productos</option>
                  <option value="equipo">Quiero construir un equipo</option>
                  <option value="ambos">Me interesa las dos cosas</option>
                  <option value="info">Solo quiero más información</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 mb-4"
            >
              <span>📱</span>
              Continuar por WhatsApp
            </button>

            <p className="text-xs text-slate-400 text-center">
              🔒 Información privada. No spam. Respuesta en menos de 24h.
            </p>
          </form>
        ) : (
          <div className="bg-white rounded-3xl p-10 max-w-md mx-auto shadow-2xl">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">
              ¡Nos vemos en WhatsApp!
            </h3>
            <p className="text-slate-600 mb-6">
              Se abrió WhatsApp con tu mensaje. Si no se abrió automáticamente, haz clic aquí:
            </p>
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-4 rounded-2xl transition-colors duration-300"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Abrir WhatsApp
            </button>
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-emerald-100/70 text-sm">
          <div className="flex items-center gap-2">
            <span>🏢</span>
            <span>Empresa con 60+ años</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌍</span>
            <span>Presencia en 100+ países</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>100% legal y regulada</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📦</span>
            <span>Productos certificados</span>
          </div>
        </div>
      </div>
    </section>
  )
}
