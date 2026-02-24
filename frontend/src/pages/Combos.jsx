import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const combos = [
  {
    id: 'kit-glister-completo',
    nombre: 'Kit Glister™ Completo',
    subtitulo: 'El sistema completo de higiene bucal',
    descripcion: 'Los 3 productos Glister™ juntos para una rutina bucal perfecta de mañana a noche. Pasta + Enjuague + Spray: limpieza profunda, protección total y frescura instantánea en cualquier momento.',
    badge: '🔥 Más Popular',
    badgeColor: 'bg-secondary',
    productos: [
      { nombre: 'Pasta Dental Glister™', cantidad: '1 unidad (200g)', img: '/124106SP-690px-01.jpg', precio: 899 },
      { nombre: 'Enjuague Bucal Glister™', cantidad: '1 botella (72ml)', img: '/124108-690px-01.jpg', precio: 1169 },
      { nombre: 'Spray Bucal Glister™', cantidad: '1 envase (14ml)', img: '/124111-690px-01.jpg', precio: 820 },
    ],
    precioNormal: 2888,
    precioCombo: 2590,
    ahorro: 298,
    color: 'from-primary to-blue-700',
    whatsappMsg: encodeURIComponent('Hola VitaGloss RD! 👋 Quiero pedir el *Kit Glister™ Completo* (Pasta + Enjuague + Spray).\n\n💰 Precio combo: RD$2,590\n\n¿Cómo hago el pedido? ¡Gracias!'),
  },
  {
    id: 'kit-bucal-esencial',
    nombre: 'Kit Bucal Esencial',
    subtitulo: 'Pasta + Spray para llevar a todas partes',
    descripcion: 'El combo ideal para el día a día. La Pasta Dental Glister™ para tu rutina en casa y el Spray Bucal para tener frescura instantánea donde vayas. Perfecto para llevar al trabajo o de viaje.',
    badge: '✈️ Ideal para viajes',
    badgeColor: 'bg-green-500',
    productos: [
      { nombre: 'Pasta Dental Glister™', cantidad: '1 unidad (200g)', img: '/124106SP-690px-01.jpg', precio: 899 },
      { nombre: 'Spray Bucal Glister™', cantidad: '1 envase (14ml)', img: '/124111-690px-01.jpg', precio: 820 },
    ],
    precioNormal: 1719,
    precioCombo: 1499,
    ahorro: 220,
    color: 'from-green-500 to-teal-600',
    whatsappMsg: encodeURIComponent('Hola VitaGloss RD! 👋 Quiero pedir el *Kit Bucal Esencial* (Pasta Dental + Spray Bucal).\n\n💰 Precio combo: RD$1,499\n\n¿Cómo hago el pedido? ¡Gracias!'),
  },
  {
    id: 'kit-salud-total',
    nombre: 'Kit Salud Total',
    subtitulo: 'Bucal + Inmunidad en un solo pedido',
    descripcion: 'Combina la higiene bucal Glister™ con el poder de la Vitamina C Nutrilite™. Cuida tu sonrisa y refuerza tu sistema inmunológico al mismo tiempo. La combinación perfecta para tu bienestar.',
    badge: '💊 Bienestar completo',
    badgeColor: 'bg-yellow-500',
    productos: [
      { nombre: 'Pasta Dental Glister™', cantidad: '1 unidad (200g)', img: '/124106SP-690px-01.jpg', precio: 899 },
      { nombre: 'Vitamina C Nutrilite™', cantidad: '60 comprimidos', img: '/109741CO-690px-01.jpg', precio: 1099 },
    ],
    precioNormal: 1998,
    precioCombo: 1749,
    ahorro: 249,
    color: 'from-yellow-500 to-orange-500',
    whatsappMsg: encodeURIComponent('Hola VitaGloss RD! 👋 Quiero pedir el *Kit Salud Total* (Pasta Dental + Vitamina C Nutrilite™).\n\n💰 Precio combo: RD$1,749\n\n¿Cómo hago el pedido? ¡Gracias!'),
  },
  {
    id: 'kit-premium-total',
    nombre: 'Kit Premium Total',
    subtitulo: 'Los 4 productos — la experiencia completa',
    descripcion: 'El paquete definitivo: los 3 productos Glister™ de salud bucal más la Vitamina C Nutrilite™. Todo lo que necesitas para tu salud bucal e inmunológica en un solo pedido. El mejor valor de toda la tienda.',
    badge: '👑 Mejor valor',
    badgeColor: 'bg-primary',
    productos: [
      { nombre: 'Pasta Dental Glister™', cantidad: '1 unidad (200g)', img: '/124106SP-690px-01.jpg', precio: 899 },
      { nombre: 'Enjuague Bucal Glister™', cantidad: '1 botella (72ml)', img: '/124108-690px-01.jpg', precio: 1169 },
      { nombre: 'Spray Bucal Glister™', cantidad: '1 envase (14ml)', img: '/124111-690px-01.jpg', precio: 820 },
      { nombre: 'Vitamina C Nutrilite™', cantidad: '60 comprimidos', img: '/109741CO-690px-01.jpg', precio: 1099 },
    ],
    precioNormal: 3987,
    precioCombo: 3490,
    ahorro: 497,
    color: 'from-primary to-secondary',
    whatsappMsg: encodeURIComponent('Hola VitaGloss RD! 👋 Quiero pedir el *Kit Premium Total* (Pasta + Enjuague + Spray + Vitamina C).\n\n💰 Precio combo: RD$3,490\n\n¿Cómo hago el pedido? ¡Gracias!'),
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' } }),
}

export default function Combos() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-blue-800 to-secondary pt-32 pb-14 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-56 h-56 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase"
          >
            Ofertas exclusivas
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black leading-tight mb-4"
          >
            Combos & Paquetes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-xl mx-auto"
          >
            Ahorra más comprando juntos. Todos nuestros combos incluyen los mejores productos Amway a un precio especial.
          </motion.p>
        </div>
      </div>

      {/* Banner de ahorro */}
      <div className="bg-secondary text-white text-center py-3 text-sm font-semibold tracking-wide">
        💰 Ahorra hasta <strong>RD$497</strong> comprando en combo · Envío a todo el país
      </div>

      {/* Combos grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {combos.map((combo, i) => (
            <motion.div
              key={combo.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {/* Header del combo */}
              <div className={`bg-gradient-to-r ${combo.color} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="relative">
                  <span className={`inline-block ${combo.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full mb-3`}>
                    {combo.badge}
                  </span>
                  <h2 className="text-2xl font-black mb-1">{combo.nombre}</h2>
                  <p className="text-white/80 text-sm">{combo.subtitulo}</p>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">

                {/* Descripción */}
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{combo.descripcion}</p>

                {/* Productos incluidos */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Incluye</p>
                  <div className="space-y-3">
                    {combo.productos.map((p, j) => (
                      <div key={j} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <img
                          src={p.img}
                          alt={p.nombre}
                          className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-gray-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-dark font-semibold text-sm leading-tight truncate">{p.nombre}</p>
                          <p className="text-gray-400 text-xs">{p.cantidad}</p>
                        </div>
                        <span className="text-primary font-bold text-sm flex-shrink-0">RD${p.precio.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Precio */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 mt-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Precio normal</span>
                    <span className="text-gray-300 line-through text-sm">RD${combo.precioNormal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-primary">RD${combo.precioCombo.toLocaleString()}</span>
                      <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">
                        Ahorras RD${combo.ahorro.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón WhatsApp */}
                <a
                  href={`https://wa.me/18492763532?text=${combo.whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-base transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg shadow-green-100"
                >
                  <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Pedir este combo
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nota informativa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center"
        >
          <p className="text-primary font-bold mb-1">¿Quieres un combo personalizado?</p>
          <p className="text-gray-500 text-sm mb-4">Escríbenos y armamos el paquete ideal según tu presupuesto y necesidades.</p>
          <a
            href="https://wa.me/18492763532?text=Hola%20VitaGloss%20RD!%20Quiero%20armar%20un%20combo%20personalizado%20de%20productos%20Amway.%20%C2%BFMe%20pueden%20ayudar%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Combo personalizado
          </a>
        </motion.div>

        {/* Link de regreso */}
        <div className="text-center mt-8">
          <Link to="/catalogo" className="text-gray-400 hover:text-primary text-sm font-semibold transition-colors">
            ← Ver productos individuales
          </Link>
        </div>
      </div>
    </div>
  )
}
