import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import LeadPopup from './components/LeadPopup'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import ProductoDetalle from './pages/ProductoDetalle'
import Equipo from './pages/Equipo'
import SobreNosotros from './pages/SobreNosotros'
import Contacto from './pages/Contacto'
import FAQ from './pages/FAQ'
import Combos from './pages/Combos'
import Dashboard from './pages/Dashboard'

// Páginas que NO deben mostrar el Navbar/Footer público
const DASHBOARD_ROUTES = ['/dashboard']

function Layout() {
  const { pathname } = useLocation()
  const isDashboard = DASHBOARD_ROUTES.some(r => pathname.startsWith(r))

  return (
    <div className="flex flex-col min-h-screen">
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
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
