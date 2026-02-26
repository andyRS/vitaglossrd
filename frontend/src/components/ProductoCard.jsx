import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductoCard({ producto }) {
  const stockBajo = producto.stockUnidades && producto.stockUnidades <= 5
  const { addItem } = useCart()
  const [agregado, setAgregado] = useState(false)

  const handleAgregar = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(producto)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1800)
  }

  return (
    <Link
      to={`/producto/${producto.id}`}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border border-gray-100 hover:border-secondary hover:-translate-y-1"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      {/* Imagen */}
      <div className="relative bg-white flex items-center justify-center p-6" style={{ minHeight: '220px' }}>
        <span className={`absolute top-3 left-3 z-10 ${producto.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow`}>
          {producto.badge}
        </span>
        <span className={`absolute top-3 right-3 z-10 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${producto.disponible ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${producto.disponible ? 'bg-green-500' : 'bg-red-400'}`}></span>
          {producto.stock}
        </span>
        {/* Badge stock bajo */}
        {stockBajo && (
          <span className="absolute bottom-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow animate-pulse">
            🔥 Solo {producto.stockUnidades} disponibles
          </span>
        )}
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="h-44 w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="px-4 pb-5 pt-3 flex flex-col flex-1 border-t border-gray-50">
        <span className="text-xs text-secondary font-semibold uppercase tracking-wide mb-1">
          {producto.categoria}
        </span>
        <h3 className="text-dark font-bold text-base leading-snug mb-1 group-hover:text-primary transition-colors">
          {producto.nombre}
        </h3>
        <p className="text-gray-400 text-xs mb-3">Art. {producto.articulo}</p>
        <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2">
          {producto.descripcion}
        </p>

        {/* Rating */}
        {producto.rating && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, s) => (
                <span key={s} className={`text-sm ${s < Math.round(producto.rating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
              ))}
            </div>
            <span className="text-xs font-bold text-gray-600">{producto.rating}</span>
            <span className="text-xs text-gray-400">({producto.reviewCount})</span>
          </div>
        )}

        {/* Contador ventas */}
        {producto.ventasSemana && (
          <div className="flex items-center gap-1.5 text-xs text-orange-500 font-semibold mb-3">
            <span>🔥</span>
            <span>{producto.ventasSemana} personas compraron esta semana</span>
          </div>
        )}

        {/* Precio */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xl font-extrabold text-primary">RD${producto.precio.toLocaleString('es-DO', { minimumFractionDigits: producto.precio % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}</span>
          {producto.precioOriginal && (
            <>
              <span className="text-gray-300 text-xs line-through">RD${producto.precioOriginal.toLocaleString('es-DO')}</span>
              <span className="bg-red-100 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                -{Math.round(((producto.precioOriginal - producto.precio) / producto.precioOriginal) * 100)}%
              </span>
            </>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <span className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] sm:text-xs font-semibold px-2 sm:px-3 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-1 whitespace-nowrap">
            Ver más →
          </span>
          <button
            onClick={handleAgregar}
            className={`flex-1 text-white text-[11px] sm:text-xs font-bold px-2 sm:px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm ${
              agregado ? 'bg-green-600 scale-95' : 'bg-primary hover:bg-blue-800'
            }`}
          >
            {agregado ? (
              <><span>✓</span> ¡Agregado!</>
            ) : (
              <><svg className="w-3.5 h-3.5 fill-white flex-shrink-0" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke="white" strokeWidth="0" /></svg> Al carrito</>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}
