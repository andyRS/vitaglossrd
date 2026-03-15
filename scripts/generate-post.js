/**
 * VitaGloss RD — Generador automático de artículos con IA
 *
 * Uso:
 *   ANTHROPIC_API_KEY=sk-ant-... OPENAI_API_KEY=sk-... node scripts/generate-post.js
 *
 * Lo que hace:
 *   1. Lee los posts existentes en frontend/src/data/posts.js
 *   2. Llama a Claude (Anthropic) para generar el texto del artículo (1500+ palabras)
 *   3. Llama a DALL-E 3 (OpenAI) para generar una imagen única y personalizada
 *   4. Inserta el nuevo post en posts.js con la imagen descargada
 *   5. Listo — el commit/push lo hace GitHub Actions (o tú manualmente)
 */

const Anthropic = require('@anthropic-ai/sdk')
const OpenAI = require('openai')
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

// ─── Imagen fallback si DALL-E falla ───────────────────────────────────────
const IMAGEN_FALLBACK_POR_PRODUCTO = {
  1:  '/109741CO-690px-01.webp',
  2:  '/124111-690px-01.webp',
  3:  '/124108-690px-01.webp',
  4:  '/109741CO-690px-01.webp',
  6:  '/110170CO-690px-01.webp',
  9:  '/109741CO-690px-01.webp',
  10: '/109741CO-690px-01.webp',
  11: '/nutrilite-zinc-defensa-inmunologica.webp',
  17: '/Vitamina-D-transparente.webp',
  18: '/omega-nutrilite.webp',
  20: '/protenia-vegetal-transparente.webp',
  21: '/kit-envejecimiento-saludable.webp',
}

// ─── (tabla de traducción eliminada — DALL-E entiende español directamente) ──

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
 * Genera una imagen con DALL-E 3 basada en el título y tags del artículo.
 * La descarga a /frontend/public/blog/[slug].png
 * Devuelve la ruta pública (/blog/[slug].png) o null si falla.
 */
async function generarImagenDallE(titulo, tags, slug, openaiKey) {
  if (!openaiKey) {
    console.warn('⚠️  OPENAI_API_KEY no definida — se usará imagen de producto')
    return null
  }

  const openai = new OpenAI({ apiKey: openaiKey })

  // ── Prompt engineered for hyperrealistic people & photography ──────────
  const temasPrincipales = tags.slice(0, 4).join(', ')
  const prompt = `A single photorealistic editorial photograph — indistinguishable from a real DSLR photo — for a health and wellness article titled: "${titulo}".

TOPIC KEYWORDS: ${temasPrincipales}.

SUBJECT DIRECTION — pick the most fitting:
- If the topic involves people (vitamins for kids, smiling, confidence, energy, hair, skin): show a real-looking Dominican or Latin woman/man/child doing the relevant action. Face must look 100% human: real skin texture with visible pores, natural asymmetry, realistic eyes with reflections, individual hair strands, slight skin imperfections — NOT perfect AI skin.
- If the topic is a product/supplement: arrange the product with natural ingredients (fruits, plants, capsules) on a textured surface, shot like a high-end editorial still life.
- If the topic is dental: extreme close-up of a real human smile, natural warm tooth color, realistic gum texture, soft studio light.

CAMERA & LENS (include in rendering): Shot on Sony A7R V, 85mm f/1.4 lens, ISO 400, natural window light or professional softbox. Shallow depth of field. Bokeh background.

SKIN REALISM (critical for people): subsurface scattering, visible pores, light skin translucency at ears/nose tips, individual facial hair stubble or fine hair, natural micro-wrinkles around eyes, slight color variation in skin tone.

MOOD & COLOR: warm, inviting, premium health magazine — teal and deep blue accents matching VitaGloss RD brand. Natural color grading, not oversaturated.

STRICT RULES:
- NO text, NO labels, NO logos, NO watermarks anywhere in the image.
- NOT a 3D render, NOT a cartoon, NOT an illustration, NOT AI-looking plastic skin.
- People must look like real Dominican/Caribbean individuals — natural features.
- Landscape 16:9 composition, subject sharp, background softly blurred.`

  console.log(`🎨 Generando imagen con gpt-image-1 para: "${titulo}"`)

  try {
    const response = await openai.images.generate({
      model: 'gpt-image-1',   // El mismo modelo que usa ChatGPT — MUCHO mejor en personas reales
      prompt,
      n: 1,
      size: '1536x1024',      // Landscape 3:2 — máxima calidad disponible en gpt-image-1
      quality: 'high',        // low / medium / high
    })

    // gpt-image-1 devuelve base64, no URL
    const b64 = response.data[0].b64_json
    const imageBuffer = Buffer.from(b64, 'base64')
    console.log(`✅ Imagen generada con gpt-image-1`)

    // Crear carpeta /public/blog/ si no existe
    const blogDir = path.join(__dirname, '../frontend/public/blog')
    if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true })

    const destino = path.join(blogDir, `${slug}.png`)
    fs.writeFileSync(destino, imageBuffer)

    console.log(`✅ Imagen guardada: /blog/${slug}.png`)
    return `/blog/${slug}.png`

  } catch (err) {
    console.warn(`⚠️  Error generando imagen con gpt-image-1: ${err.message} — se usará imagen de producto`)
    return null
  }
}

// ─── Lista de temas que generan artículos profundos de 1500+ palabras ──────
const TEMAS_SUGERIDOS = [
  'flúor en pasta dental — mitos y verdades para dominicanos en 2026',
  'cómo elegir un cepillo de dientes: guía completa para dominicanos',
  'el efecto del agua con cloro en los dientes de los dominicanos',
  'proteína Whey vs vegetal para atletas dominicanos — análisis completo',
  'hierro y anemia en mujeres dominicanas — suplementación correcta en 2026',
  'probióticos y salud digestiva en el Caribe — qué dice la ciencia',
  'magnesio para el estrés crónico en República Dominicana',
  'coenzima Q10 beneficios para el corazón dominicano — guía completa',
  'cúrcuma con pimienta negra — antiinflamatorio natural en RD',
  'colágeno hidrolizado — qué tipo realmente funciona en República Dominicana',
  'melatonina para el insomnio dominicano — uso correcto, dosis y riesgos',
  'vitamina B12 en vegetarianos dominicanos — señales de déficit y soluciones',
  'biotina para el cabello y las uñas en República Dominicana — la verdad',
  'sensibilidad dental en el Caribe — causas, tratamiento y prevención',
  'manchas en los dientes por café — cómo tratarlas sin dañar el esmalte en RD',
  'sellantes dentales para niños dominicanos — guía para padres',
  'suplementos durante el embarazo en República Dominicana — guía completa',
  'cómo leer una etiqueta de suplementos y detectar fraudes en RD',
  'antioxidantes para proteger la piel del sol caribeño — ciencia y productos',
  'vitaminas para el rendimiento académico en estudiantes dominicanos',
  'suplementos para personas mayores de 60 en República Dominicana',
  'omega 3 vegetal vs omega 3 marino — diferencias que importan en RD',
  'flúor en adultos mayores dominicanos — necesidad, dosis y beneficios',
  'hierro en niños dominicanos — cuándo suplementar y cómo hacerlo bien',
  'insomnio en el Caribe — causas específicas y soluciones naturales para RD',
  'alimentos pro-inflamatorios más consumidos en República Dominicana',
  'hidratación y electrolitos en el calor dominicano — más allá del agua',
  'azúcar y salud bucal — el vínculo que los dominicanos deben entender',
  'osteoporosis en la mujer dominicana — prevención desde los 30 años',
  'síndrome metabólico en RD — causas, diagnóstico y nutrición correctiva',
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
  const prompt = `Eres Andy Rosado, experto en salud bucal y nutrición de República Dominicana. Escribes para el blog VitaGloss RD que vende productos Amway (Glister™ y Nutrilite™). Tus artículos son reconocidos por su profundidad, contexto caribeño específico y citas a investigación real.

ARTÍCULOS YA PUBLICADOS (NO repitas estos temas ni uses el mismo slug):
${titulos.map((t, i) => `${i + 1}. ${t} [slug: ${slugs[i]}]`).join('\n')}

TEMA SUGERIDO PARA HOY: "${temaSugerido}"
→ Puedes ajustar el ángulo o enfoque, pero el tema debe ser completamente diferente a todos los anteriores.

PRODUCTOS DISPONIBLES (usa el ID más relevante en productoRelacionadoId):
ID 1  → Glister™ Multi-Action Pasta Dental
ID 2  → Glister™ Spray Bucal
ID 3  → Glister™ Enjuague Bucal
ID 4  → Vitamina C Nutrilite™
ID 6  → Double X Nutrilite™ (multivitamínico premium con 22 concentrados de plantas)
ID 9  → Ácido Fólico Nutrilite™
ID 10 → Cal Mag D Nutrilite™ (calcio + magnesio + vitamina D)
ID 11 → Zinc Defensa Inmunológica Nutrilite™
ID 17 → Vitamina D Nutrilite™
ID 18 → Omega-3 Nutrilite™
ID 20 → Proteína Vegetal Nutrilite™ (soya, trigo y guisante)
ID 21 → Kit Envejecimiento Saludable Nutrilite™

RESPONDE SOLO con un JSON válido (sin markdown, sin texto extra) con esta estructura exacta:
{
  "titulo": "Título atractivo en español (máx 70 chars)",
  "slug": "slug-unico-en-kebab-case-diferente-a-todos-los-anteriores",
  "excerpt": "Resumen de 1-2 oraciones (máx 160 chars) que genere curiosidad y urgencia",
  "metaDescripcion": "Meta SEO de 140-160 chars que incluya 'República Dominicana' y verbo de acción",
  "categoria": "Salud bucal" | "Nutrición" | "Suplementos" | "Bienestar",
  "tiempoLectura": "X min",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "productoRelacionadoId": <número de la lista anterior>,
  "faqs": [
    { "pregunta": "Pregunta frecuente real del tema", "respuesta": "Respuesta directa de 2-3 oraciones" },
    { "pregunta": "Segunda pregunta frecuente", "respuesta": "Respuesta directa de 2-3 oraciones" }
  ],
  "contenido": "<HTML completo del artículo>"
}

REGLAS PARA EL CONTENIDO HTML (MUY IMPORTANTE — cumple todas):
- MÍNIMO 1500 palabras, máximo 2000 palabras. Esto es crítico para SEO.
- Estructura obligatoria: introducción (2-3 párrafos) → 5 a 7 secciones con <h2> → al menos 2 bloques <ul><li> con 5+ items → mención natural del producto VitaGloss RD → sección de preguntas frecuentes usando <h2>Preguntas frecuentes sobre [tema]</h2> → CTA final
- Usar <h3> para subsecciones dentro de las secciones principales
- Usar <strong> para destacar datos, estadísticas y nombres de nutrientes/productos
- Citar estudios reales (por ejemplo: "Un metaanálisis publicado en el American Journal of Clinical Nutrition...", "Según la OPS...", "El estudio GAIT encontró...")
- Mencionar "República Dominicana" o "RD" al menos 6 veces con contexto local específico (datos epidemiológicos dominicanos, hábitos alimenticios locales, productos disponibles en RD, clima caribeño)
- Incluir al menos un bloque con datos numéricos o rangos de referencia (dosis, valores de laboratorio, estadísticas)
- NO usar frases genéricas de IA: "en resumen", "es importante destacar", "en definitiva", "no dudes en"
- Tono: conversacional pero informado, como un médico dominicano que habla con su paciente
- Cerrar con: <p class="cta-inline">¿Quieres <strong>[beneficio principal específico]</strong>? Escríbenos por WhatsApp y te orientamos sin compromiso.</p>`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 6000,
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

  // Validar longitud mínima del contenido (1500 palabras ≈ 8000 chars de HTML)
  const wordCount = postData.contenido.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  console.log(`📊 Palabras en contenido: ~${wordCount}`)
  if (wordCount < 1200) {
    console.warn(`⚠️  Contenido corto (${wordCount} palabras). Se publicará igualmente, pero considera regenerar.`)
  }

  if (slugs.includes(postData.slug)) {
    postData.slug = `${postData.slug}-${today.replace(/-/g, '')}`
    console.warn(`⚠️  Slug duplicado — se usó: ${postData.slug}`)
  }

  // 4 ── Generar imagen con DALL-E 3 ──────────────────────────────────────────
  const openaiKey = process.env.OPENAI_API_KEY
  const imagenDescargada = await generarImagenDallE(
    postData.titulo,
    postData.tags,
    postData.slug,
    openaiKey
  )
  const imagen = imagenDescargada ||
    IMAGEN_FALLBACK_POR_PRODUCTO[postData.productoRelacionadoId] ||
    '/109741CO-690px-01.webp'

  // 5 ── Construir el bloque del nuevo post ──────────────────────────────────
  const tagsStr = JSON.stringify(postData.tags)
  const contenidoHtml = escaparParaJs(postData.contenido)

  // Construir bloque de faqs si existen
  let faqsBlock = ''
  if (postData.faqs && postData.faqs.length > 0) {
    const faqsJson = postData.faqs
      .map(f => `      { pregunta: '${escaparComillaSimple(f.pregunta)}', respuesta: '${escaparComillaSimple(f.respuesta)}' }`)
      .join(',\n')
    faqsBlock = `\n    faqs: [\n${faqsJson},\n    ],`
  }

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
    imagenCover: true,
    autor: 'Andy Rosado',
    tags: ${tagsStr},
    productoRelacionadoId: ${postData.productoRelacionadoId},
    metaDescripcion: '${escaparComillaSimple(postData.metaDescripcion)}',${faqsBlock}
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
