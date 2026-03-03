import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'

export default function Contacto() {
  useSEO({
    title: 'Contacto — VitaGloss RD',
    description: 'Contáctanos por WhatsApp para hacer tu pedido de productos Amway en República Dominicana. Respondemos en minutos. Lunes a sábado 8am–8pm.',
    canonical: 'https://www.vitaglossrd.com/contacto',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'VitaGloss RD',
      image: 'https://www.vitaglossrd.com/logo_final.png',
      url: 'https://www.vitaglossrd.com',
      telephone: '+18492763532',
      email: 'vitaglossrd@gmail.com',
      description: 'Distribuidor independiente Amway en República Dominicana. Productos originales de salud bucal y nutrición con envío a todo el país.',
      priceRange: 'RD$500 – RD$6,000',
      areaServed: {
        '@type': 'Country',
        name: 'Dominican Republic',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
          opens: '08:00',
          closes: '20:00',
        },
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+18492763532',
        contactType: 'sales',
        availableLanguage: 'Spanish',
      },
      sameAs: ['https://wa.me/18492763532'],
    },
  })

  const [form, setForm] = useState({ nombre: '', telefono: '', producto: '', mensaje: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleWhatsApp = (e) => {
    e.preventDefault()
    const prod = form.producto ? `%0A*Producto de interés:* ${form.producto}` : ''
    const msg  = form.mensaje  ? `%0A*Mensaje:* ${form.mensaje}`             : ''
    const texto = `Hola VitaGloss RD! 👋%0A%0A*Nombre:* ${form.nombre}%0A*Teléfono:* ${form.telefono}${prod}${msg}`
    window.open(`https://wa.me/18492763532?text=${texto}`, '_blank')
  }

  const pasos = [
    { num: '01', titulo: 'Escríbenos', desc: 'Usa el formulario o escríbenos directamente por WhatsApp al (849) 276-3532.' },
    { num: '02', titulo: 'Respondemos rápido', desc: 'Contestamos en minutos durante nuestro horario de atención. Nunca hay que esperar días.' },
    { num: '03', titulo: 'Elige tu producto', desc: 'Te asesoramos gratuitamente para elegir el producto Amway ideal para tus necesidades.' },
    { num: '04', titulo: 'Recibe tu pedido', desc: 'Coordinamos el envío a tu dirección en todo el territorio nacional de manera segura.' },
  ]

  const faqContacto = [
    { p: '¿Cuánto tarda la respuesta?', r: 'Respondemos casi de inmediato durante nuestro horario de atención (Lun–Sáb 8am–8pm). Fuera de horario, respondemos en la mañana siguiente.' },
    { p: '¿Pueden asesorarme sin compromiso?', r: 'Sí, la asesoría es completamente gratuita. Puedes escribirnos con tus dudas sobre cualquier producto sin ningún compromiso de compra.' },
    { p: '¿Envían a todo el país?', r: 'Sí, hacemos envíos a todo el territorio de República Dominicana: Santo Domingo, Santiago, La Romana, San Pedro, Punta Cana y más.' },
    { p: '¿Aceptan pago contra entrega?', r: 'Dependiendo de la zona y el pedido, sí. Escríbenos para coordinar el método de pago que mejor te funcione.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white pt-24 sm:pt-32 pb-16 px-4 text-center">
        <span className="inline-block bg-white bg-opacity-20 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-widest mb-4">
          Estamos aquí para ti
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Contáctanos</h1>
        <p className="text-blue-100 max-w-xl mx-auto text-lg leading-relaxed">
          ¿Tienes preguntas sobre un producto? ¿Quieres hacer un pedido? Escríbenos y te
          respondemos en minutos con asesoría personalizada y gratuita.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center text-sm">
          <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">📲 WhatsApp directo</span>
          <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">⚡ Respuesta en minutos</span>
          <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">🇩🇴 Envíos a todo RD</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">

        {/* Formulario + Info */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-extrabold text-primary mb-2">Envíanos tu solicitud</h2>
            <p className="text-gray-500 text-sm mb-6">Completa el formulario y te contactamos por WhatsApp de inmediato.</p>
            <form onSubmit={handleWhatsApp} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tu nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Juan Pérez"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                  placeholder="(809) 000-0000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Producto de interés</label>
                <select
                  name="producto"
                  value={form.producto}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  <option value="">Selecciona un producto</option>
                  <option value="Pasta Dental Glister">Pasta Dental Glister™</option>
                  <option value="Spray Bucal Glister">Spray Bucal Glister™</option>
                  <option value="Enjuague Bucal Glister">Enjuague Bucal Glister™</option>
                  <option value="Vitamina C Nutrilite">Vitamina C Nutrilite™</option>
                  <option value="Omega-3 Nutrilite">Omega-3 Nutrilite™</option>
                  <option value="Double X Nutrilite">Multivitamínico Double X™</option>
                  <option value="Proteína Vegetal Nutrilite">Proteína Vegetal Nutrilite™</option>
                  <option value="CLA 500 Nutrilite">CLA 500 Nutrilite™</option>
                  <option value="Fibra con Manzana Nutrilite">Fibra con Manzana Nutrilite™</option>
                  <option value="Varios productos">Varios productos / No sé cuál elegir</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mensaje o pregunta</label>
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Ej: ¿Tienen disponible el combo de Glister? ¿Cuánto tarda el envío a Santiago?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-colors duration-200 flex items-center justify-center gap-2 text-base"
              >
                📲 Enviar por WhatsApp
              </button>
              <p className="text-center text-xs text-gray-400">
                Al hacer clic se abrirá WhatsApp con tu mensaje listo para enviar.
              </p>
            </form>
          </div>

          {/* Info de contacto */}
          <div className="flex flex-col gap-5">

            <div className="bg-primary text-white rounded-2xl p-7">
              <h3 className="font-extrabold text-lg mb-5">Información de contacto</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5">📲</span>
                  <div>
                    <p className="font-bold">WhatsApp</p>
                    <a
                      href="https://wa.me/18492763532"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline font-medium"
                    >
                      (849) 276-3532
                    </a>
                    <p className="text-blue-200 text-xs mt-0.5">Haz clic para abrir WhatsApp</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5">📧</span>
                  <div>
                    <p className="font-bold">Correo electrónico</p>
                    <a
                      href="mailto:vitaglossrd@gmail.com"
                      className="text-secondary hover:underline font-medium"
                    >
                      vitaglossrd@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5">📍</span>
                  <div>
                    <p className="font-bold">Cobertura</p>
                    <p className="text-blue-100">República Dominicana</p>
                    <p className="text-blue-200 text-xs mt-0.5">Enviamos a todo el territorio nacional</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5">🕐</span>
                  <div>
                    <p className="font-bold">Horario de atención</p>
                    <p className="text-blue-100">Lunes – Sábado</p>
                    <p className="text-blue-200 text-xs mt-0.5">8:00 AM – 8:00 PM</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚡</span>
                <h3 className="font-bold text-green-800 text-lg">Respuesta garantizada</h3>
              </div>
              <p className="text-green-700 text-sm leading-relaxed mb-4">
                La forma más rápida de contactarnos es por WhatsApp. Respondemos en cuestión de minutos
                durante nuestro horario habitual. Sin bots, sin esperas largas — atención humana real.
              </p>
              <a
                href="https://wa.me/18492763532?text=Hola!%20Quiero%20saber%20m%C3%A1s%20sobre%20los%20productos%20de%20VitaGloss%20RD"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                📲 Abrir WhatsApp ahora
              </a>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <span className="text-3xl">🛡️</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">Compra 100% segura</p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Todos los productos son originales Amway con garantía de satisfacción.
                  Si no quedas conforme, lo resolvemos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-primary">¿Cómo funciona el proceso?</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Desde que nos escribes hasta que tienes tu producto en mano — así de simple.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pasos.map((paso) => (
              <div key={paso.num} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                <span className="inline-block w-12 h-12 rounded-full bg-primary bg-opacity-10 text-primary font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
                  {paso.num}
                </span>
                <h3 className="font-bold text-gray-800 mb-2">{paso.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{paso.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ de contacto */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-primary">Preguntas frecuentes sobre el contacto</h2>
            <p className="text-gray-500 mt-1 text-sm">¿Algo que quieras saber antes de escribirnos?</p>
          </div>
          <div className="divide-y divide-gray-100">
            {faqContacto.map((faq) => (
              <details key={faq.p} className="py-4 group cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-gray-800 list-none">
                  {faq.p}
                  <span className="text-primary text-xl group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <p className="text-gray-500 text-sm leading-relaxed mt-3 pr-6">{faq.r}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <p className="text-gray-500 mb-4">¿Prefieres ver los productos primero?</p>
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold text-sm transition-colors duration-200"
          >
            🛍️ Explorar catálogo completo
          </Link>
        </section>

      </div>
    </div>
  )
}