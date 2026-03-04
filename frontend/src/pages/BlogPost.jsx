import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { m } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import { getPostBySlug, getPostsRelacionados } from '../data/posts'
import { buildTOC } from '../utils/toc'
import { productos } from '../data/productos'

const SITE_URL = 'https://vitaglossrd.com'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: 'easeOut' },
  }),
}

function formatFecha(isoString) {
  const d = new Date(isoString)
  return d.toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })
}

const catColors = {
  'Salud bucal': { bg: 'bg-teal-100',   text: 'text-teal-700' },
  'Nutrición':   { bg: 'bg-green-100',  text: 'text-green-700' },
  'Productos':   { bg: 'bg-blue-100',   text: 'text-blue-700' },
  'Tips':        { bg: 'bg-orange-100', text: 'text-orange-700' },
  'Bienestar':   { bg: 'bg-purple-100', text: 'text-purple-700' },
}
function catStyle(cat) {
  return catColors[cat] || { bg: 'bg-gray-100', text: 'text-gray-600' }
}

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const post = getPostBySlug(slug)
  const relacionados = post ? getPostsRelacionados(slug) : []
  const productoDestacado = post?.productoRelacionadoId
    ? productos.find(p => p.id === post.productoRelacionadoId)
    : null

  const isYMYL = post && ['Nutrición', 'Suplementos', 'Vitaminas', 'Salud bucal', 'Bienestar'].includes(post.categoria)

  // ── TOC ─────────────────────────────────────────────────────────────────
  const { htmlWithIds, headings } = useMemo(
    () => post ? buildTOC(post.contenido) : { htmlWithIds: '', headings: [] },
    [post]
  )

  // ── SEO ─────────────────────────────────────────────────────────────────
  const canonicalUrl = post ? `${SITE_URL}/blog/${post.slug}` : SITE_URL
  const ogImageUrl   = post ? `${SITE_URL}${post.imagen}` : `${SITE_URL}/og-default.jpg`

  const articleSchema = post ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.titulo,
    description: post.metaDescripcion || post.excerpt,
    datePublished: post.fecha,
    dateModified: post.fechaActualizacion || post.fecha,
    url: canonicalUrl,
    wordCount: post.contenido
      ? post.contenido.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length
      : undefined,
    articleSection: post.categoria,
    inLanguage: 'es-DO',
    keywords: post.tags?.join(', '),
    image: {
      '@type': 'ImageObject',
      url: ogImageUrl,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Person',
      name: 'Andy Rosado',
      url: `${SITE_URL}/sobre-nosotros`,
      jobTitle: 'Distribuidor Independiente Certificado Amway',
      worksFor: { '@type': 'Organization', name: 'VitaGloss RD', url: SITE_URL },
      sameAs: ['https://wa.me/18492763532'],
    },
    publisher: {
      '@type': 'Organization',
      name: 'VitaGloss RD',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logoVitaglossRd.png` },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'DO',
        addressRegion: 'Santo Domingo',
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    locationCreated: {
      '@type': 'Place',
      name: 'República Dominicana',
      address: { '@type': 'PostalAddress', addressCountry: 'DO' },
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.article-excerpt', 'h2'],
    },
  } : null

  const breadcrumbSchema = post ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio',   item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog',     item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.titulo, item: canonicalUrl },
    ],
  } : null

  const faqSchema = post?.faqs?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: faq.respuesta },
    })),
  } : null

  const jsonLdList = [articleSchema, breadcrumbSchema, faqSchema].filter(Boolean)

  useSEO({
    title:          post ? post.titulo : 'Artículo no encontrado',
    description:    post ? (post.metaDescripcion || post.excerpt) : '',
    canonical:      canonicalUrl,
    ogImage:        ogImageUrl,
    jsonLdList,
    publishedTime:  post?.fecha,
    modifiedTime:   post?.fechaActualizacion || post?.fecha,
    articleAuthor:  'Andy Rosado',
    articleTags:    post?.tags,
    articleSection: post?.categoria,
  })

  // Scroll al top en cada navegación
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  // 404 inline
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
        <span className="text-6xl mb-4">📄</span>
        <h1 className="text-2xl font-black text-primary mb-2">Artículo no encontrado</h1>
        <p className="text-gray-500 mb-6">El artículo que buscas ya no existe o cambió de dirección.</p>
        <Link
          to="/blog"
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-900 transition-colors"
        >
          ← Volver al blog
        </Link>
      </div>
    )
  }

  const cs = catStyle(post.categoria)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareWA = `https://wa.me/?text=${encodeURIComponent(`${post.titulo} — VitaGloss RD\n\n${shareUrl}`)}`

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {})
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO ── */}
      <div
        className="relative pt-20 sm:pt-24 pb-10 sm:pb-12 px-4"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#1B3A6B] to-[#0f2a54]" />
        <div className="relative max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link to="/" className="hover:text-white/70 transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-white/70 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/60 truncate max-w-[160px]">{post.titulo}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-end">
            <m.div variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${cs.bg} ${cs.text}`}>
                  {post.categoria}
                </span>
                <span className="text-white/40 text-xs">{formatFecha(post.fecha)}</span>
                <span className="text-white/40 text-xs">·</span>
                <span className="text-white/40 text-xs">⏱ {post.tiempoLectura} de lectura</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
                {post.titulo}
              </h1>

              <p className="text-white/60 text-lg leading-relaxed mb-6">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-3 text-sm text-white/50 flex-wrap">
                <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                  AR
                </div>
                <div>
                  <p className="text-white/80 text-sm font-bold leading-none">Andy Rosado</p>
                  <p className="text-white/40 text-xs mt-0.5">Distribuidor Independiente Certificado Amway · VitaGloss RD</p>
                </div>
              </div>
            </m.div>

            {/* Imagen del producto en el hero — solo si no es cover */}
            {!post.imagenCover && (
              <m.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="hidden lg:flex items-end justify-center pb-2"
              >
                <img
                  src={post.imagen}
                  alt={post.titulo}
                  width="256"
                  height="256"
                  fetchPriority="high"
                  decoding="async"
                  className="w-64 h-64 object-contain drop-shadow-2xl"
                />
              </m.div>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-10 items-start">
          {/* Artículo */}
          <m.article
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="min-w-0"
          >
            {/* Disclaimer médico — solo en categorías YMYL */}
            {isYMYL && (
              <div className="mb-8 flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
                <span className="text-amber-500 text-xl flex-shrink-0 mt-0.5">⚕️</span>
                <p className="text-amber-800 text-xs leading-relaxed">
                  <strong>Aviso médico:</strong> Este artículo tiene fines informativos y educativos únicamente. No constituye consejo médico, diagnóstico ni tratamiento. Consulta siempre a un profesional de la salud antes de iniciar, modificar o suspender cualquier suplementación o tratamiento.
                </p>
              </div>
            )}
            {/* ── Tabla de Contenido (mobile) ── */}
            {headings.length >= 3 && (
              <nav aria-label="Tabla de contenido" className="mb-8 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">📋 En este artículo</p>
                <ol className="space-y-1.5">
                  {headings.filter(h => h.level === 2).map((h, i) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="text-sm text-blue-700 hover:text-blue-900 hover:underline leading-snug block"
                      >
                        {i + 1}. {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <div
              className="prose-custom"
              dangerouslySetInnerHTML={{ __html: htmlWithIds }}
            />
          </m.article>

          {/* Sidebar sticky */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {/* Compartir */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Compartir</p>
                <a
                  href={shareWA}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Compartir este artículo en WhatsApp"
                  className="flex items-center gap-2 bg-[#25D366] hover:bg-green-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors mb-2"
                >
                  📲 Compartir en WhatsApp
                </a>
                <button
                  onClick={copyLink}
                  aria-label="Copiar enlace del artículo"
                  className="w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
                >
                  🔗 Copiar enlace
                </button>
              </div>

              {/* TOC Sidebar */}
              {headings.length >= 3 && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">📋 Contenido</p>
                  <nav aria-label="Tabla de contenido">
                  <ol className="space-y-2">
                    {headings.filter(h => h.level === 2).map((h, i) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className="text-xs text-blue-700 hover:text-blue-900 hover:underline leading-snug block"
                        >
                          {i + 1}. {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                  </nav>
                </div>
              )}

              {/* Tags */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Etiquetas</p>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-white border border-gray-200 text-gray-500 text-xs px-2.5 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA lateral */}
              <div className="bg-gradient-to-br from-[#0a1628] to-[#1B3A6B] rounded-2xl p-5 text-center">
                <div className="text-2xl mb-2">💬</div>
                <p className="text-white font-bold text-sm mb-1">¿Tienes dudas?</p>
                <p className="text-white/50 text-xs mb-3">Te respondemos en minutos</p>
                <a
                  href="https://wa.me/18492763532?text=Hola!%20Le%C3%AD%20un%20art%C3%ADculo%20del%20blog%20y%20tengo%20preguntas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#25D366] hover:bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                >
                  Escribir por WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* CTA mobile compartir */}
        <div className="lg:hidden mt-8 flex gap-3">
          <a
            href={shareWA}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-green-500 text-white text-sm font-bold py-3 rounded-2xl transition-colors"
          >
            📲 Compartir
          </a>
          <button
            onClick={copyLink}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-2xl transition-colors"
          >
            🔗 Copiar enlace
          </button>
        </div>

        {/* Tags mobile */}
        <div className="lg:hidden mt-6 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── PRODUCTO DESTACADO DEL ARTÍCULO ── */}
      {productoDestacado && (
        <section className="py-10 px-4 bg-gradient-to-br from-[#f0fdf9] to-[#e8f8f5] border-t border-teal-100">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-4">Producto mencionado en este artículo</p>
            <m.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl border border-teal-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-5 p-5">
                <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
                  <img
                    src={productoDestacado.imagen}
                    alt={productoDestacado.nombre}
                    className="w-16 h-16 object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{productoDestacado.categoria}</p>
                  <h4 className="font-black text-primary text-base leading-snug mb-1 truncate">{productoDestacado.nombre}</h4>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xl font-black text-gray-900">RD${productoDestacado.precio.toLocaleString('es-DO')}</span>
                    {productoDestacado.precioOriginal && productoDestacado.precioOriginal > productoDestacado.precio && (
                      <span className="text-sm text-gray-400 line-through">RD${productoDestacado.precioOriginal.toLocaleString('es-DO')}</span>
                    )}
                  </div>
                  {productoDestacado.ventasSemana && (
                    <p className="text-[11px] text-green-600 font-semibold">✓ {productoDestacado.ventasSemana} personas compraron esta semana</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <a
                    href={`https://wa.me/18492763532?text=${encodeURIComponent(`Hola VitaGloss RD! 👋 Leí el artículo y quiero pedir: ${productoDestacado.nombre} (RD$${productoDestacado.precio.toLocaleString('es-DO')}). ¿Cómo lo proceso?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20b858] text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all hover:scale-105 whitespace-nowrap"
                  >
                    <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.106.55 4.083 1.512 5.802L0 24l6.363-1.487A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.001-1.368l-.36-.214-3.777.883.896-3.69-.234-.38A9.79 9.79 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.429 0 9.818 4.388 9.818 9.818 0 5.429-4.389 9.818-9.818 9.818z"/>
                    </svg>
                    Pedirlo
                  </a>
                  <Link
                    to={`/producto/${productoDestacado.id}`}
                    className="text-center text-primary text-xs font-semibold hover:underline"
                  >
                    Ver detalle →
                  </Link>
                </div>
              </div>
            </m.div>
          </div>
        </section>
      )}

      {/* ── CTA BAND ── */}
      <section className="bg-gradient-to-r from-[#2EC4B6] to-teal-500 py-12 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="flex-1">
            <h3 className="text-white font-black text-xl mb-1">¿Listo para dar el siguiente paso?</h3>
            <p className="text-white/80 text-sm">Consulta gratis. Sin compromiso. Respuesta inmediata.</p>
          </div>
          <a
            href="https://wa.me/18492763532?text=Hola!%20Le%C3%AD%20el%20blog%20y%20quiero%20saber%20m%C3%A1s%20sobre%20los%20productos"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-white text-teal-700 font-black px-7 py-3.5 rounded-2xl hover:bg-teal-50 transition-all hover:scale-105 shadow-lg text-sm"
          >
            💬 Hablar con un especialista
          </a>
        </div>
      </section>

      {/* ── ARTÍCULOS RELACIONADOS ── */}
      {relacionados.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-black text-primary mb-8">Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relacionados.map((rel, i) => {
                const rcs = catStyle(rel.categoria)
                return (
                  <m.div
                    key={rel.id}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                  >
                    <Link
                      to={`/blog/${rel.slug}`}
                      className="group flex flex-col bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full"
                    >
                      <div className="bg-gradient-to-br from-[#0a1628] to-[#1B3A6B] h-36 flex items-center justify-center relative overflow-hidden">
                        {rel.imagenCover ? (
                          <img
                            src={rel.imagen}
                            alt={rel.titulo}
                            width="320"
                            height="144"
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <img
                            src={rel.imagen}
                            alt={rel.titulo}
                            width="96"
                            height="96"
                            loading="lazy"
                            decoding="async"
                            className="h-24 w-24 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute top-2 left-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${rcs.bg} ${rcs.text}`}>
                            {rel.categoria}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-xs text-gray-400 mb-2">{rel.tiempoLectura} de lectura</p>
                        <h4 className="font-black text-primary text-sm leading-snug mb-2 group-hover:text-secondary transition-colors line-clamp-2 flex-1">
                          {rel.titulo}
                        </h4>
                        <span className="text-secondary text-xs font-bold flex items-center gap-1">
                          Leer artículo →
                        </span>
                      </div>
                    </Link>
                  </m.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── VOLVER ── */}
      <div className="bg-gray-50 border-t border-gray-100 py-8 px-4 text-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors text-sm"
        >
          ← Volver a todos los artículos
        </Link>
      </div>
    </div>
  )
}
