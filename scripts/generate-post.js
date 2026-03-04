/**
 * VitaGloss RD — Generador automático de artículos con IA (Anthropic Claude)
 *
 * Uso:
 *   ANTHROPIC_API_KEY=sk-... PEXELS_API_KEY=... node scripts/generate-post.js
 *
 * Lo que hace:
 *   1. Lee los posts existentes en frontend/src/data/posts.js
 *   2. Llama a Claude para generar un post NUEVO y ÚNICO
 *   3. Busca y descarga una foto relevante desde Pexels
 *   4. Inserta el nuevo post en posts.js con la imagen descargada
 *   5. Listo — el commit/push lo hace GitHub Actions (o tú manualmente)
 */

const Anthropic = require('@anthropic-ai/sdk')
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

// ─── Imagen fallback si Pexels falla ────────────────────────────────────────
const IMAGEN_FALLBACK_POR_PRODUCTO = {
  1:  '/109741CO-690px-01.png',
  2:  '/109742CO-690px-01.png',
  3:  '/109743CO-690px-01.png',
  4:  '/116571CO-690px-01.png',
  6:  '/116545CO-690px-01.png',
  9:  '/116560CO-690px-01.png',
  10: '/116570CO-690px-01.png',
  11: '/116558CO-690px-01.png',
  17: '/116567CO-690px-01.png',
  18: '/116562CO-690px-01.png',
  20: '/116580CO-690px-01.png',
  21: '/116585CO-690px-01.png',
}

// ─── Traducción de tags frecuentes al inglés (mejora resultados en Pexels) ───
const TRADUCCION_TAGS = {
  'salud bucal': 'dental health',
  'pasta dental': 'toothpaste dental care',
  'vitaminas': 'vitamins supplements',
  'suplementos': 'health supplements',
  'caries': 'tooth decay dental',
  'encías': 'gum health',
  'blanqueamiento dental': 'teeth whitening',
  'mal aliento': 'fresh breath dental',
  'omega 3': 'omega 3 fish oil',
  'vitamina c': 'vitamin c citrus health',
  'vitamina d': 'vitamin d sunshine',
  'zinc': 'zinc immune health',
  'calcio': 'calcium bones health',
  'proteína vegetal': 'plant protein healthy food',
  'colágeno': 'collagen skin health',
  'sistema inmune': 'immune system health',
  'probióticos': 'gut health probiotics',
  'magnesio': 'magnesium supplements',
  'antioxidantes': 'antioxidants healthy food',
  'envejecimiento': 'healthy aging wellness',
  'nutrición': 'healthy nutrition food',
  'higiene dental': 'dental hygiene routine',
  'flúor': 'fluoride dental health',
}

/**
 * Descarga un archivo desde una URL a una ruta local.
 */
function descargarArchivo(url, destino) {
  return new Promise((resolve, reject) => {
    const modulo = url.startsWith('https') ? https : http
    const archivo = fs.createWriteStream(destino)
    modulo.get(url, (res) => {
      // Seguir redirecciones
      if (res.statusCode === 301 || res.statusCode === 302) {
        archivo.close()
        fs.unlinkSync(destino)
        return descargarArchivo(res.headers.location, destino).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        archivo.close()
        fs.unlinkSync(destino)
        return reject(new Error(`HTTP ${res.statusCode} descargando imagen`))
      }
      res.pipe(archivo)
      archivo.on('finish', () => { archivo.close(); resolve() })
    }).on('error', (err) => {
      fs.unlinkSync(destino)
      reject(err)
    })
  })
}

/**
 * Busca una foto en Pexels y la descarga.
 * Devuelve la ruta pública (/blog/[slug].jpg) o null si falla.
 */
async function buscarYDescargarImagen(tags, titulo, slug, pexelsKey) {
  if (!pexelsKey) {
    console.warn('⚠️  PEXELS_API_KEY no definida — se usará imagen de producto')
    return null
  }

  // Construir query en inglés con los primeros 2 tags
  const queryRaw = tags.slice(0, 2).join(' ')
  const queryEn = TRADUCCION_TAGS[queryRaw.toLowerCase()] ||
    tags.slice(0, 2).map(t => TRADUCCION_TAGS[t.toLowerCase()] || t).join(' ')

  const query = encodeURIComponent(queryEn + ' health')
  const pexelsUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=5&orientation=landscape&size=medium`

  console.log(`🖼️  Buscando imagen en Pexels: "${queryEn} health"`)

  try {
    const res = await fetch(pexelsUrl, {
      headers: { Authorization: pexelsKey },
    })

    if (!res.ok) throw new Error(`Pexels API: ${res.status}`)

    const data = await res.json()
    if (!data.photos || data.photos.length === 0) {
      console.warn('⚠️  Pexels no devolvió fotos para esa búsqueda')
      return null
    }

    // Elegir la foto con mejor resolución (preferimos la 2da para variedad)
    const foto = data.photos[1] || data.photos[0]
    const imageUrl = foto.src.large2x || foto.src.large || foto.src.medium

    // Crear carpeta /public/blog/ si no existe
    const blogDir = path.join(__dirname, '../frontend/public/blog')
    if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true })

    const destino = path.join(blogDir, `${slug}.jpg`)
    await descargarArchivo(imageUrl, destino)

    console.log(`✅ Imagen descargada: /blog/${slug}.jpg (foto por ${foto.photographer})`)
    return `/blog/${slug}.jpg`

  } catch (err) {
    console.warn(`⚠️  Error descargando imagen de Pexels: ${err.message} — se usará imagen de producto`)
    return null
  }
}

// ─── Lista de temas banneados — para evitar duplicados exactos ───────────────
const TEMAS_SUGERIDOS = [
  'flúor en pasta dental — mitos y verdades para dominicanos',
  'cómo elegir un cepillo de dientes en República Dominicana',
  'qué es la gingivitis y cómo prevenirla con productos naturales',
  'el efecto del agua con cloro en los dientes de los dominicanos',
  'proteína Whey vs vegetal para atletas en RD',
  'hierro y anemia en mujeres dominicanas — suplementación correcta',
  'probióticos y salud digestiva en el Caribe — qué dice la ciencia',
  'magnesio para el estrés en República Dominicana',
  'coenzima Q10 beneficios para el corazón en RD',
  'cúrcuma y cúrcuma con pimienta negra — antiinflamatorio natural en RD',
  'colágeno hidrolizado — qué tipo comprar en República Dominicana',
  'melatonina para el insomnio — uso correcto en RD',
  'vitamina B12 en vegetarianos dominicanos',
  'biotina para el cabello y las uñas — ¿funciona en RD?',
  'sensibilidad dental causas y tratamiento sin dentista',
  'encías que sangran — causas y solución con Glister',
  'manchas en los dientes por café — cómo tratarlas en RD',
  'sellantes dentales para niños en República Dominicana',
  'suplementos durante el embarazo en República Dominicana',
  'cómo leer una etiqueta de suplementos y no caer en mentiras',
  'antioxidantes para proteger la piel del sol caribeño',
  'vitaminas para el rendimiento académico en estudiantes dominicanos',
  'suplementos para personas mayores de 60 en RD',
  'chia y omega 3 vegetal vs omega 3 marino — diferencias',
  'el papel del flúor en adultos mayores en República Dominicana',
]

// ─── helper: escapar comillas dentro de template literals ───────────────────
function escaparParaJs(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
}

function escaparComillaSimple(str) {
  return str.replace(/'/g, "\\'")
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('❌ Falta ANTHROPIC_API_KEY en las variables de entorno.')
    process.exit(1)
  }

  const anthropic = new Anthropic({ apiKey })

  // 1 ── Leer posts.js ───────────────────────────────────────────────────────
  const postsPath = path.join(__dirname, '../frontend/src/data/posts.js')
  const postsContent = fs.readFileSync(postsPath, 'utf-8')

  const slugs = [...postsContent.matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1])
  const titulos = [...postsContent.matchAll(/titulo:\s*'([^']+)'/g)].map(m => m[1])
  const ids = [...postsContent.matchAll(/^\s+id:\s*(\d+)/gm)].map(m => parseInt(m[1]))
  const nextId = Math.max(...ids) + 1

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  // Elegir un tema sugerido que no exista aún
  const temasSinUsar = TEMAS_SUGERIDOS.filter(
    t => !titulos.some(titulo => titulo.toLowerCase().includes(t.split(' ')[0].toLowerCase()))
  )
  const temaSugerido = temasSinUsar[nextId % temasSinUsar.length] || TEMAS_SUGERIDOS[nextId % TEMAS_SUGERIDOS.length]

  console.log(`📝 Generando post #${nextId}…  Tema sugerido: "${temaSugerido}"`)

  // 2 ── Prompt a Claude ─────────────────────────────────────────────────────
  const prompt = `Eres Andy Rosado, experto en salud bucal y nutrición de República Dominicana. Escribes para el blog VitaGloss RD que vende productos Amway (Glister™ y Nutrilite™).

ARTÍCULOS YA PUBLICADOS (NO repitas estos temas ni uses el mismo slug):
${titulos.map((t, i) => `${i + 1}. ${t} [slug: ${slugs[i]}]`).join('\n')}

TEMA SUGERIDO PARA HOY: "${temaSugerido}"
→ Puedes ajustar el ángulo o enfoque, pero el tema debe ser diferente a todos los anteriores.

PRODUCTOS DISPONIBLES (usa el ID más relevante en productoRelacionadoId):
ID 1  → Glister™ Multi-Action Pasta Dental
ID 2  → Glister™ Spray Bucal
ID 3  → Glister™ Enjuague Bucal
ID 4  → Vitamina C Nutrilite™
ID 6  → Double X Nutrilite™ (multivitamínico premium)
ID 9  → Ácido Fólico Nutrilite™
ID 10 → Cal Mag D Nutrilite™ (calcio + magnesio + vitamina D)
ID 11 → Zinc Nutrilite™
ID 17 → Vitamina D Nutrilite™
ID 18 → Omega-3 Nutrilite™
ID 20 → Proteína Vegetal Nutrilite™
ID 21 → Kit Envejecimiento Saludable Nutrilite™

RESPONDE SOLO con un JSON válido (sin markdown, sin texto extra) con esta estructura exacta:
{
  "titulo": "Título atractivo en español (máx 70 chars)",
  "slug": "slug-unico-en-kebab-case-diferente-a-todos-los-anteriores",
  "excerpt": "Resumen de 1-2 oraciones (máx 160 chars) que genere curiosidad",
  "metaDescripcion": "Meta SEO de 140-160 chars que incluya 'República Dominicana' y verbo de acción (compra, descubre, aprende)",
  "categoria": "Salud Bucal" | "Nutrición" | "Suplementos" | "Estilo de Vida",
  "tiempoLectura": "X min",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "productoRelacionadoId": <número de la lista anterior>,
  "contenido": "<HTML completo del artículo>"
}

REGLAS PARA EL CONTENIDO HTML:
- Mínimo 900 palabras, máximo 1300 palabras
- Estructura: introducción (2 párrafos) → secciones con <h2> → lista <ul><li> con al menos un bloque → párrafo mencionando producto VitaGloss RD de forma natural → conclusión con CTA suave
- Usar <strong> para destacar datos importantes
- Mencionar "República Dominicana" o "RD" al menos 4 veces
- No usar expresiones de IA genéricas ("en resumen", "es importante destacar", "no dudes en")
- Tono: conversacional, directo, como lo hace un dominicano informado
- Al final agregar: <p class="cta-inline">¿Quieres <strong>[beneficio principal]</strong>? Escríbenos por WhatsApp y te orientamos sin compromiso.</p>`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const responseText = message.content[0].text.trim()

  // 3 ── Parsear JSON ────────────────────────────────────────────────────────
  let postData
  try {
    // A veces Claude envuelve en ```json ... ```, limpiar si pasa
    const clean = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '')
    postData = JSON.parse(clean)
  } catch (e) {
    console.error('❌ Claude no devolvió JSON válido:\n', responseText)
    process.exit(1)
  }

  // Validaciones básicas
  const required = ['titulo', 'slug', 'excerpt', 'metaDescripcion', 'categoria', 'tiempoLectura', 'tags', 'productoRelacionadoId', 'contenido']
  for (const field of required) {
    if (!postData[field]) {
      console.error(`❌ Falta el campo "${field}" en la respuesta de Claude`)
      process.exit(1)
    }
  }

  if (slugs.includes(postData.slug)) {
    postData.slug = `${postData.slug}-${today.replace(/-/g, '')}`
    console.warn(`⚠️  Slug duplicado — se usó: ${postData.slug}`)
  }

  // 4 ── Buscar y descargar imagen desde Pexels ─────────────────────────────
  const pexelsKey = process.env.PEXELS_API_KEY
  const imagenDescargada = await buscarYDescargarImagen(
    postData.tags,
    postData.titulo,
    postData.slug,
    pexelsKey
  )
  const imagen = imagenDescargada ||
    IMAGEN_FALLBACK_POR_PRODUCTO[postData.productoRelacionadoId] ||
    '/109741CO-690px-01.png'

  // 5 ── Construir el bloque del nuevo post ──────────────────────────────────
  const tagsStr = JSON.stringify(postData.tags)
  const contenidoHtml = escaparParaJs(postData.contenido)

  const nuevoPost = `  {
    id: ${nextId},
    slug: '${escaparComillaSimple(postData.slug)}',
    titulo: '${escaparComillaSimple(postData.titulo)}',
    excerpt:
      '${escaparComillaSimple(postData.excerpt)}',
    categoria: '${escaparComillaSimple(postData.categoria)}',
    fecha: '${today}',
    fechaActualizacion: '${today}',
    tiempoLectura: '${postData.tiempoLectura}',
    imagen: '${imagen}',
    autor: 'Andy Rosado',
    tags: ${tagsStr},
    productoRelacionadoId: ${postData.productoRelacionadoId},
    metaDescripcion: '${escaparComillaSimple(postData.metaDescripcion)}',
    contenido: \`${contenidoHtml}\`,
  },`

  // 6 ── Insertar antes del cierre del array ─────────────────────────────────
  // El array cierra con la línea que tiene solo "]"
  const updated = postsContent.replace(
    /^(\])\s*\n+(\s*\/\/ Categor)/m,
    `${nuevoPost}\n]\n\n// Categor`
  )

  if (updated === postsContent) {
    // fallback: insertar antes del primer `]` al inicio de línea seguido de categorias
    console.error('❌ No se encontró el punto de inserción en posts.js — revisa el formato.')
    process.exit(1)
  }

  fs.writeFileSync(postsPath, updated, 'utf-8')

  console.log(`✅ Post generado y agregado a posts.js`)
  console.log(`   ID      : ${nextId}`)
  console.log(`   Título  : ${postData.titulo}`)
  console.log(`   Slug    : ${postData.slug}`)
  console.log(`   Categoría: ${postData.categoria}`)
  console.log(`   Tags    : ${postData.tags.join(', ')}`)
}

main().catch(err => {
  console.error('❌ Error inesperado:', err.message)
  process.exit(1)
})
