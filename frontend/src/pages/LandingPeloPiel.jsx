/**
 * Landing Page — Pelo Piel y Uñas Nutrilite
 * Diseñada para convertir tráfico de redes sociales en pedidos por WhatsApp.
 * Sin navbar, sin footer — una sola acción: abrir WhatsApp.
 */
import { useEffect } from 'react'

const WA_NUMBER  = '18492763532'
const WA_MESSAGE = encodeURIComponent('¡Hola! Vi el anuncio de Pelo Piel y Uñas Nutrilite y quiero más información 💇‍♀️')
const WA_URL     = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`

const TESTIMONIALS = [
  { nombre: 'Mariela R.', ciudad: 'Santo Domingo', texto: 'En 3 semanas noté mi cabello más fuerte. ¡Se me cayó mucho menos!', estrellas: 5 },
  { nombre: 'Yolanda P.', ciudad: 'Santiago',      texto: 'Mi piel se ve más luminosa y las uñas ya no se me quiebran. Lo recomiendo.', estrellas: 5 },
  { nombre: 'Carmen L.', ciudad: 'La Vega',        texto: 'Llevaba años buscando algo que funcionara para mi cabello. Esto es lo mejor.', estrellas: 5 },
]

function Estrella() {
  return (
    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function CTAButton({ texto = '📲 Pedir por WhatsApp ahora', size = 'lg' }) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-2xl bg-green-500 hover:bg-green-600 active:scale-95 text-white shadow-lg shadow-green-500/40 transition-all duration-200'
  const sizes = { lg: 'w-full py-5 text-xl', sm: 'px-8 py-4 text-lg' }
  return (
    <a href={WA_URL} target="_blank" rel="noopener noreferrer"
      className={`${base} ${sizes[size]}`}
      onClick={() => {
        if (typeof window !== 'undefined' && window.fbq) window.fbq('track', 'Contact')
      }}
    >
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      {texto}
    </a>
  )
}

export default function LandingPeloPiel() {
  useEffect(() => {
    document.title = 'Pelo Piel y Uñas Nutrilite — VitaGloss RD'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'Suplemento de biotina, zinc y colágeno para cabello que se cae, piel opaca y uñas frágiles. Distribuidores certificados Amway en República Dominicana. Envío a domicilio.')
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── BARRA SUPERIOR ─────────────────────────────────────────────── */}
      <div className="bg-green-600 text-white text-center py-2 text-sm font-medium">
        🇩🇴 Envíos a todo el país · Santo Domingo: pago contra entrega
      </div>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-pink-50 via-white to-purple-50 px-5 pt-10 pb-12">
        <div className="max-w-lg mx-auto text-center">

          {/* Badge */}
          <span className="inline-block bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Distribuidores Certificados Amway 🏅
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            ¿Se te cae el cabello<br/>
            <span className="text-pink-600">o está sin vida?</span>
          </h1>

          <p className="text-gray-600 text-lg mb-6">
            <strong>Pelo Piel y Uñas Nutrilite™</strong> combina biotina, zinc y colágeno para fortalecer tu cabello desde la raíz, mejorar la piel y endurecer las uñas — <strong>desde adentro.</strong>
          </p>

          {/* Imagen producto */}
          <div className="relative mb-6">
            <img
              src="/pelo-piel-unas.webp"
              alt="Pelo Piel y Uñas Nutrilite"
              className="w-56 h-56 object-contain mx-auto drop-shadow-2xl"
              loading="eager"
            />
            <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
              RD$1,700
            </div>
          </div>

          {/* Precio y estrellas */}
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Estrella key={i} />)}
            <span className="text-sm text-gray-500 ml-1">4.9 · +120 reseñas</span>
          </div>

          <div className="mb-8">
            <CTAButton />
          </div>

          <p className="text-xs text-gray-400">Sin compromisos · Respuesta inmediata</p>
        </div>
      </section>

      {/* ── PROBLEMA / SOLUCIÓN ─────────────────────────────────────────── */}
      <section className="bg-white px-5 py-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            ¿Te identificas con alguno de estos?
          </h2>

          <div className="space-y-3 mb-10">
            {[
              '😔 El cabello se me cae más de lo normal',
              '💔 El cabello está opaco, sin brillo ni fuerza',
              '😟 Las uñas se quiebran o pelan con facilidad',
              '😞 La piel se ve apagada y sin vida',
              '🤔 Ya probé shampoos y cremas sin resultado',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                <span className="text-lg leading-none mt-0.5">{text.split(' ')[0]}</span>
                <span className="text-gray-700 text-sm">{text.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6 text-center">
            <p className="text-pink-800 font-bold text-lg mb-2">La solución es desde adentro 💊</p>
            <p className="text-gray-600 text-sm">Los shampoos y cremas solo actúan en la superficie. <strong>Pelo Piel y Uñas Nutrilite™</strong> le da a tu cuerpo los nutrientes que necesita para generar cabello, piel y uñas saludables de raíz.</p>
          </div>
        </div>
      </section>

      {/* ── INGREDIENTES ────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 px-5 py-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Qué tiene adentro
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8">Ingredientes con respaldo científico de Nutrilite™</p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '💪', nombre: 'Biotina', beneficio: 'Fortalece el cabello y reduce la caída' },
              { icon: '🔩', nombre: 'Zinc',    beneficio: 'Apoya el crecimiento capilar y la salud de la piel' },
              { icon: '✨', nombre: 'Colágeno', beneficio: 'Mejora la elasticidad de la piel y las uñas' },
              { icon: '🍊', nombre: 'Vitamina C', beneficio: 'Antioxidante, activa la producción de colágeno' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-bold text-gray-800 text-sm mb-1">{item.nombre}</div>
                <div className="text-gray-500 text-xs leading-snug">{item.beneficio}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTADOS ──────────────────────────────────────────────────── */}
      <section className="bg-white px-5 py-12">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¿Cuándo ves resultados?</h2>
          <p className="text-gray-500 text-sm mb-8">Es un suplemento natural — los cambios son progresivos y duraderos</p>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-pink-200 -translate-x-1/2" />
            <div className="space-y-6">
              {[
                { semana: 'Semana 1–2', texto: 'Las uñas dejan de quebrarse. La piel se empieza a ver más hidratada.' },
                { semana: 'Semana 3–4', texto: 'Menos cabello en el cepillo. El cuero cabelludo se siente más saludable.' },
                { semana: 'Semana 6–8', texto: 'Cabello más brillante y con más cuerpo. Piel luminosa visible.' },
              ].map((step, i) => (
                <div key={i} className={`relative flex gap-4 items-start ${i % 2 === 0 ? 'pr-[calc(50%+1rem)]' : 'pl-[calc(50%+1rem)] flex-row-reverse'}`}>
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-pink-500 border-2 border-white shadow" />
                  <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 flex-1 text-left">
                    <div className="font-bold text-pink-700 text-xs mb-1">{step.semana}</div>
                    <div className="text-gray-700 text-sm">{step.texto}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 px-5 py-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Lo que dicen nuestras clientas</h2>
          <div className="space-y-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.estrellas)].map((_, j) => <Estrella key={j} />)}
                </div>
                <p className="text-gray-700 text-sm italic mb-3">"{t.texto}"</p>
                <div className="text-xs text-gray-400 font-medium">{t.nombre} · {t.ciudad}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GARANTÍA ────────────────────────────────────────────────────── */}
      <section className="bg-white px-5 py-10">
        <div className="max-w-lg mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="font-bold text-green-800 text-lg mb-2">Garantía de satisfacción Amway</h3>
            <p className="text-gray-600 text-sm">Somos distribuidores certificados de Amway. Si no estás satisfecho con tu compra, tienes 30 días para devolverlo sin preguntas.</p>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-pink-600 to-purple-600 px-5 py-14">
        <div className="max-w-lg mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-3">¿Lista para probarlo?</h2>
          <p className="text-pink-100 mb-2 text-lg">Solo <strong className="text-white">RD$1,700</strong> — envío a todo el país</p>
          <p className="text-pink-200 text-sm mb-8">Santo Domingo: pagas cuando lo recibes en mano 🛵</p>
          <CTAButton texto="📲 Pedir por WhatsApp" />
          <p className="mt-4 text-pink-200 text-xs">Respuesta en minutos · Lunes a domingo</p>
        </div>
      </section>

      {/* ── FOOTER MÍNIMO ───────────────────────────────────────────────── */}
      <div className="bg-gray-900 text-gray-500 text-center py-5 text-xs px-4">
        © 2026 VitaGloss RD — Distribuidores certificados Amway en República Dominicana ·{' '}
        <a href="/privacidad" className="underline hover:text-gray-300">Privacidad</a>
      </div>
    </div>
  )
}
