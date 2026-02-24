// ─── DATA CENTRALIZADA — Página de Oportunidad / Reclutamiento ───────────────

export const stats = [
  { value: '500+', label: 'Productos disponibles' },
  { value: 'RD$15K+', label: 'Ingreso promedio mensual' },
  { value: '200+', label: 'Miembros en el equipo' },
  { value: '98%', label: 'Satisfacción de clientes' },
]

export const howItWorks = [
  {
    icon: '🛍️',
    title: 'Vendes productos',
    description:
      'Accede al catálogo Amway/Nutrilite y vende a tus clientes con hasta 30% de margen directo.',
  },
  {
    icon: '👥',
    title: 'Construyes equipo',
    description:
      'Invita a otras personas a unirse. Cuando ellas venden, tú también ganas un porcentaje.',
  },
  {
    icon: '💰',
    title: 'Ganas residual',
    description:
      'Mientras más crece tu equipo, más crece tu ingreso — incluso cuando no estás trabajando activamente.',
  },
]

export const startSteps = [
  {
    step: '01',
    title: 'Regístrate',
    description: 'Contacta a nuestro equipo por WhatsApp. El proceso es rápido y sin complicaciones.',
    icon: '📋',
  },
  {
    step: '02',
    title: 'Recibe tu kit de inicio',
    description: 'Accedes a tu tienda online personal, catálogo digital y materiales de capacitación.',
    icon: '📦',
  },
  {
    step: '03',
    title: 'Empieza a ganar',
    description: 'Comparte los productos con tu red y comienza a recibir tus primeros ingresos.',
    icon: '🚀',
  },
]

export const earningMethods = [
  {
    id: 'direct',
    title: 'Ventas directas',
    icon: '🛒',
    color: 'from-emerald-500 to-teal-500',
    description: 'Compras al precio de distribuidor y vendes al precio de catálogo.',
    example: 'Producto cuesta RD$1,000 → Lo vendes en RD$1,300 → Ganas RD$300',
    percentage: 'Hasta 30%',
    label: 'de margen en ventas',
  },
  {
    id: 'team',
    title: 'Bonus de equipo',
    icon: '🤝',
    color: 'from-violet-500 to-purple-500',
    description: 'Ganas un porcentaje del volumen de ventas de las personas que tú introduces.',
    example: 'Tu equipo vende RD$50,000 → Puedes ganar hasta RD$9,000 adicionales',
    percentage: 'Hasta 18%',
    label: 'del volumen de tu equipo',
  },
]

export const growthLevels = [
  {
    id: 1,
    title: 'Distribuidor',
    percentage: '3% - 6%',
    pv: '200 - 600 PV',
    color: 'bg-slate-400',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-300',
    income: 'RD$2,000 - RD$5,000',
    description: 'El punto de partida. Enfócate en ventas propias y tus primeros 2-3 referidos.',
    unlocks: ['Tienda online personal', 'Acceso al catálogo completo', 'Capacitación básica'],
  },
  {
    id: 2,
    title: 'Level 6%',
    percentage: '6%',
    pv: '600 - 1,200 PV',
    color: 'bg-amber-400',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
    income: 'RD$5,000 - RD$8,000',
    description: 'Ya tienes un pequeño equipo activo. Los bonus de rendimiento empiezan a crecer.',
    unlocks: ['Bonus de rendimiento', 'Acceso a eventos de equipo', 'Materiales premium'],
  },
  {
    id: 3,
    title: 'Level 9%',
    percentage: '9%',
    pv: '1,200 - 2,400 PV',
    color: 'bg-orange-400',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-300',
    income: 'RD$8,000 - RD$15,000',
    description: 'Tu ingreso empieza a ser significativo. El trabajo en equipo se hace visible.',
    unlocks: ['Bonus de liderazgo básico', 'Reconocimiento de equipo', 'Herramientas avanzadas'],
  },
  {
    id: 4,
    title: 'Level 12%',
    percentage: '12%',
    pv: '2,400 - 4,000 PV',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-400',
    income: 'RD$15,000 - RD$25,000',
    description: 'Nivel sólido. Ya tienes ingresos que pueden reemplazar un salario tradicional.',
    unlocks: ['Bonus diferencial', 'Viajes del equipo', 'Mentoría 1 a 1'],
  },
  {
    id: 5,
    title: 'Level 15%',
    percentage: '15%',
    pv: '4,000 - 7,000 PV',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-400',
    income: 'RD$25,000 - RD$45,000',
    description: 'Liderazgo reconocido. Tu equipo produce volumen sin tu participación directa.',
    unlocks: ['Bonus de profundidad', 'Acceso a programa de líderes', 'Incentivos especiales'],
  },
  {
    id: 6,
    title: 'Platino',
    percentage: '21%+',
    pv: '7,500+ PV',
    color: 'bg-gradient-to-r from-violet-600 to-purple-600',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-400',
    income: 'RD$60,000+',
    description: 'El nivel élite. Ingresos full-time, reconocimiento y libertad de tiempo real.',
    unlocks: ['Bonus Platino', 'Viajes internacionales', 'Ingresos pasivos reales', 'Mentoría de líderes globales'],
  },
]

export const bonuses = [
  {
    title: 'Bonus de Rendimiento',
    icon: '📈',
    description:
      'Se calcula como la diferencia entre tu porcentaje de bonus y el de tus referidos directos. Mientras mayor es la diferencia, más ganas.',
    example: 'Si estás en 12% y tu referido está en 6%, recibes el 6% de diferencial sobre su volumen.',
    color: 'border-emerald-400 bg-emerald-50',
  },
  {
    title: 'Bonus de Liderazgo',
    icon: '🏆',
    description:
      'Se activa cuando uno de tus referidos alcanza el nivel Platino. Recibes un porcentaje de su volumen mensual de manera permanente.',
    example: 'Cuando tu referido llega a Platino → Tú recibes 4% de TODO lo que su grupo produce.',
    color: 'border-blue-400 bg-blue-50',
  },
  {
    title: 'Bonus de Profundidad',
    icon: '🔱',
    description:
      'Ganas sobre los niveles 2 y 3 de tu organización, no solo de tus referidos directos.',
    example: 'Tu referido → Su referido → Su referido → Tú sigues ganando en cada nivel.',
    color: 'border-violet-400 bg-violet-50',
  },
  {
    title: 'Bonus Rubí',
    icon: '💎',
    description:
      'Bonus adicional que se activa cuando produces personalmente 4,000 PV además del volumen de tu equipo.',
    example: '4,000 PV personales + equipo activo = Bonus Rubí mensual garantizado.',
    color: 'border-rose-400 bg-rose-50',
  },
]

export const tools = [
  {
    icon: '📱',
    title: 'App móvil Amway',
    description: 'Gestiona pedidos, clientes y ventas desde tu celular en cualquier momento.',
  },
  {
    icon: '🌐',
    title: 'Tienda online personal',
    description: 'Tu propia URL de tienda. Clientes compran directamente y tú recibes comisión automática.',
  },
  {
    icon: '📚',
    title: 'Catálogo digital',
    description: 'Catálogo actualizado con más de 500 productos listos para compartir por WhatsApp.',
  },
  {
    icon: '🎓',
    title: 'Academia de capacitación',
    description: 'Videos, tutoriales y webinars semanales para crecer más rápido.',
  },
  {
    icon: '💬',
    title: 'Grupo de equipo',
    description: 'Comunidad activa en WhatsApp con soporte diario de líderes del equipo.',
  },
  {
    icon: '📊',
    title: 'Dashboard de ingresos',
    description: 'Visualiza tu volumen, bonus y proyecciones en tiempo real desde tu portal.',
  },
]

export const testimonials = [
  {
    name: 'María García',
    role: 'Distribuidora — Nivel 9%',
    months: '8 meses en el equipo',
    income: 'RD$12,000/mes',
    quote:
      'Empecé con dudas pero en 3 meses ya recuperé mi inversión initial. Hoy trabajo desde casa y tengo tiempo para mi familia.',
    avatar: '👩',
    stars: 5,
  },
  {
    name: 'Carlos Reyes',
    role: 'Líder — Nivel 12%',
    months: '14 meses en el equipo',
    income: 'RD$22,000/mes',
    quote:
      'Lo que más me impresionó fue el sistema. No tuve que inventar nada, solo seguir los pasos y ser constante.',
    avatar: '👨',
    stars: 5,
  },
  {
    name: 'Ana Martínez',
    role: 'Distribuidora — Nivel 6%',
    months: '4 meses en el equipo',
    income: 'RD$6,500/mes',
    quote:
      'Trabajo part-time. Lo combino con mi trabajo actual y ya estoy generando ingresos extras significativos.',
    avatar: '👩‍💼',
    stars: 5,
  },
]

export const faqs = [
  {
    question: '¿Cuánto dinero necesito para empezar?',
    answer:
      'La inversión inicial es mínima. Solo necesitas registrarte como distribuidor. Nuestro equipo te orienta en cada paso sin que tengas que invertir grandes sumas desde el inicio.',
  },
  {
    question: '¿Necesito experiencia en ventas?',
    answer:
      'No. El sistema está diseñado para que cualquier persona pueda empezar. Recibes capacitación completa, materiales y el apoyo constante de los líderes del equipo.',
  },
  {
    question: '¿Puedo trabajar a tiempo parcial?',
    answer:
      'Completamente. Mucha gente en el equipo empezó part-time combinándolo con su trabajo. Tú decides el tiempo que le dedicas.',
  },
  {
    question: '¿Cuándo empiezo a cobrar?',
    answer:
      'Desde tu primera venta. Los pagos de ventas directas son inmediatos. Los bonus de equipo se pagan mensualmente según el volumen acumulado.',
  },
  {
    question: '¿Los productos se venden solos o tengo que ir puerta a puerta?',
    answer:
      'Tienes tu tienda online personal. Compartes el link con conocidos o en tus redes sociales. No es necesario salir a vender físicamente.',
  },
  {
    question: '¿Es esto una pirámide?',
    answer:
      'No. Amway es una empresa con más de 60 años operando en más de 100 países. Está regulada y certificada. El ingreso viene de la venta real de productos, no de reclutar personas.',
  },
]
