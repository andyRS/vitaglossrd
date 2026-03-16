import { useSEO } from '../hooks/useSEO'

export default function Devoluciones() {
  useSEO({
    title: 'Política de Devoluciones',
    description: 'Política de devoluciones de VitaGloss RD. Aceptamos devoluciones de productos defectuosos. Conoce nuestro proceso y condiciones.',
    canonical: 'https://www.vitaglossrd.com/devoluciones',
  })

  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-primary mb-2">Política de Devoluciones</h1>
        <p className="text-gray-400 text-sm mb-10">Última actualización: marzo 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Compromiso de satisfacción</h2>
            <p>
              En VitaGloss RD, distribuidor independiente de Amway en República Dominicana, queremos que estés 100% satisfecho con tu compra. Si por alguna razón no estás conforme con los productos recibidos, puedes solicitar una devolución o cambio dentro de los plazos indicados a continuación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. Plazo de devolución</h2>
            <p>
              Aceptamos devoluciones dentro de los <strong>30 días calendario</strong> siguientes a la fecha de entrega, exclusivamente para productos que presenten defectos de fabricación o daños al momento de la recepción.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Condiciones para la devolución</h2>
            <p>Para que la devolución sea aceptada, el producto debe cumplir las siguientes condiciones:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Presentar un defecto de fabricación comprobable o daño recibido al momento de la entrega.</li>
              <li>Estar dentro del plazo de 30 días desde la entrega.</li>
              <li>Presentar el comprobante de compra o número de pedido.</li>
              <li>El empaque original debe estar disponible (cuando aplique).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Productos defectuosos</h2>
            <p>
              Si recibiste un producto defectuoso, dañado o diferente al solicitado, contáctanos de inmediato por WhatsApp al <strong>(849) 276-3532</strong>. Organizaremos la recogida del producto sin costo para ti y te enviaremos un reemplazo o emitiremos un reembolso completo según tu preferencia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Gastos de devolución</h2>
            <p>
              Los gastos de envío para devoluciones son <strong>gratuitos</strong> cuando el motivo es:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Producto defectuoso o dañado al recibirlo.</li>
              <li>Producto erróneo enviado por nuestra parte.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. Proceso de devolución</h2>
            <ol className="list-decimal pl-6 mt-2 space-y-2">
              <li>Contáctanos por WhatsApp al <strong>(849) 276-3532</strong> indicando el número de pedido y el motivo de la devolución.</li>
              <li>Te indicaremos cómo enviar el producto (mensajería o entrega directa según tu ubicación).</li>
              <li>Una vez recibido y verificado el producto, procesaremos el reembolso o cambio en un plazo de <strong>3 a 5 días hábiles</strong>.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">7. Cambios de producto</h2>
            <p>
              También aceptamos cambios de producto dentro del plazo de 30 días. Si deseas cambiar un producto por otro de igual o diferente valor, contáctanos y gestionaremos el cambio de forma rápida y sencilla.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">8. Reembolsos</h2>
            <p>
              Los reembolsos se realizan por el mismo medio de pago utilizado en la compra original. En caso de pago en efectivo, se realizará transferencia bancaria o pago móvil a la cuenta indicada por el cliente. Los reembolsos se procesan en un máximo de <strong>5 días hábiles</strong> tras la aprobación de la devolución.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">9. Excepciones</h2>
            <p>No se aceptan devoluciones en los siguientes casos:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Productos en buen estado sin defecto comprobado (cambio de opinión o insatisfacción general).</li>
              <li>Productos devueltos fuera del plazo de 30 días.</li>
              <li>Productos dañados por mal uso o almacenamiento inadecuado por parte del cliente.</li>
              <li>Productos consumibles con más del 30% de uso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">10. Contacto</h2>
            <p>
              Para cualquier consulta sobre devoluciones, escríbenos por WhatsApp al <strong>(849) 276-3532</strong> o visita nuestra sección de{' '}
              <a href="/contacto" className="text-secondary hover:underline">Contacto</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
