import { useRef } from 'react'
import { useSEO } from '../hooks/useSEO'

import HeroSection from '../components/oportunidad/HeroSection'
import WhatIsIt from '../components/oportunidad/WhatIsIt'
import HowToStart from '../components/oportunidad/HowToStart'
import HowYouEarn from '../components/oportunidad/HowYouEarn'
import GrowthLevels from '../components/oportunidad/GrowthLevels'
import IncomeCalculator from '../components/oportunidad/IncomeCalculator'
import BonusExplainer from '../components/oportunidad/BonusExplainer'
import ToolsProvided from '../components/oportunidad/ToolsProvided'
import TeamTestimonials from '../components/oportunidad/TeamTestimonials'
import FAQSection from '../components/oportunidad/FAQSection'
import JoinCTA from '../components/oportunidad/JoinCTA'

/**
 * Oportunidad — Página de reclutamiento y onboarding
 *
 * Flujo UX (narrativa progresiva en menos de 2 min):
 * 1. ATRACCIÓN     → HeroSection       — Propuesta de valor inmediata
 * 2. ENTENDIMIENTO → WhatIsIt          — El modelo en 3 conceptos
 * 3. INICIO        → HowToStart        — 3 pasos para comenzar (reduce fricción)
 * 4. MOTIVACIÓN    → HowYouEarn        — Cómo se obtienen los ingresos
 * 5. ASPIRACIÓN    → GrowthLevels      — Niveles y crecimiento
 * 6. CREDIBILIDAD  → IncomeCalculator  — Cuánto PUEDES ganar tú
 * 7. PROFUNDIDAD   → BonusExplainer    — Estructura de bonus detallada
 * 8. CONFIANZA     → TeamTestimonials  — Historias reales del equipo
 * 9. HERRAMIENTAS  → ToolsProvided     — Todo incluido desde el día 1
 * 10. OBJECIONES   → FAQSection        — Resuelve las últimas dudas
 * 11. CONVERSIÓN   → JoinCTA           — Formulario + WhatsApp
 */
export default function Oportunidad() {
  const ctaRef = useRef(null)

  useSEO({
    title: 'Únete al equipo — VitaGloss RD | Oportunidad de negocio',
    description:
      'Construye tu propio negocio con VitaGloss RD. Vende productos Amway de calidad mundial, crea tu equipo y genera ingresos desde casa. Sin experiencia requerida.',
  })

  const scrollToCTA = () => {
    ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <main className="overflow-x-hidden">
      {/* 1. ATRACCIÓN */}
      <HeroSection onCTAClick={scrollToCTA} />

      {/* 2. ENTENDIMIENTO */}
      <WhatIsIt />

      {/* 3. INICIO — Reduce fricción */}
      <HowToStart onCTAClick={scrollToCTA} />

      {/* 4. MOTIVACIÓN — Cómo se gana dinero */}
      <HowYouEarn />

      {/* 5. ASPIRACIÓN — Ruta de crecimiento */}
      <GrowthLevels />

      {/* 6. CREDIBILIDAD — Calculadora personalizada */}
      <IncomeCalculator onCTAClick={scrollToCTA} />

      {/* 7. PROFUNDIDAD — Estructura de bonus */}
      <BonusExplainer />

      {/* 8. PRUEBA SOCIAL — Testimonios del equipo */}
      <TeamTestimonials />

      {/* 9. HERRAMIENTAS — Todo incluido */}
      <ToolsProvided />

      {/* 10. OBJECIONES — FAQ */}
      <FAQSection />

      {/* 11. CONVERSIÓN — CTA final */}
      <div ref={ctaRef}>
        <JoinCTA />
      </div>
    </main>
  )
}
