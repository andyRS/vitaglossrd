import { useSEO } from '../hooks/useSEO'

export default function SobreNosotros() {
  useSEO({
    title: 'Sobre Nosotros',
    description: 'Conoce a VitaGloss RD, tu distribuidor independiente Amway en República Dominicana. Nuestra misión es llevar bienestar a cada hogar dominicano.',
  })
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white pt-32 pb-14 px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-2">Sobre Nosotros</h1>
        <p className="text-gray-200 max-w-xl mx-auto">
          Conoce nuestra historia y por qué elegimos Amway para transformar vidas.
        </p>
      </div>

      {/* Historia */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wide">Nuestra historia</span>
            <h2 className="text-3xl font-extrabold text-primary mt-2 mb-4">
              ¿Por qué VitaGloss RD?
            </h2>
            <p className="text-gray-600 mb-4">
              VitaGloss RD nació del compromiso de llevar productos de salud de la más alta calidad
              a cada hogar de República Dominicana de forma accesible y personalizada.
            </p>
            <p className="text-gray-600 mb-4">
              Como distribuidores independientes Amway, seleccionamos cuidadosamente los mejores
              productos de salud bucal y suplementos nutricionales para ofrecerte lo mejor
              del mercado internacional, con atención local y cercana.
            </p>
            <p className="text-gray-600">
              Creemos que la salud comienza en los detalles: una sonrisa limpia,
              un sistema inmune fuerte, y el bienestar diario de tu familia.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white text-center">
            <span className="text-7xl block mb-4">🦷</span>
            <h3 className="text-2xl font-bold mb-2">VitaGloss RD</h3>
            <p className="text-blue-100 italic">"Tu salud, tu sonrisa"</p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
              <div className="bg-white bg-opacity-10 rounded-xl p-3">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs text-blue-100">Productos originales</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-3">
                <p className="text-2xl font-bold">RD</p>
                <p className="text-xs text-blue-100">Cobertura nacional</p>
              </div>
            </div>
          </div>
        </div>

        {/* Misión, Visión, Valores */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
            <span className="text-4xl block mb-3">🎯</span>
            <h3 className="font-bold text-primary text-lg mb-2">Misión</h3>
            <p className="text-gray-500 text-sm">
              Llevar productos Amway de calidad con atención personalizada y honesta a cada hogar dominicano.
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
            <span className="text-4xl block mb-3">🔭</span>
            <h3 className="font-bold text-primary text-lg mb-2">Visión</h3>
            <p className="text-gray-500 text-sm">
              Ser la red de distribución Amway más grande y confiable de República Dominicana.
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
            <span className="text-4xl block mb-3">💎</span>
            <h3 className="font-bold text-primary text-lg mb-2">Valores</h3>
            <p className="text-gray-500 text-sm">
              Honestidad, calidad, servicio al cliente y crecimiento personal y colectivo.
            </p>
          </div>
        </div>

        {/* Amway badge */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
          <p className="text-gray-500 text-sm mb-2">Distribuidor independiente de</p>
          <h3 className="text-3xl font-extrabold text-primary">Amway</h3>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
            Amway es una de las empresas de venta directa más grandes del mundo,
            con más de 60 años de experiencia en productos de salud, nutrición y cuidado personal.
          </p>
        </div>
      </div>
    </div>
  )
}
