import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

export default function CartDrawer() {
  const { items, open, setOpen, removeItem, updateCantidad, total, clearCart, buildWhatsAppMsg, count } = useCart()

  const handlePedir = () => {
    const url = buildWhatsAppMsg()
    if (url) {
      window.open(url, '_blank')
      clearCart()
      setOpen(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 z-[70] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[80] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛒</span>
                <h2 className="font-bold text-gray-800 text-lg">Mi Pedido</h2>
                {count > 0 && (
                  <span className="bg-secondary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar carrito"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-48 text-center"
                  >
                    <span className="text-5xl mb-3">🛍️</span>
                    <p className="text-gray-400 font-medium">Tu pedido está vacío</p>
                    <p className="text-gray-300 text-sm mt-1">Agrega productos desde el catálogo</p>
                  </motion.div>
                ) : (
                  items.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3"
                    >
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-14 h-14 object-contain rounded-xl bg-white border border-gray-100 p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.nombre}</p>
                        <p className="text-secondary font-bold text-sm">RD${(item.precio * item.cantidad).toLocaleString()}</p>
                        {/* Cantidad */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() => updateCantidad(item.id, item.cantidad - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs font-bold transition-colors flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">{item.cantidad}</span>
                          <button
                            onClick={() => updateCantidad(item.id, item.cantidad + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs font-bold transition-colors flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Eliminar del pedido"
                        className="text-red-300 hover:text-red-500 transition-colors text-lg flex-shrink-0"
                      >
                        🗑
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Total del pedido</span>
                  <span className="text-2xl font-black text-gray-800">RD${total.toLocaleString()}</span>
                </div>
                <button
                  onClick={handlePedir}
                  className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 text-base shadow-lg shadow-green-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.855L.057 23.169a.75.75 0 0 0 .921.921l5.314-1.474A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.516-5.162-1.415l-.371-.219-3.843 1.067 1.067-3.843-.219-.371A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  Pedir por WhatsApp
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-gray-400 hover:text-gray-600 text-sm py-1 transition-colors"
                >
                  Vaciar pedido
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
