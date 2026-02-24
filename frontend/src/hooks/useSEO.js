import { useEffect } from 'react'

export function useSEO({ title, description }) {
  useEffect(() => {
    // Título
    document.title = title ? `${title} | VitaGloss RD` : 'VitaGloss RD — Tu salud, tu sonrisa'

    // Meta description
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    if (description) meta.setAttribute('content', description)

    // OG tags
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute('content', title || 'VitaGloss RD')

    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (!ogDesc) {
      ogDesc = document.createElement('meta')
      ogDesc.setAttribute('property', 'og:description')
      document.head.appendChild(ogDesc)
    }
    if (description) ogDesc.setAttribute('content', description)
  }, [title, description])
}
