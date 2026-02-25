import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([]) // { id, nombre, precio, imagen, cantidad }
  const [open, setOpen] = useState(false)

  const addItem = useCallback((producto, cantidad = 1) => {
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id)
      if (existe) {
        return prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i)
      }
      return [...prev, {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagenes?.[0] ?? producto.imagen,
        cantidad,
      }]
    })
    setOpen(true)
  }, [])

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateCantidad = useCallback((id, cantidad) => {
    if (cantidad < 1) return
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
  const count = items.reduce((sum, i) => sum + i.cantidad, 0)

  const buildWhatsAppMsg = useCallback(() => {
    if (items.length === 0) return ''
    const lineas = items.map(i => `• *${i.nombre}* x${i.cantidad} — RD$${(i.precio * i.cantidad).toLocaleString()}`)
    const texto = [
      'Hola VitaGloss RD! 👋 Quiero hacer el siguiente pedido:',
      '',
      ...lineas,
      '',
      `💰 *Total: RD$${total.toLocaleString()}*`,
      '',
      '¿Cómo proceso el pago? ¡Gracias!',
    ].join('\n')
    return `https://wa.me/18492763532?text=${encodeURIComponent(texto)}`
  }, [items, total])

  return (
    <CartContext.Provider value={{ items, open, setOpen, addItem, removeItem, updateCantidad, clearCart, total, count, buildWhatsAppMsg }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
