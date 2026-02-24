import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'

export default function Contacto() {
  useSEO({
    title: 'Contacto',
    description: 'Contacta a VitaGloss RD por WhatsApp para hacer tu pedido de productos Amway. Atención rápida Lun–Sáb 8am–8pm.',
  })
  const [form, setForm] = useState({ nombre: '', telefono: '', producto: '', mensaje: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleWhatsApp = (e) => {
    e.preventDefault()
    const texto = `Hola VitaGloss RD! 👋%0A%0A*Nombre:* ${form.nombre}%0A*Teléfono:* ${form.telefono}%0A*Producto de interés:* ${form.producto}%0A*Mensaje:* ${form.mensaje}`
    window.open(`https://wa.me/18492763532?text=${texto}`, '_blank')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white pt-32 pb-14 px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-2">Contáctanos</h1>
        <p className="text-gray-200 max-w-xl mx-auto">
          Estamos aquí para ayudarte. Escríbenos y te respondemos de inmediato.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Envíanos tu solicitud</h2>
            <form onSubmit={handleWhatsApp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tu nombre *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono / WhatsApp *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Producto de interés</label>
                <select
                  name="producto"
                  value={form.producto}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  <option value="">Selecciona un producto</option>
                  <option value="Pasta Dental Glister">Pasta Dental Glister</option>
                  <option value="Spray Bucal Glister">Spray Bucal Glister</option>
                  <option value="Enjuague Bucal Glister">Enjuague Bucal Glister</option>
                  <option value="Vitamina C Nutrilite">Vitamina C Nutrilite</option>
                  <option value="Varios productos">Varios productos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje adicional</label>
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  rows={4}
                  placeholder="¿Tienes alguna pregunta o necesitas algo específico?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                📲 Enviar por WhatsApp
              </button>
            </form>
          </div>

          {/* Info de contacto */}
          <div className="flex flex-col gap-6">
            <div className="bg-primary text-white rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">Información de contacto</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📲</span>
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <a
                      href="https://wa.me/18492763532"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline"
                    >
                      (849) 276-3532
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold">Ubicación</p>
                    <p className="text-gray-300">República Dominicana</p>
                    <p className="text-gray-400 text-sm">Cobertura a todo el país</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <p className="font-semibold">Horario de atención</p>
                    <p className="text-gray-300">Lunes - Sábado</p>
                    <p className="text-gray-400 text-sm">8:00 AM - 8:00 PM</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h3 className="font-bold text-green-800 mb-2">📲 Respuesta inmediata</h3>
              <p className="text-green-700 text-sm">
                La forma más rápida de comunicarse con nosotros es por WhatsApp.
                Respondemos en minutos y te ayudamos a elegir el producto perfecto para ti.
              </p>
              <a
                href="https://wa.me/18492763532?text=Hola!%20Quiero%20saber%20m%C3%A1s%20sobre%20los%20productos%20de%20VitaGloss%20RD"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200 inline-flex items-center gap-2"
              >
                Abrir WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
