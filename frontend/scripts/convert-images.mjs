import sharp from 'sharp'
import { readdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')

const conversions = [
  // Logo navbar — display: 168px wide → serve at 2x = 336px, was 1536px wide and 2.2MB!
  {
    input: 'logo_final.png',
    output: 'logo_final.webp',
    resize: { width: 420, height: 240, fit: 'inside', withoutEnlargement: true },
    webpOptions: { quality: 90 }
  },
  // Logo footer — display: ~252px wide
  {
    input: 'logo-footer-n.png',
    output: 'logo-footer-n.webp',
    resize: { width: 420, height: 280, fit: 'inside', withoutEnlargement: true },
    webpOptions: { quality: 88 }
  },
  // Product images — display: 308px → serve at 2x = 616px
  {
    input: '124106SP-690px-01.jpg',
    output: '124106SP-690px-01.webp',
    resize: { width: 620, height: 620, fit: 'inside', withoutEnlargement: true },
    webpOptions: { quality: 82 },
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  },
  {
    input: '124108-690px-01.jpg',
    output: '124108-690px-01.webp',
    resize: { width: 620, height: 620, fit: 'inside', withoutEnlargement: true },
    webpOptions: { quality: 82 },
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  },
  {
    input: '124111-690px-01.jpg',
    output: '124111-690px-01.webp',
    resize: { width: 620, height: 620, fit: 'inside', withoutEnlargement: true },
    webpOptions: { quality: 82 },
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  },
  {
    input: '102992MX-690px-01.jpg',
    output: '102992MX-690px-01.webp',
    resize: { width: 620, height: 620, fit: 'inside', withoutEnlargement: true },
    webpOptions: { quality: 82 },
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  },
  {
    input: '109741CO-690px-01.png',
    output: '109741CO-690px-01.webp',
    resize: { width: 620, height: 620, fit: 'inside', withoutEnlargement: true },
    webpOptions: { quality: 82 },
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  }
]

for (const item of conversions) {
  const inputPath = path.join(publicDir, item.input)
  const outputPath = path.join(publicDir, item.output)
  try {
    let s = sharp(inputPath).resize(item.resize)
    if (item.background) {
      s = s.flatten({ background: item.background })
    }
    const info = await s.webp(item.webpOptions).toFile(outputPath)
    console.log(`✅ ${item.input} → ${item.output} (${(info.size / 1024).toFixed(1)} KB)`)
  } catch (e) {
    console.error(`❌ ${item.input}: ${e.message}`)
  }
}
