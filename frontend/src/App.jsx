import { BrowserRouter, Routes, Route, useLocation, useSearchParams } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'

// Scroll al inicio en cada cambio de ruta
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { PreciosProvider } from './context/PreciosContext'
import { api } from './services/api'
import ProtectedRoute from './components/ProtectedRoute'
// Siempre presentes en pantalla → carga eagerly
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import LeadPopup from './components/LeadPopup'
import CartDrawer from './components/CartDrawer'
import CookieConsent from './components/CookieConsent'
// Home es la ruta inicial — eager para que el LCP no espere un chunk extra
import Home from './pages/Home'

// ── Páginas lazy: se parsean/compilan solo cuando el usuario navega a ellas ──
const Catalogo       = lazy(() => import('./pages/Catalogo'))
const ProductoDetalle= lazy(() => import('./pages/ProductoDetalle'))
const Equipo         = lazy(() => import('./pages/Equipo'))
const SobreNosotros  = lazy(() => import('./pages/SobreNosotros'))
const Contacto       = lazy(() => import('./pages/Contacto'))
const FAQ            = lazy(() => import('./pages/FAQ'))
const Combos         = lazy(() => import('./pages/Combos'))
const ComboDetalle   = lazy(() => import('./pages/ComboDetalle'))
const Dashboard      = lazy(() => import('./pages/Dashboard'))
const Blog           = lazy(() => import('./pages/Blog'))
const BlogPost       = lazy(() => import('./pages/BlogPost'))
const Privacidad     = lazy(() => import('./pages/Privacidad'))
const Devoluciones   = lazy(() => import('./pages/Devoluciones'))
const Terminos       = lazy(() => import('./pages/Terminos'))
const Unete          = lazy(() => import('./pages/Unete'))
const LandingPeloPiel = lazy(() => import('./pages/LandingPeloPiel'))

// Fallback mínimo mientras se carga un chunk
function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]" aria-busy="true">
      <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  )
}

// Páginas que NO deben mostrar el Navbar/Footer público
const DASHBOARD_ROUTES = ['/dashboard', '/unete', '/pelo-piel-unas']

// Detecta ?ref= en URL y guarda en sessionStorage para atribuir leads
function RefTracker() {
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      sessionStorage.setItem('vg_ref', ref)
      api.trackRef(ref).catch(() => {}) // silently track click
    }
  }, [searchParams])
  return null
}

function Layout() {
  const { pathname } = useLocation()
  const isDashboard = DASHBOARD_ROUTES.some(r => pathname.startsWith(r))

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <RefTracker />
      {!isDashboard && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={<PageSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/equipo" element={<Equipo />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/combos" element={<Combos />} />
          <Route path="/combos/:id" element={<ComboDetalle />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/devoluciones" element={<Devoluciones />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/unete" element={<Unete />} />
          <Route path="/pelo-piel-unas" element={<LandingPeloPiel />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        </Suspense>
      </main>
      {!isDashboard && <Footer />}
      {!isDashboard && <WhatsAppFloat />}
      {!isDashboard && <LeadPopup />}
      {!isDashboard && <CartDrawer />}
      <CookieConsent />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <PreciosProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
      </PreciosProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
