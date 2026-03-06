import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import { posts, categorias } from '../data/posts'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
}

function formatFecha(isoString) {
  const d = new Date(isoString)
  return d.toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Colores por categoría
const catColors = {
  'Salud bucal':  { bg: 'bg-teal-100',   text: 'text-teal-700',   dot: 'bg-teal-400' },
  'Nutrición':    { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-400' },
  'Productos':    { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-400' },
  'Tips':         { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-400' },
  'Bienestar':    { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-400' },
  'Suplementos':  { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-400' },
}
function catStyle(cat) {
  return catColors[cat] || { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
}

export default function Blog() {
  useSEO({
    title:       'Blog — Salud, Nutrición y Bienestar en República Dominicana',
    description: 'Artículos sobre salud bucal, nutrición, vitaminas y bienestar para República Dominicana. Consejos basados en ciencia de los especialistas de VitaGloss RD.',
    canonical:   'https://vitaglossrd.com/blog',
    ogImage:     'https://vitaglossrd.com/logoVitaglossRd.png',
    ogImageAlt:  'Blog de salud y nutrición — VitaGloss RD',
    jsonLdList: [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Blog VitaGloss RD',
        description: 'Artículos sobre salud bucal, nutrición, vitaminas y bienestar para República Dominicana.',
        url: 'https://vitaglossrd.com/blog',
        inLanguage: 'es-DO',
        publisher: {
          '@type': 'Organization',
          name: 'VitaGloss RD',
          url: 'https://vitaglossrd.com',
          logo: { '@type': 'ImageObject', url: 'https://vitaglossrd.com/logoVitaglossRd.png' },
          address: { '@type': 'PostalAddress', addressCountry: 'DO', addressRegion: 'Santo Domingo' },
        },
        blogPost: posts.slice(0, 10).map(p => ({
          '@type': 'BlogPosting',
          headline: p.titulo,
          url: `https://vitaglossrd.com/blog/${p.slug}`,
          datePublished: p.fecha,
          dateModified: p.fechaActualizacion || p.fecha,
          description: p.metaDescripcion || p.excerpt,
          keywords: p.tags?.join(', '),
          author: { '@type': 'Person', name: 'Andy Rosado' },
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Artículos del Blog — VitaGloss RD',
        description: 'Lista de artículos sobre salud y bienestar en República Dominicana.',
        url: 'https://vitaglossrd.com/blog',
        numberOfItems: posts.length,
        itemListElement: posts.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://vitaglossrd.com/blog/${p.slug}`,
          name: p.titulo,
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://vitaglossrd.com' },
          { '@type': 'ListItem', position: 2, name: 'Blog',   item: 'https://vitaglossrd.com/blog' },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Artículos de salud y bienestar — VitaGloss RD',
        description: 'Lista completa de artículos sobre nutrición, salud bucal y bienestar en República Dominicana.',
        url: 'https://vitaglossrd.com/blog',
        numberOfItems: posts.length,
        itemListElement: posts.slice(0, 20).map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://vitaglossrd.com/blog/${p.slug}`,
          name: p.titulo,
        })),
      },
    ],
  })

  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')

  const postsFiltrados = useMemo(() => {
    return posts.filter(p => {
      const matchCat = categoriaActiva === 'Todas' || p.categoria === categoriaActiva
      const q = busqueda.toLowerCase()
      const matchQ =
        !q ||
        p.titulo.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      return matchCat && matchQ
    })
  }, [categoriaActiva, busqueda])

  const postDestacado = postsFiltrados[0]
  const postsGrid = postsFiltrados.slice(1)

  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#1B3A6B] to-[#0f2a54] pt-20 sm:pt-28 pb-12 sm:pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <m.div variants={fadeUp} initial="hidden" animate="visible">
            <span className="inline-block bg-secondary/20 text-secondary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-5 border border-secondary/30">
              📚 Blog VitaGloss RD
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Salud, nutrición y bienestar<br />
              <span className="text-secondary">para República Dominicana</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto mb-8">
              Artículos basados en ciencia, sin relleno ni marketing vacío. Aprende a cuidar tu salud con información real.
            </p>

            {/* Búsqueda */}
            <div className="max-w-md mx-auto relative" role="search">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm" aria-hidden="true">🔍</span>
              <input
                type="search"
                aria-label="Buscar artículos del blog"
                placeholder="Buscar artículos…"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full bg-white/10 border border-white/20 focus:border-secondary/60 text-white placeholder-white/30 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
          </m.div>
        </div>
      </section>

      {/* ── FILTROS ── */}
      <div className="sticky top-16 sm:top-[72px] z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide" role="group" aria-label="Filtrar por categoría">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              aria-pressed={categoriaActiva === cat}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                categoriaActiva === cat
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {postsFiltrados.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-gray-400 text-lg font-medium">No encontramos artículos con esa búsqueda.</p>
            <button
              onClick={() => { setBusqueda(''); setCategoriaActiva('Todas') }}
              className="mt-4 text-secondary font-semibold text-sm hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            {/* ── POST DESTACADO ── */}
            {postDestacado && (
              <m.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-8"
              >
                <Link
                  to={`/blog/${postDestacado.slug}`}
                  className="group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Imagen */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#1B3A6B] min-h-[220px] lg:min-h-[360px] flex items-center justify-center">
                    {postDestacado.imagenCover ? (
                      <img
                        src={postDestacado.imagen}
                        alt={postDestacado.titulo}
                        width="600"
                        height="360"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <img
                        src={postDestacado.imagen}
                        alt={postDestacado.titulo}
                        width="256"
                        height="256"
                        loading="lazy"
                        decoding="async"
                        className="w-48 h-48 lg:w-64 lg:h-64 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${catStyle(postDestacado.categoria).bg} ${catStyle(postDestacado.categoria).text}`}>
                        {postDestacado.categoria}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
                      ✨ Destacado
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                      <span>{formatFecha(postDestacado.fecha)}</span>
                      <span>·</span>
                      <span>⏱ {postDestacado.tiempoLectura} de lectura</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black text-primary mb-3 leading-tight group-hover:text-secondary transition-colors">
                      {postDestacado.titulo}
                    </h2>
                    <p className="text-gray-500 leading-relaxed mb-6 line-clamp-3">
                      {postDestacado.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {postDestacado.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-2 text-secondary font-bold text-sm group-hover:gap-3 transition-all">
                      Leer artículo completo <span>→</span>
                    </span>
                  </div>
                </Link>
              </m.div>
            )}

            {/* ── GRID DE POSTS ── */}
            {postsGrid.length > 0 && (
              <>
              {postDestacado && (
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Más artículos</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {postsGrid.map((post, i) => {
                  const cs = catStyle(post.categoria)
                  return (
                    <m.div
                      key={post.id}
                      variants={fadeUp}
                      initial={i < 3 ? 'visible' : 'hidden'}
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={i < 3 ? 0 : i - 2}
                    >
                      <Link
                        to={`/blog/${post.slug}`}
                        className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
                      >
                        {/* Imagen */}
                        <div className="relative bg-gradient-to-br from-[#0a1628] to-[#1B3A6B] h-56 flex items-center justify-center overflow-hidden">
                          {post.imagenCover ? (
                            <img
                              src={post.imagen}
                              alt={post.titulo}
                              width="400"
                              height="224"
                              loading="lazy"
                              decoding="async"
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <img
                              src={post.imagen}
                              alt={post.titulo}
                              width="176"
                              height="176"
                              loading="lazy"
                              decoding="async"
                              className="h-44 w-44 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                            />
                          )}
                          <div className="absolute top-3 left-3">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cs.bg} ${cs.text}`}>
                              {post.categoria}
                            </span>
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                            <span>{formatFecha(post.fecha)}</span>
                            <span>·</span>
                            <span>{post.tiempoLectura}</span>
                          </div>
                          <h3 className="font-black text-primary text-base leading-snug mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                            {post.titulo}
                          </h3>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-3">
                            {post.excerpt}
                          </p>
                          {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {post.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="bg-gray-100 text-gray-400 text-xs px-2.5 py-0.5 rounded-full">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex-1" />
                          <span className="text-secondary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                            Leer más <span>→</span>
                          </span>
                        </div>
                      </Link>
                    </m.div>
                  )
                })}
              </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ── CTA BOTTOM ── */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-3xl block mb-4">💬</span>
          <h2 className="text-2xl font-black text-primary mb-3">¿Tienes preguntas sobre tu salud?</h2>
          <p className="text-gray-500 mb-6">
            Escríbenos por WhatsApp. Te respondemos con información real, sin venderte lo que no necesitas.
          </p>
          <a
            href="https://wa.me/18492763532?text=Hola!%20Le%C3%AD%20el%20blog%20de%20VitaGloss%20RD%20y%20tengo%20una%20pregunta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-green-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-green-200"
          >
            💬 Consultar por WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
