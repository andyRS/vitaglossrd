import { useEffect } from 'react'

const SITE_URL = 'https://www.vitaglossrd.com'
const SITE_OG_IMAGE = `${SITE_URL}/og-default.jpg`

// Helper: upsert a <meta> by attribute selector
function setMeta(attrName, attrValue, content) {
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attrName, attrValue)
    document.head.appendChild(el)
  }
  if (content) el.setAttribute('content', content)
}

// Helper: upsert a <link> by rel
function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * useSEO — inyecta todas las señales SEO críticas en el <head>
 * @param {string}   title             — Título de la página (sin sufijo de site)
 * @param {string}   description       — Meta description (120-160 chars ideal)
 * @param {string}   canonical         — URL canónica completa
 * @param {string}   ogImage           — URL absoluta de imagen OG (1200×630)
 * @param {object}   jsonLd            — Un objeto de JSON-LD
 * @param {array}    jsonLdList        — Varios objetos de JSON-LD
 * @param {string}   publishedTime     — ISO date para artículos (og:article:published_time)
 * @param {string}   modifiedTime      — ISO date para artículos (og:article:modified_time)
 * @param {string}   articleAuthor     — Nombre del autor (og:article:author)
 * @param {string[]} articleTags       — Array de tags (og:article:tag)
 * @param {string}   articleSection    — Categoría del artículo
 */
export function useSEO({
  title, description, canonical, ogImage,
  jsonLd, jsonLdList,
  publishedTime, modifiedTime, articleAuthor, articleTags, articleSection,
} = {}) {
  const fullTitle    = title ? `${title} | VitaGloss RD` : 'VitaGloss RD — Tu salud, tu sonrisa'
  const resolvedImg  = ogImage || SITE_OG_IMAGE
  const resolvedUrl  = (canonical || SITE_URL).replace('https://vitaglossrd.com', 'https://www.vitaglossrd.com')
  const isArticle    = canonical && canonical.includes('/blog/')

  useEffect(() => {
    // ── Título ──────────────────────────────────────────────────────────────
    document.title = fullTitle

    // ── Canonical ───────────────────────────────────────────────────────────
    setLink('canonical', resolvedUrl)

    // ── Meta description ────────────────────────────────────────────────────
    if (description) setMeta('name', 'description', description)

    // ── Robots con permisos de fragmentos ricos ──────────────────────────────
    setMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')

    // ── Geo targeting República Dominicana ───────────────────────────────────
    setMeta('name', 'geo.region',    'DO')
    setMeta('name', 'geo.placename', 'República Dominicana')
    setMeta('name', 'geo.position',  '18.7357;-70.1627')
    setMeta('name', 'ICBM',          '18.7357, -70.1627')
    setMeta('http-equiv', 'content-language', 'es-DO')

    // ── Open Graph base ─────────────────────────────────────────────────────
    setMeta('property', 'og:title',       title || 'VitaGloss RD')
    if (description) setMeta('property', 'og:description', description)
    setMeta('property', 'og:url',         resolvedUrl)
    setMeta('property', 'og:image',       resolvedImg)
    setMeta('property', 'og:image:width', '1200')
    setMeta('property', 'og:image:height','630')
    setMeta('property', 'og:image:alt',   title || 'VitaGloss RD')
    setMeta('property', 'og:type',        isArticle ? 'article' : 'website')
    setMeta('property', 'og:locale',      'es_DO')
    setMeta('property', 'og:locale:alternate', 'es_419')
    setMeta('property', 'og:site_name',   'VitaGloss RD')

    // ── Open Graph article (solo en posts de blog) ───────────────────────────
    if (isArticle) {
      if (publishedTime)  setMeta('property', 'article:published_time',  publishedTime)
      if (modifiedTime)   setMeta('property', 'article:modified_time',   modifiedTime)
      if (articleAuthor)  setMeta('property', 'article:author',          articleAuthor)
      if (articleSection) setMeta('property', 'article:section',         articleSection)
      if (articleTags?.length) {
        articleTags.forEach((tag, i) => {
          let el = document.querySelector(`meta[property="article:tag"][data-i="${i}"]`)
          if (!el) {
            el = document.createElement('meta')
            el.setAttribute('property', 'article:tag')
            el.setAttribute('data-i', String(i))
            document.head.appendChild(el)
          }
          el.setAttribute('content', tag)
        })
      }
    }

    // ── Twitter Card ────────────────────────────────────────────────────────
    setMeta('name', 'twitter:card',        'summary_large_image')
    setMeta('name', 'twitter:title',       title || 'VitaGloss RD')
    if (description) setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image',       resolvedImg)
    setMeta('name', 'twitter:image:alt',   title || 'VitaGloss RD')
    setMeta('name', 'twitter:site',        '@VitaGlossRD')
    if (articleAuthor) setMeta('name', 'twitter:creator', '@VitaGlossRD')

    // ── Author (E-E-A-T signal) ─────────────────────────────────────────────
    if (articleAuthor) setMeta('name', 'author', articleAuthor)

  }, [fullTitle, description, resolvedUrl, resolvedImg, publishedTime, modifiedTime, articleAuthor, articleSection])

  // ── JSON-LD structured data ────────────────────────────────────────────────
  useEffect(() => {
    const id = 'vg-jsonld'
    let el = document.getElementById(id)
    const data = jsonLdList || (jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : null)
    if (!data || data.length === 0) {
      if (el) el.remove()
      return
    }
    if (!el) {
      el = document.createElement('script')
      el.id   = id
      el.type = 'application/ld+json'
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(data.length === 1 ? data[0] : data)
    return () => { document.getElementById(id)?.remove() }
  }, [jsonLd, jsonLdList])
}
