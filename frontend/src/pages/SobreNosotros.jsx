import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'

export default function SobreNosotros() {
  useSEO({
    title: 'Sobre Nosotros — VitaGloss RD',
    description: 'Somos VitaGloss RD, distribuidores independientes Amway en República Dominicana. Llevamos más de 3 años ofreciendo productos originales de salud bucal y nutrición con envío a todo el país.',
    canonical: 'https://www.vitaglossrd.com/sobre-nosotros',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'VitaGloss RD',
      url: 'https://www.vitaglossrd.com',
      logo: 'https://www.vitaglossrd.com/logo_final.png',
      description: 'Distribuidor independiente Amway en República Dominicana especializado en productos de salud bucal, vitaminas y suplementos nutricionales Nutrilite.',
      email: 'vitaglossrd@gmail.com',
      telephone: '+18492763532',
      areaServed: 'DO',
      foundingDate: '2021',
      slogan: 'Tu salud, tu sonrisa',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+18492763532',
        contactType: 'customer service',
        contactOption: 'TollFree',
        areaServed: 'DO',
        availableLanguage: 'Spanish',
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'DO',
        addressRegion: 'Santo Domingo',
      },
      sameAs: [
        'https://wa.me/18492763532',
      ],
    },
  })
  const stats = [
    { valor: '+200', label: 'Clientes satisfechos' },
    { valor: '26', label: 'Productos disponibles' },
    { valor: '3+', label: 'Años de experiencia' },
    { valor: '100%', label: 'Productos originales' },
  ]

  const valores = [
    {
      icono: '🎯',
      titulo: 'Honestidad',
      texto: 'Nunca vendemos algo que no cumple lo que promete. Cada producto que ofrecemos ha sido probado y verificado como 100% original directo de Amway.',
    },
    {
      icono: '🌿',
      titulo: 'Calidad Nutrilite',
      texto: 'Trabajamos con la línea Nutrilite, la marca de suplementos #1 del mundo, respaldada por investigación científica y más de 80 años de trayectoria.',
    },
    {
      icono: '❤️',
      titulo: 'Servicio personal',
      texto: 'No somos una tienda anónima. Cada cliente recibe asesoría directa y personalizada para encontrar el producto correcto según sus necesidades.',
    },
    {
      icono: '🚀',
      titulo: 'Entrega rápida',
      texto: 'Coordinamos envíos a todo el territorio nacional con seguimiento personalizado. Tu pedido llega seguro y en el menor tiempo posible.',
    },
    {
      icono: '🔒',
      titulo: 'Garantía total',
      texto: 'Todos los productos de Amway tienen garantía de satisfacción respaldada por la empresa. Si no quedas conforme, te buscamos una solución.',
    },
    {
      icono: '📲',
      titulo: 'Atención continua',
      texto: 'Estamos disponibles de lunes a sábado de 8am a 8pm por WhatsApp. Respondemos rápido porque sabemos que tu tiempo es valioso.',
    },
  ]

  const porQueAmway = [
    { titulo: 'Más de 60 años en el mercado', descripcion: 'Amway fue fundada en 1959 en Estados Unidos y opera en más de 100 países. Es una de las empresas de venta directa más grandes y reconocidas del mundo.' },
    { titulo: 'Investigación científica propia', descripcion: 'Amway invierte cientos de millones de dólares anuales en investigación y desarrollo. La línea Nutrilite cuenta con sus propias granjas orgánicas certificadas.' },
    { titulo: 'Ingredientes de origen natural', descripcion: 'Los suplementos Nutrilite están elaborados con concentrados de plantas cultivadas de forma sostenible, sin ingredientes artificiales innecesarios.' },
    { titulo: 'Certificaciones internacionales', descripcion: 'Los productos pasan por más de 600 controles de calidad antes de llegar al consumidor. Certificados NSF, Informed Sport y buenas prácticas de manufactura (GMP).' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white pt-24 sm:pt-32 pb-16 px-4 text-center">
        <span className="inline-block bg-white bg-opacity-20 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-widest mb-4">
          Sobre nosotros
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Conoce a<br className="hidden sm:block" /> VitaGloss RD
        </h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed">
          Somos distribuidores independientes Amway en República Dominicana, comprometidos con llevar
          salud auténtica, calidad certificada y atención personalizada a cada familia dominicana.
        </p>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold text-primary">{s.valor}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

        {/* Nuestra historia */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Nuestra historia</span>
              <h2 className="text-3xl font-extrabold text-primary mt-2 mb-5 leading-tight">
                ¿Por qué nació VitaGloss RD?
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                VitaGloss RD surgió de una necesidad real: en República Dominicana era difícil acceder a productos
                Amway originales con la confianza de que lo que comprabas era auténtico. Muchos dominicanos
                pagaban precios altos por productos de dudosa procedencia.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Decidimos convertirnos en distribuidores independientes Amway para cambiar esa realidad. Desde
                entonces, nuestra misión ha sido simple: ofrecer productos originales, con asesoría honesta
                y envíos seguros a todo el país.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Hoy atendemos a cientos de familias dominicanas que confían en nosotros para su salud bucal,
                nutrición diaria y bienestar general. Cada pedido que procesamos lleva el cuidado y la
                responsabilidad que merece la salud de tu familia.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/catalogo"
                  className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors duration-200"
                >
                  Ver productos
                </Link>
                <Link
                  to="/contacto"
                  className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors duration-200"
                >
                  Contáctanos
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-8 text-white text-center">
                <img src="/logo_final.png" alt="VitaGloss RD logo" className="h-20 mx-auto mb-4 object-contain" />
                <p className="text-blue-100 italic text-lg font-medium">"Tu salud, tu sonrisa"</p>
                <p className="text-blue-200 text-sm mt-2">Distribuidores independientes Amway · República Dominicana</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                  <p className="text-3xl font-extrabold text-primary">100%</p>
                  <p className="text-gray-500 text-xs mt-1">Productos originales</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                  <p className="text-3xl font-extrabold text-secondary">Gratis</p>
                  <p className="text-gray-500 text-xs mt-1">Asesoría personalizada</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Misión, Visión, Valores */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-primary">Nuestra identidad</h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">Los principios que guían cada decisión que tomamos como empresa</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-primary rounded-2xl p-7 text-center shadow-sm">
              <span className="text-5xl block mb-4">🎯</span>
              <h3 className="font-extrabold text-primary text-xl mb-3">Misión</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Facilitar el acceso a productos Amway originales en República Dominicana, brindando
                asesoría personalizada, precios justos y un servicio al cliente que supere expectativas.
              </p>
            </div>
            <div className="bg-primary text-white rounded-2xl p-7 text-center shadow-md">
              <span className="text-5xl block mb-4">🔭</span>
              <h3 className="font-extrabold text-xl mb-3">Visión</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Convertirnos en el distribuidor Amway de mayor confianza en República Dominicana,
                siendo referente de calidad, honestidad y bienestar familiar en todo el país.
              </p>
            </div>
            <div className="bg-white border-2 border-secondary rounded-2xl p-7 text-center shadow-sm">
              <span className="text-5xl block mb-4">💎</span>
              <h3 className="font-extrabold text-secondary text-xl mb-3">Valores</h3>
              <ul className="text-gray-600 text-sm space-y-1 text-left mt-2">
                <li>✅ Honestidad en cada transacción</li>
                <li>✅ Calidad sin concesiones</li>
                <li>✅ Servicio humano y cercano</li>
                <li>✅ Transparencia total</li>
                <li>✅ Compromiso con tu salud</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Por qué Amway */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12">
          <div className="text-center mb-10">
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">¿Por qué Amway?</span>
            <h2 className="text-3xl font-extrabold text-primary mt-2">
              La marca detrás de cada producto
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Elegimos Amway por una razón: es la empresa de salud y nutrición más confiable del mundo.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {porQueAmway.map((item) => (
              <div key={item.titulo} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-extrabold text-lg">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">{item.titulo}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nuestros valores / pilares */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-primary">Lo que nos diferencia</h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              No somos solo una tienda en línea — somos tu aliado de confianza en salud y nutrición
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {valores.map((v) => (
              <div key={v.titulo} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <span className="text-4xl block mb-3">{v.icono}</span>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{v.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-gradient-to-r from-primary to-blue-700 rounded-3xl p-10 text-white text-center">
          <h2 className="text-3xl font-extrabold mb-3">¿Listo para empezar?</h2>
          <p className="text-blue-100 max-w-lg mx-auto mb-7 leading-relaxed">
            Explora nuestro catálogo de más de 26 productos originales Amway o contáctanos directamente
            para recibir una asesoría personalizada y gratuita.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/catalogo"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-full font-bold text-sm transition-colors duration-200"
            >
              Ver catálogo completo
            </Link>
            <a
              href="https://wa.me/18492763532?text=Hola!%20Vi%20su%20p%C3%A1gina%20web%20y%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20productos%20Amway"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold text-sm transition-colors duration-200 flex items-center gap-2"
            >
              📲 Escribir por WhatsApp
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
