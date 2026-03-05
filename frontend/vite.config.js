import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin: inyecta <link rel="preload"> para CSS y modulepreload para el JS
// de entrada ANTES de los links normales, para que el browser inicie la
// descarga de ambos en cuanto parsea el <head>, sin esperar el orden de
// descubrimiento. El CSS sigue siendo <link stylesheet> — no se rompe nada.
function preloadCriticalPlugin() {
  return {
    name: 'preload-critical',
    enforce: 'post',
    transformIndexHtml(html) {
      // 1) Agrega <link rel="preload" as="style"> ANTES del <link stylesheet>
      html = html.replace(
        /(<link rel="stylesheet" crossorigin href="([^"]+\.css)">)/g,
        '<link rel="preload" as="style" crossorigin href="$2">$1'
      )
      // 2) Agrega <link rel="modulepreload"> para el chunk JS de entrada
      //    (el que no es vendor ni framer-motion — el bundle principal de la app)
      html = html.replace(
        /(<script type="module" crossorigin src="([^"]+\/index-[^"]+\.js)"><\/script>)/g,
        '<link rel="modulepreload" crossorigin href="$2">$1'
      )
      return html
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    preloadCriticalPlugin(),
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
