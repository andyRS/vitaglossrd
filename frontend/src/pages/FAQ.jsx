import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'

const faqs = [
  {
    categoria: '🦷 Pasta Dental y Salud Bucal (Glister™)',
    preguntas: [
      {
        p: '¿Cuál es la pasta dental número 1 del mundo?',
        r: 'La Pasta Dental Glister™ de Amway es la pasta dental más vendida en el mundo. Contiene fluoruro de sodio, menta certificada Nutrilite™ y un agente pulidor de sílice de origen natural. Elimina manchas, previene caries y no altera el microbioma oral.',
      },
      {
        p: '¿La Pasta Dental Glister™ blanquea los dientes?',
        r: 'Sí. Glister™ elimina manchas superficiales del esmalte mediante su agente pulidor de sílice natural, dejando los dientes con un brillo notablemente más blanco con el uso regular. No usa blanqueamiento agresivo, lo que la hace segura para uso diario.',
      },
      {
        p: '¿Glister™ es para toda la familia?',
        r: 'Sí. Adultos y niños mayores de 2 años pueden usarla. Para niños de 2 a 6 años, usa una cantidad del tamaño de un guisante y supervisa el cepillado. Menores de 2 años deben consultar antes al pediatra.',
      },
      {
        p: '¿Contiene flúor la pasta dental Glister™?',
        r: 'Sí, contiene fluoruro de sodio al 0.21%, conforme a las normas de la FDA. Es suficiente para proteger el esmalte y prevenir caries en adultos y niños. Además, no tiene parabenos, alcohol, peróxido ni azúcar.',
      },
      {
        p: '¿Cuántos usos tiene un tubo de Glister™?',
        r: 'Cada tubo de 200 g rinde hasta 198 usos con la cantidad recomendada (tamaño de un guisante). Es una de las razones por las que Glister™ es tan rentable comparado con otras marcas.',
      },
    ],
  },
  {
    categoria: '💊 Vitamina C Nutrilite™',
    preguntas: [
      {
        p: '¿Para qué sirve la Vitamina C Nutrilite™?',
        r: 'La Vitamina C Nutrilite™ refuerza el sistema inmunológico, estimula la producción de colágeno para piel y articulaciones, actúa como antioxidante contra el envejecimiento celular y ayuda a absorber mejor el hierro. Cada tableta aporta 500 mg de vitamina C con extracto de acerola.',
      },
      {
        p: '¿Cuánto tiempo tarda en hacer efecto la Vitamina C?',
        r: 'La vitamina C es hidrosoluble y entra al torrente sanguíneo en minutos. Los efectos visibles en la piel (mayor luminosidad, firmeza) se notan a las 3–6 semanas de uso diario constante. Para el sistema inmune, el efecto es inmediato.',
      },
      {
        p: '¿Cuándo se toma la Vitamina C Nutrilite™?',
        r: 'Se recomienda tomar 1 tableta al día, preferiblemente con alguna comida para mejor absorción y menor posibilidad de molestia gástrica. Puede dividirse en dos tomas si se prefiere.',
      },
      {
        p: '¿La Vitamina C Nutrilite™ ayuda al colágeno de la cara?',
        r: 'Sí. La vitamina C es cofactor esencial para la síntesis de colágeno. Con el uso regular ayuda a mejorar la firmeza de la piel, reducir arrugas finas y mantener una apariencia más joven. Es uno de los suplementos más recomendados para la salud de la piel.',
      },
    ],
  },
  {
    categoria: '🐟 Omega-3 y Double X™ Nutrilite™',
    preguntas: [
      {
        p: '¿Para qué sirve el Omega-3 de Nutrilite™?',
        r: 'El Omega Nutrilite™ aporta EPA y DHA de origen marino que apoyan la salud cardiovascular, reducen la inflamación, mejoran la función cerebral y la memoria, y apoyan la salud articular. Es ideal para adultos mayores, mujeres embarazadas y personas con estilo de vida activo.',
      },
      {
        p: '¿Qué es el Double X™ de Nutrilite™?',
        r: 'Double X™ es el multivitamínico más completo de Nutrilite™: incluye 12 vitaminas esenciales, 10 minerales y 22 concentrados de frutas, verduras y plantas. Cubre los requerimientos nutricionales que la alimentación diaria muchas veces no alcanza a cubrir.',
      },
      {
        p: '¿Cuánto tiempo se tarda en ver resultados con Double X™?',
        r: 'La mayoría de usuarios reportan mejoras en energía y bienestar general en las primeras 2–3 semanas. Los beneficios en piel, cabello y uñas son más notorios entre 4 y 8 semanas de uso continuo.',
      },
    ],
  },
  {
    categoria: '💪 Proteína Vegetal y Control de Peso',
    preguntas: [
      {
        p: '¿Para qué sirve la proteína vegetal en polvo Nutrilite™?',
        r: 'La Proteína Vegetal Nutrilite™ aporta proteína de soya, trigo y guisante de alta calidad. Ayuda a ganar músculo, recuperarse del ejercicio, controlar el apetito y mantener un peso saludable. Es ideal para mezclarse con jugos, batidos o leche. Suministro de 30 servings.',
      },
      {
        p: '¿El CLA 500 de Nutrilite™ funciona para bajar de peso?',
        r: 'El CLA (ácido linoleico conjugado) en combo con ejercicio y dieta equilibrada ayuda a reducir la grasa corporal y a mantener la masa muscular magra. No es una pastilla milagrosa, pero es uno de los suplementos más respaldados científicamente para la composición corporal.',
      },
      {
        p: '¿Qué hace la Fibra en Polvo Nutrilite™?',
        r: 'La Fibra en Polvo Nutrilite™ aumenta la ingesta de fibra dietética, mejora el tránsito intestinal, ayuda a controlar el apetito y contribuye a mantener niveles saludables de colesterol y azúcar en sangre. Es insípida e inodora, se mezcla fácilmente con agua o bebidas.',
      },
    ],
  },
  {
    categoria: '🛍️ Pedidos, Envíos y Pagos',
    preguntas: [
      {
        p: '¿Cómo hago un pedido en VitaGloss RD?',
        r: 'Es muy sencillo: elige tu producto en el catálogo, haz clic en "Pedir por WhatsApp" y te conectamos directamente al (849) 276-3532. Respondemos en menos de 1 hora en horario laboral (Lun–Sáb, 8am–8pm).',
      },
      {
        p: '¿Cuáles son los métodos de pago?',
        r: 'Aceptamos transferencia bancaria (BanReservas, Popular, BHD), pago móvil, efectivo en mano y tarjeta de crédito/débito con Azul (pedidos mayores a RD$1,000). Coordinamos el método más conveniente para ti.',
      },
      {
        p: '¿Hacen envíos a todo el país?',
        r: 'Sí, a todo el territorio de República Dominicana. Santo Domingo: mismo día o siguiente hábil (envío gratis en pedidos de RD$2,500+). Interior del país: 1–3 días hábiles con Caribe Express, MotoVelo o RapiDomicilio.',
      },
      {
        p: '¿Puedo comprar más de un producto a la vez?',
        r: 'Sí. Puedes combinar cualquier producto en un solo pedido. Tenemos kits y combos con descuentos especiales armados para que ahorres más.',
      },
    ],
  },
  {
    categoria: '✅ Autenticidad y Garantía',
    preguntas: [
      {
        p: '¿Son productos originales de Amway?',
        r: 'Absolutamente. Somos distribuidores independientes certificados de Amway. Compramos directamente a la compañía y todos los productos tienen número de artículo oficial verificable en el sitio de Amway (amway.com).',
      },
      {
        p: '¿Tienen garantía de satisfacción?',
        r: 'Sí. Amway respalda todos sus productos con garantía de satisfacción. Si el producto llega en mal estado o dañado, lo reemplazamos sin costo. Contáctanos por WhatsApp con foto del problema dentro de las 24 h de recibir el pedido.',
      },
      {
        p: '¿Qué es VitaGloss RD?',
        r: 'VitaGloss RD es una distribuidora independiente certificada de productos Amway en República Dominicana. Nos especializamos en suplementos Nutrilite™, salud bucal Glister™ y nutrición deportiva. Llevamos los productos directamente a tu puerta en todo el país.',
      },
    ],
  },
]

function FaqItem({ pregunta, respuesta }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between py-5 text-left group gap-4"
      >
        <span className={`font-semibold text-base transition-colors duration-200 ${open ? 'text-primary' : 'text-gray-800 group-hover:text-primary'}`}>
          {pregunta}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={`flex-shrink-0 mt-0.5 ${open ? 'text-primary' : 'text-gray-300 group-hover:text-primary'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-gray-500 text-sm leading-relaxed pb-6">{respuesta}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  // Aplanar todas las preguntas para el JSON-LD
  const allQA = faqs.flatMap(bloque => bloque.preguntas)

  useSEO({
    title: 'Preguntas Frecuentes',
    description: 'Resolvemos tus dudas sobre Pasta Dental Glister™, Vitamina C, Omega, Double X™ y todos los productos Amway Nutrilite™ en VitaGloss RD. Envío a todo el país.',
    canonical: 'https://www.vitaglossrd.com/faq',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: allQA.map(item => ({
        '@type': 'Question',
        name: item.p,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.r,
        },
      })),
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary via-blue-800 to-blue-900 text-white pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4"
          >
            Centro de Ayuda
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black mb-4"
          >
            Preguntas Frecuentes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-xl mx-auto"
          >
            Todo lo que necesitas saber antes de hacer tu pedido.
          </motion.p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-10">
          {faqs.map((bloque, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="bg-gray-50 border-b border-gray-100 px-8 py-4">
                <h2 className="font-black text-primary text-lg">{bloque.categoria}</h2>
              </div>
              <div className="px-8">
                {bloque.preguntas.map((item, j) => (
                  <FaqItem key={j} pregunta={item.p} respuesta={item.r} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Listo para comprar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 bg-gradient-to-br from-[#0a1628] via-[#1B3A6B] to-[#0f2a54] rounded-3xl p-8 text-center text-white"
        >
          <span className="text-4xl block mb-3">🛍️</span>
          <h3 className="text-2xl font-black mb-2">¿Ya tienes todo claro?</h3>
          <p className="text-white/60 mb-2 text-sm max-w-sm mx-auto">
            Tus dudas están resueltas — ahora es el momento de hacer tu pedido.
          </p>
          <p className="text-yellow-300 font-bold text-sm mb-6">
            ⚡ Nuevos clientes reciben 10% de descuento en su primer pedido
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/18492763532?text=Hola!%20Lei%20las%20FAQ%20y%20ya%20estoy%20listo%20para%20pedir.%20%C2%BFComo%20lo%20proceso%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-2xl font-black transition-all hover:scale-105"
            >
              <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Hacer mi pedido ahora
            </a>
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3 rounded-2xl font-semibold transition-all"
            >
              Ver catálogo →
            </Link>
          </div>
        </motion.div>

        {/* CTA WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-center text-white"
        >
          <span className="text-4xl block mb-4">📲</span>
          <h3 className="text-2xl font-black mb-2">¿No encontraste tu respuesta?</h3>
          <p className="text-green-100 mb-6 text-sm max-w-sm mx-auto">
            Escríbenos directamente al WhatsApp. Respondemos en menos de 1 hora.
          </p>
          <a
            href="https://wa.me/18492763532?text=Hola!%20Tengo%20una%20pregunta%20sobre%20VitaGloss%20RD"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-2xl font-black transition-all hover:scale-105"
          >
            Abrir WhatsApp →
          </a>
        </motion.div>
      </div>
    </div>
  )
}
