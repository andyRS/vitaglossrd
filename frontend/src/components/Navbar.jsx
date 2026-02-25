import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { count, setOpen: openCart } = useCart()

  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/combos', label: 'Combos', emoji: '🔥' },
    { to: '/faq', label: 'Preguntas' },
    { to: '/equipo', label: 'Únete al equipo', emoji: '✨' },
    { to: '/sobre-nosotros', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' },
  ]

  const isActive = (path) => location.pathname === path

  // Transparente solo en Home sin scroll. En cualquier otra página: siempre sólido.
  const isTransparent = isHome && !scrolled

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">

          {/* Logo */}
          <Link to="/" className="flex items-center group -my-8">
            <img
              src="/logo_final.png"
              alt="VitaGloss RD"
              className="h-36 w-auto object-contain drop-shadow-md brightness-105 contrast-105 group-hover:scale-105 group-hover:drop-shadow-xl group-hover:brightness-110 transition-all duration-300"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-secondary'
                    : isTransparent
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.emoji && <span aria-hidden="true" className="mr-1">{link.emoji}</span>}
                {link.label}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-secondary rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Carrito */}
            <button
              onClick={() => openCart(true)}
              aria-label={`Ver carrito${count > 0 ? `, ${count} producto${count !== 1 ? 's' : ''}` : ''}`}
              className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <a
              href="https://wa.me/18492763532?text=Hola!%20Quiero%20conocer%20los%20productos%20de%20VitaGloss%20RD"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pedir ahora por WhatsApp"
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 shadow-md shadow-green-200 hover:shadow-lg hover:scale-105"
            >
              <span aria-hidden="true">📲</span>
              <span>Pedir ahora</span>
            </a>
          </div>

          {/* Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {/* Cart icon mobile */}
            <button
              onClick={() => openCart(true)}
              aria-label="Ver carrito"
              className={`relative p-2 rounded-xl transition-colors ${
                isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            className={`flex flex-col justify-center gap-1.5 p-2 rounded-lg transition-colors ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
            >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
              className={`block w-6 h-0.5 rounded-full origin-center ${isTransparent ? 'bg-white' : 'bg-gray-700'}`}
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
              className={`block w-6 h-0.5 rounded-full ${isTransparent ? 'bg-white' : 'bg-gray-700'}`}
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
              className={`block w-6 h-0.5 rounded-full origin-center ${isTransparent ? 'bg-white' : 'bg-gray-700'}`}
            />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-white border-t border-gray-100 shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-5 flex flex-col gap-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive(link.to)
                        ? 'bg-primary/5 text-primary'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>
                      {link.emoji && <span aria-hidden="true" className="mr-1">{link.emoji}</span>}
                      {link.label}
                    </span>
                    {isActive(link.to) && <span className="w-2 h-2 bg-secondary rounded-full" aria-hidden="true" />}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-3 border-t border-gray-100 mt-2"
              >
                <a
                  href="https://wa.me/18492763532?text=Hola!%20Quiero%20conocer%20los%20productos%20de%20VitaGloss%20RD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md shadow-green-100"
                >
                  📲 Pedir por WhatsApp
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
