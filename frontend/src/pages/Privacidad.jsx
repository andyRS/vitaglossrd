import { useSEO } from '../hooks/useSEO'

export default function Privacidad() {
  useSEO({
    title: 'Política de Privacidad',
    description: 'Política de privacidad de VitaGloss RD. Cómo recopilamos, usamos y protegemos tu información personal.',
  })

  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-primary mb-2">Política de Privacidad</h1>
        <p className="text-gray-400 text-sm mb-10">Última actualización: enero 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Responsable del tratamiento</h2>
            <p>
              VitaGloss RD es un distribuidor independiente de Amway en República Dominicana. Para contactarnos respecto a tu privacidad, escríbenos por WhatsApp al <strong>(849) 276-3532</strong> o al correo indicado en la sección Contacto.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. Datos que recopilamos</h2>
            <p>Recopilamos únicamente la información que tú nos proporcionas voluntariamente:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Nombre y número de WhatsApp (cuando completas el formulario de contacto o el popup de bienvenida).</li>
              <li>Información del pedido (productos solicitados, dirección de entrega) proporcionada por WhatsApp.</li>
              <li>Datos de navegación anónimos a través de cookies de análisis (Google Analytics / Meta Pixel).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Uso de la información</h2>
            <p>Usamos tus datos para:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Procesar y coordinar tus pedidos.</li>
              <li>Enviarte información relevante sobre productos y ofertas (solo si nos das tu consentimiento).</li>
              <li>Mejorar la experiencia de navegación en nuestro sitio.</li>
              <li>Cumplir con obligaciones legales aplicables en República Dominicana.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Compartición de datos</h2>
            <p>
              No vendemos ni compartimos tu información personal con terceros, salvo con servicios de mensajería (WhatsApp) y plataformas de análisis (Google, Meta) necesarios para operar el sitio. Estos servicios tienen sus propias políticas de privacidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Cookies</h2>
            <p>
              Utilizamos cookies propias y de terceros (Meta Pixel, Google Analytics) para medir el rendimiento del sitio y ofrecerte publicidad relevante. Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. Tus derechos</h2>
            <p>Tienes derecho a:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Acceder a los datos que tenemos sobre ti.</li>
              <li>Solicitar la rectificación o eliminación de tus datos.</li>
              <li>Retirar tu consentimiento en cualquier momento.</li>
            </ul>
            <p className="mt-2">Para ejercer estos derechos, contáctanos por WhatsApp al <strong>(849) 276-3532</strong>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">7. Retención de datos</h2>
            <p>
              Conservamos tus datos personales mientras sean necesarios para la relación comercial y no más de 3 años después de la última interacción, salvo obligación legal en contrario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">8. Cambios a esta política</h2>
            <p>
              Podemos actualizar esta política periódicamente. Te notificaremos de cambios significativos a través de nuestro sitio web. El uso continuado del sitio tras la publicación de cambios implica tu aceptación.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
