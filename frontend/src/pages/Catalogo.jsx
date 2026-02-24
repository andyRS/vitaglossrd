import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { productos } from '../data/productos'
import ProductoCard from '../components/ProductoCard'
import { useSEO } from '../hooks/useSEO'

const categorias = [
  { label: 'Todos', icono: '✨' },
  { label: 'Salud Bucal', icono: '🦷' },
  { label: 'Suplementos', icono: '💊' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' }
  })
}

export default function Catalogo() {
  useSEO({
    title: 'Catálogo de Productos',
    description: 'Explora los productos Amway originales en VitaGloss RD: Pasta Dental Glister™, Vitamina C Nutrilite™, Spray y Enjuague Bucal. Envío a todo RD.',
  })
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')

  const productosFiltrados = categoriaActiva === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary via-blue-800 to-blue-900 text-white pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4"
          >
            Distribuidor Amway RD
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black mb-4"
          >
            Nuestro Catálogo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-xl mx-auto"
          >
            Productos Amway originales para tu salud bucal y bienestar. Con envío a domicilio en toda República Dominicana.
          </motion.p>
        </div>
      </div>

      {/* Filtros sticky */}
      <div className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex gap-3 overflow-x-auto">
          {categorias.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setCategoriaActiva(cat.label)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                categoriaActiva === cat.label
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{cat.icono}</span>
              <span>{cat.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${categoriaActiva === cat.label ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {cat.label === 'Todos' ? productos.length : productos.filter(p => p.categoria === cat.label).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={categoriaActiva}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {productosFiltrados.map((p, i) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={i}
              >
                <ProductoCard producto={p} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {productosFiltrados.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-xl font-semibold">No hay productos en esta categoría aún.</p>
          </div>
        )}
      </div>

      {/* Banner WhatsApp */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-xl shadow-green-200"
        >
          <div>
            <h3 className="text-2xl font-black mb-1">¿No encuentras lo que buscas?</h3>
            <p className="text-green-100">Tenemos acceso a todos los productos Amway. Consúltanos por WhatsApp.</p>
          </div>
          <a
            href="https://wa.me/18492763532?text=Hola!%20Busco%20un%20producto%20que%20no%20encuentro%20en%20el%20cat%C3%A1logo"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-2xl font-bold transition-all duration-200 hover:scale-105 shadow-lg whitespace-nowrap flex items-center gap-2"
          >
            📲 Consultar ahora
          </a>
        </motion.div>
      </div>
    </div>
  )
}
