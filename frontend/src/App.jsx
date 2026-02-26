import { BrowserRouter, Routes, Route, useLocation, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { api } from './services/api'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import LeadPopup from './components/LeadPopup'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import ProductoDetalle from './pages/ProductoDetalle'
import Equipo from './pages/Equipo'
import SobreNosotros from './pages/SobreNosotros'
import Contacto from './pages/Contacto'
import FAQ from './pages/FAQ'
import Combos from './pages/Combos'
import Dashboard from './pages/Dashboard'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Privacidad from './pages/Privacidad'
import Terminos from './pages/Terminos'

// Páginas que NO deben mostrar el Navbar/Footer público
const DASHBOARD_ROUTES = ['/dashboard']

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
      <RefTracker />
      {!isDashboard && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/equipo" element={<Equipo />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/combos" element={<Combos />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
      {!isDashboard && <WhatsAppFloat />}
      {!isDashboard && <LeadPopup />}
      {!isDashboard && <CartDrawer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
