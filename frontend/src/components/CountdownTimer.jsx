import { useState, useEffect } from 'react'

// Calcula tiempo restante hasta el próximo domingo a medianoche
function getNextSunday() {
  const now = new Date()
  const day = now.getDay() // 0 = domingo
  const daysUntilSunday = day === 0 ? 7 : 7 - day
  const next = new Date(now)
  next.setDate(now.getDate() + daysUntilSunday)
  next.setHours(23, 59, 59, 0)
  return next
}

export default function CountdownTimer({ label = 'Oferta válida por:', afterMsg = 'Los precios vuelven a precio normal el lunes' }) {
  const [target] = useState(getNextSunday)
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    const calc = () => {
      const diff = target - new Date()
      if (diff <= 0) return setTimeLeft({ d: 0, h: 0, m: 0, s: 0 })
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [target])

  const pad = (n) => String(n ?? 0).padStart(2, '0')

  const units = [
    { val: pad(timeLeft.d), label: 'días' },
    { val: pad(timeLeft.h), label: 'horas' },
    { val: pad(timeLeft.m), label: 'min' },
    { val: pad(timeLeft.s), label: 'seg' },
  ]

  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-2">
        {units.map((u, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="bg-white/15 border border-white/20 rounded-xl px-3 py-2 text-center min-w-[48px] backdrop-blur-sm">
              <p className="text-white font-black text-xl leading-none tabular-nums" aria-live="off">{u.val}</p>
              <p className="text-white/40 text-[10px] mt-0.5">{u.label}</p>
            </div>
            {i < units.length - 1 && (
              <span className="text-white/40 font-bold text-lg" aria-hidden="true">:</span>
            )}
          </div>
        ))}
      </div>
      {afterMsg && (
        <p className="text-orange-300/80 text-[11px] font-semibold flex items-center gap-1">
          <span aria-hidden="true">⚠️</span> {afterMsg}
        </p>
      )}
    </div>
  )
}
