import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      // PNG → comprimir agresivamente (logo_final.png 2.2MB → ~200KB)
      png: { quality: 80, compressionLevel: 9 },
      // JPG / JPEG → comprimir productos
      jpg:  { quality: 82, progressive: true },
      jpeg: { quality: 82, progressive: true },
      // WebP → para los que ya vengan en WebP
      webp: { quality: 82 },
      // Loggear cuánto se ahorró en cada build
      logStats: true,
    }),
  ],
})
