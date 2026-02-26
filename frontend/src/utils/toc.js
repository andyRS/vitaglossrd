/**
 * toc.js — Tabla de Contenido automática
 * Extrae H2/H3 del HTML del artículo, inyecta IDs en los headings,
 * y devuelve la lista de ítems para renderizar el TOC.
 */

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

/** Quita etiquetas HTML internas para obtener texto puro */
const stripTags = (html) => html.replace(/<[^>]+>/g, '')

/**
 * Parsea el HTML del contenido, agrega IDs únicos a cada h2/h3
 * y devuelve el HTML modificado + la lista para el TOC.
 *
 * @param {string} html — contenido del artículo
 * @returns {{ htmlWithIds: string, headings: Array<{id, text, level}> }}
 */
export function buildTOC(html) {
  const headings = []
  const usedIds  = {}

  const htmlWithIds = html.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
    const text = stripTags(inner).trim()
    let base    = slugify(text)
    if (!base) base = `seccion-${headings.length + 1}`

    // Garantiza unicidad
    let id = base
    if (usedIds[id] !== undefined) {
      usedIds[id]++
      id = `${base}-${usedIds[id]}`
    } else {
      usedIds[id] = 0
    }

    headings.push({ id, text, level: parseInt(tag[1]) })
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`
  })

  return { htmlWithIds, headings }
}
