import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-primary text-white">

      {/* Franja garantía + envío */}
      <div className="bg-[#0f2a54] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { icono: '✅', titulo: 'Productos Originales', desc: 'Certificados Amway' },
              { icono: '🚚', titulo: 'Envío a Todo RD', desc: 'Gratis desde RD$2,500' },
              { icono: '🔄', titulo: 'Garantía', desc: 'Satisfacción garantizada' },
              { icono: '📲', titulo: 'Soporte WhatsApp', desc: 'Lun–Sáb 8am–8pm' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-2xl">{item.icono}</span>
                <p className="text-white font-bold text-sm">{item.titulo}</p>
                <p className="text-white/50 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Marca */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-2">
              <img
                src="/logo-footer-n.png"
                alt="VitaGloss RD"
                className="h-24 w-auto object-contain drop-shadow-lg"
              />
            </div>
            <p className="font-bold text-xl text-white leading-tight">VitaGloss RD</p>
            <p className="text-secondary text-sm mb-4">Tu salud, tu sonrisa</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Distribuidores independientes Amway en República Dominicana. Productos originales para tu bienestar.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="bg-white/10 border border-white/20 text-white/60 text-xs px-3 py-1 rounded-full">Dist. Amway Oficial</span>
              <span className="bg-white/10 border border-white/20 text-white/60 text-xs px-3 py-1 rounded-full">NSF • Kosher</span>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="font-semibold text-secondary mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-secondary transition-colors">Inicio</Link></li>
              <li><Link to="/catalogo" className="hover:text-secondary transition-colors">Catálogo</Link></li>
              <li><Link to="/combos" className="hover:text-secondary transition-colors">Combos</Link></li>
              <li><Link to="/blog" className="hover:text-secondary transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="hover:text-secondary transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/sobre-nosotros" className="hover:text-secondary transition-colors">Sobre Nosotros</Link></li>
              <li><Link to="/contacto" className="hover:text-secondary transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Políticas */}
          <div>
            <h3 className="font-semibold text-secondary mb-4">Políticas</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">&#10003;</span>
                <span>Envío nacional: RD$150–400</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">&#10003;</span>
                <span>Envío gratis ≥ RD$2,500 (STO)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">&#10003;</span>
                <span>Entrega 1–3 días hábiles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">&#10003;</span>
                <span>Garantía de satisfacción total</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">&#10003;</span>
                <span>Cambios por producto dañado</span>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-secondary mb-4">Contáctanos</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <span>📲</span>
                <a
                  href="https://wa.me/18492763532"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors"
                >
                  WhatsApp: (849) 276-3532
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span>📍</span>
                <span>República Dominicana</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🕐</span>
                <span>Lun – Sáb: 8am – 8pm</span>
              </li>
              <li className="mt-4">
                <a
                  href="https://wa.me/18492763532?text=Hola!%20Quiero%20hacer%20un%20pedido%20en%20VitaGloss%20RD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                >
                  📲 Escribir ahora
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-3">
          <p>© 2026 VitaGloss RD. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link to="/privacidad" className="hover:text-secondary transition-colors">Política de Privacidad</Link>
            <span className="opacity-30">·</span>
            <Link to="/terminos" className="hover:text-secondary transition-colors">Términos de Uso</Link>
            <span className="opacity-30">·</span>
            <p>Distribuidor independiente Amway — No somos Amway Corp.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
