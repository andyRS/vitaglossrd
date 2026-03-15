/**
 * Script temporal para generar la imagen del post 34 (Colágeno hidrolizado)
 * Uso: node scripts/gen-image-34.js
 */
const OpenAI = require('openai')
const fs = require('fs')
const path = require('path')
const https = require('https')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const slug = 'colageno-hidrolizado-tipos-cual-comprar-republica-dominicana'
const titulo = 'Colágeno hidrolizado: tipos y cuál comprar en República Dominicana'
const tags = ['colágeno hidrolizado', 'suplementos RD', 'piel saludable']

const temasPrincipales = tags.slice(0, 3).join(', ')

// ─── PROMPT HIPPEREALISTA (mismo motor que usa ChatGPT internamente) ──────────
const prompt = `A single photorealistic editorial photograph — indistinguishable from a real DSLR photo — for a health article about: "${titulo}".

TOPIC KEYWORDS: ${temasPrincipales}.

SUBJECT: A real-looking Dominican or Latin woman in her 30s touching her face with smooth, healthy, glowing skin — showing the visible benefit of collagen. Her skin must look 100% human: visible pores, natural asymmetry, individual hair strands, slight skin translucency, realistic eye reflections. NOT perfect plastic AI-skin.
Next to her: collagen powder or capsules and a glass of water or fresh fruits (berries, citrus) arranged naturally.

CAMERA & LENS: Shot on Canon EOS R5, 85mm f/1.4, ISO 200, warm soft window light from the left side. Shallow depth of field. Natural bokeh background.

SKIN REALISM (critical): subsurface scattering on cheeks and nose tip, visible fine pores on nose and forehead, natural skin color variation, slight warm glow from light, individual micro-hairs on cheek — NOT AI smooth skin.

MOOD: warm, premium wellness, inviting, teal and gold color accents. Health magazine editorial quality.

STRICT RULES:
- NO text, NO labels, NO logos, NO watermarks anywhere.
- NOT a 3D render, NOT a cartoon, NOT illustration, NOT CGI.
- Person must look like a real Caribbean person — natural features, natural smile.
- Landscape 16:9, subject sharp, background softly blurred.`

function descargarArchivo(url, destino) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destino)
    https.get(url, res => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
    }).on('error', err => { fs.unlink(destino, () => {}); reject(err) })
  })
}

;(async () => {
  console.log('🎨 Generando imagen con gpt-image-1 (el motor de ChatGPT)...')
  try {
    const response = await openai.images.generate({
      model: 'gpt-image-1',  // MISMO modelo que usa ChatGPT — personas hipperealistas
      prompt,
      n: 1,
      size: '1536x1024',     // Landscape 3:2
      quality: 'high',
    })

    // gpt-image-1 devuelve base64 (no URL como DALL-E 3)
    const b64 = response.data[0].b64_json
    const imageBuffer = Buffer.from(b64, 'base64')

    const blogDir = path.join(__dirname, '../frontend/public/blog')
    if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true })
    const destino = path.join(blogDir, `${slug}.png`)
    fs.writeFileSync(destino, imageBuffer)
    console.log(`✅ Imagen guardada en /blog/${slug}.png`)
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
})()
