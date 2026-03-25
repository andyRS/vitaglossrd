import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'

export default function PoliticaEditorial() {
  useSEO({
    title: 'Política Editorial — VitaGloss RD',
    description: 'Cómo creamos nuestro contenido: estándares editoriales, proceso de revisión, divulgación de afiliados y criterios de calidad del blog VitaGloss RD.',
    canonical: 'https://www.vitaglossrd.com/politica-editorial',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Política Editorial — VitaGloss RD',
      url: 'https://www.vitaglossrd.com/politica-editorial',
      description: 'Estándares editoriales, divulgación de afiliados y criterios de calidad del blog de VitaGloss RD.',
      publisher: {
        '@type': 'Organization',
        name: 'VitaGloss RD',
        url: 'https://www.vitaglossrd.com',
        logo: { '@type': 'ImageObject', url: 'https://www.vitaglossrd.com/logoVitaglossRd.png' },
      },
    },
  })

  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-primary mb-2">Política Editorial</h1>
        <p className="text-gray-400 text-sm mb-10">Última actualización: enero 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">

          {/* Divulgación destacada */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h2 className="text-lg font-bold text-amber-800 mb-2">⚠️ Divulgación importante</h2>
            <p className="text-amber-700 text-sm leading-relaxed">
              VitaGloss RD es un distribuidor independiente de productos Amway en República Dominicana.
              Los artículos de este blog pueden mencionar y recomendar productos que vendemos directamente.
              Cuando haces una compra a través de nuestro sitio, recibimos una compensación económica.
              Este hecho no afecta la veracidad de la información presentada, pero es importante que
              lo conozcas para evaluar el contenido con criterio propio.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Misión editorial</h2>
            <p>
              El blog de VitaGloss RD tiene como objetivo proporcionar información clara, basada en evidencia
              científica y adaptada a la realidad de República Dominicana sobre salud bucal, nutrición,
              suplementos y bienestar general. Nuestro contenido está dirigido a personas que quieren
              tomar decisiones informadas sobre su salud, independientemente de si compran nuestros
              productos o no.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. Autoría y credenciales</h2>
            <p>
              Los artículos son escritos por <strong>Andy Rosado</strong>, distribuidor independiente
              certificado de Amway en República Dominicana desde 2021. Andy tiene formación continua
              en nutrición deportiva y suplementación a través de los programas de educación de Amway
              Global, y ha completado el programa de certificación en Nutrición Básica de Nutrilite™.
              Complementa su formación con lectura regular de publicaciones científicas en PubMed,
              NIH y journals de odontología como el <em>Journal of Clinical Periodontology</em>.
            </p>
            <p className="mt-3">
              Como distribuidor activo, Andy utiliza personalmente todos los productos que revisa,
              los ha probado con cientos de clientes en República Dominicana desde 2021, y tiene
              acceso a la documentación técnica interna y estudios clínicos de Amway/Nutrilite.
              Toda afirmación sobre eficacia se verifica contra la literatura científica disponible
              antes de publicarse.
            </p>
            <p className="mt-3">
              Los artículos relacionados con salud (categorías Nutrición, Suplementos, Salud bucal y
              Bienestar) son considerados contenido YMYL (Your Money or Your Life) bajo los lineamientos
              de Google Search Quality Rater Guidelines. Por eso incluimos en cada artículo un
              aviso médico explícito y citamos las fuentes científicas en las que basamos nuestras
              afirmaciones. Para temas de alta complejidad clínica, consultamos con profesionales
              de la salud antes de publicar.
            </p>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota sobre contenido nutricional y dental:</strong> Los artículos de este
                blog no sustituyen la consulta con un médico, nutricionista o dentista titulado.
                La información es de carácter educativo. Siempre consulta a un profesional de la
                salud antes de iniciar cualquier suplementación o cambiar tu rutina de salud bucal.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Proceso de creación de contenido</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong>Investigación previa:</strong> Antes de escribir, revisamos fuentes científicas
                disponibles (PubMed, NIH, EFSA), datos oficiales del fabricante y estudios independientes.
              </li>
              <li>
                <strong>Redacción honesta:</strong> Presentamos tanto los beneficios como las limitaciones
                de los productos y tratamientos descritos. No ocultamos información negativa relevante.
              </li>
              <li>
                <strong>Revisión de hechos:</strong> Las afirmaciones sobre eficacia de suplementos y
                productos dentales se verifican contra la literatura científica disponible.
              </li>
              <li>
                <strong>Actualizaciones periódicas:</strong> Los artículos se revisan y actualizan
                cuando la evidencia científica o la disponibilidad de productos cambia.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Divulgación de afiliados y conflicto de interés</h2>
            <p>
              En cumplimiento con las mejores prácticas de transparencia editorial y los lineamientos
              de la <em>Federal Trade Commission (FTC)</em> y plataformas publicitarias digitales:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                VitaGloss RD es distribuidor independiente de Amway. Recibimos compensación económica
                cuando se realizan compras de productos Amway/Nutrilite/Glister™ a través de nuestro sitio.
              </li>
              <li>
                Los artículos del blog pueden promover, recomendar o comparar favorablemente productos
                que vendemos. Esta relación comercial siempre existirá, y la divulgamos aquí y en
                cada artículo relevante.
              </li>
              <li>
                También hacemos comparaciones con productos de otras marcas disponibles en el mercado
                dominicano. En esos casos, presentamos la información de la manera más objetiva posible.
              </li>
              <li>
                No aceptamos artículos patrocinados de terceros ni pagamos para recibir menciones
                positivas en otros sitios.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Fuentes y referencias</h2>
            <p>
              El contenido informativo se basa en las siguientes tipos de fuentes:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Publicaciones en PubMed / NIH sobre nutrición, suplementos y salud bucal</li>
              <li>Fichas técnicas y documentación oficial de Amway/Nutrilite</li>
              <li>Recomendaciones de la Organización Mundial de la Salud (OMS/WHO)</li>
              <li>Guías de la Asociación Dental Americana (ADA)</li>
              <li>Estudios de EFSA (Autoridad Europea de Seguridad Alimentaria)</li>
              <li>Datos del Ministerio de Salud Pública de República Dominicana</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. Limitaciones del contenido</h2>
            <p>
              El contenido del blog de VitaGloss RD es de carácter informativo y educativo únicamente.
              <strong> No constituye consejo médico, diagnóstico ni tratamiento.</strong> Siempre consulta
              con un profesional de la salud antes de iniciar cualquier suplementación o cambiar tu
              rutina de higiene bucal, especialmente si tienes condiciones médicas preexistentes o
              tomas medicamentos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">7. Correcciones y actualización</h2>
            <p>
              Si detectas un error factual en alguno de nuestros artículos, te pedimos que nos lo
              comuniques escribiéndonos por WhatsApp al <strong>(849) 276-3532</strong> o al correo
              vitaglossrd@gmail.com. Revisamos los reportes y, si se confirma el error, actualizamos
              el artículo y anotamos la corrección.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">8. Contacto editorial</h2>
            <p>
              Para preguntas sobre nuestra política editorial, contacta a Andy Rosado directamente:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>WhatsApp: <strong>(849) 276-3532</strong></li>
              <li>Correo: vitaglossrd@gmail.com</li>
              <li>
                <Link to="/contacto" className="text-primary font-medium hover:underline">
                  Formulario de contacto
                </Link>
              </li>
            </ul>
          </section>

          <div className="border-t border-gray-100 pt-6 text-xs text-gray-400">
            <p>
              Esta política editorial está inspirada en las mejores prácticas de transparencia para
              publicaciones digitales y cumple con los lineamientos de contenido de Google AdSense y
              las directrices de calidad de búsqueda de Google (Search Quality Rater Guidelines).
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
