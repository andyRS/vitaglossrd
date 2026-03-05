import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin: convierte <link rel="stylesheet"> → preload+onload para sacar el CSS
// de la ruta crítica de render y mejorar LCP/FCP.
// noscript fallback garantiza que el CSS igual llega en navegadores sin JS.
function deferCSSPlugin() {
  return {
    name: 'defer-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/g,
        (_, href) =>
          `<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" href="${href}">` +
          `<noscript><link rel="stylesheet" href="${href}"></noscript>`
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    deferCSSPlugin(),
  ],
  build: {
    // No sourcemaps en producción — los archivos .map no los descarga ningún usuario
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React + router: cambia raramente, chunk muy cacheable
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'react-vendor'
          }
          // framer-motion en su propio chunk: es grande (~150 KB) y cambia
          // independientemente del código de la app — mejor cache hit rate
          if (id.includes('node_modules/framer-motion') ||
              id.includes('node_modules/motion') ||
              id.includes('node_modules/@motionone')) {
            return 'framer-motion'
          }
        },
      },
    },
  },
})
