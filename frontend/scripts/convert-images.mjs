import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')

// Remove near-white pixels by setting alpha=0 (threshold: pixels where R,G,B > 230)
async function removeWhiteBg(inputPath, threshold = 230) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0 // fully transparent
    }
  }

  return sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
}

const conversions = [
  // Logo navbar — PNG, keep original transparency
  {
    input: 'logo_final.png',
    output: 'logo_final.webp',
    resize: { width: 420, height: 240, fit: 'inside', withoutEnlargement: true },
    webpOptions: { quality: 90 },
    removeBg: false
  },
  // Logo footer — PNG, keep original transparency
  {
    input: 'logo-footer-n.png',
    output: 'logo-footer-n.webp',
    resize: { width: 420, height: 280, fit: 'inside', withoutEnlargement: true },
    webpOptions: { quality: 88 },
    removeBg: false
  },
  // Product images — JPG with white background baked in → remove it
  {
    input: '124106SP-690px-01.jpg',
    output: '124106SP-690px-01.webp',
    resize: { width: 620, height: 620, fit: 'inside', withoutEnlargement: true },
    webpOptions: { quality: 85 },
    removeBg: true,
    threshold: 235
  },
  {
    input: '124108-690px-01.jpg',
    output: '124108-690px-01.webp',
    resize: { width: 620, height: 620, fit: 'inside', withoutEnlargement: true },
    webpOptions: { quality: 85 },
    removeBg: true,
    threshold: 235
  },
  {
    input: '124111-690px-01.jpg',
    output: '124111-690px-01.webp',
    resize: { width: 620, height: 620, fit: 'inside', withoutEnlargement: true },
    webpOptions: { quality: 85 },
    removeBg: true,
    threshold: 235
  },
  {
    input: '102992MX-690px-01.jpg',
    output: '102992MX-690px-01.webp',
    resize: { width: 620, height: 620, fit: 'inside', withoutEnlargement: true },
    webpOptions: { quality: 85 },
    removeBg: true,
    threshold: 235
  },
  {
    input: '109741CO-690px-01.png',
    output: '109741CO-690px-01.webp',
    resize: { width: 620, height: 620, fit: 'inside', withoutEnlargement: true },
    webpOptions: { quality: 85 },
    removeBg: false  // PNG already has transparency
  }
]

for (const item of conversions) {
  const inputPath = path.join(publicDir, item.input)
  const outputPath = path.join(publicDir, item.output)
  try {
    let s
    if (item.removeBg) {
      s = await removeWhiteBg(inputPath, item.threshold)
    } else {
      s = sharp(inputPath)
    }
    const info = await s
      .resize(item.resize)
      .webp({ ...item.webpOptions, lossless: false })
      .toFile(outputPath)
    console.log(`✅ ${item.input} → ${item.output} (${(info.size / 1024).toFixed(1)} KB)`)
  } catch (e) {
    console.error(`❌ ${item.input}: ${e.message}`)
  }
}
