import { useState, useEffect } from 'react'

const CONSENT_KEY = 'vg_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY)
    if (!saved) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  function handleReject() {
    localStorage.setItem(CONSENT_KEY, 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Icono + Texto */}
          <div className="flex items-start gap-3 flex-1">
            <span className="text-2xl flex-shrink-0">🍪</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm md:text-base">
                Usamos cookies para mejorar tu experiencia
              </p>
              <p className="text-gray-500 text-xs md:text-sm mt-1">
                Utilizamos cookies propias y de terceros (incluido Google AdSense) para analizar el tráfico y mostrarte publicidad personalizada.
                Puedes consultar nuestra{' '}
                <a href="/privacidad" className="text-emerald-600 underline hover:text-emerald-700">
                  Política de Privacidad
                </a>.
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 flex-shrink-0 justify-end">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Rechazar
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
            >
              Consentir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
