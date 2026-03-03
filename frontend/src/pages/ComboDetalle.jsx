import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { combos } from '../data/combos'
import { useSEO } from '../hooks/useSEO'

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function ComboDetalle() {
  const { id } = useParams()
  const combo = combos.find(c => c.id === id)
  const [imgErrors, setImgErrors] = useState({})

  useSEO({
    title: combo?.nombre ?? 'Kit',
    description: combo?.descripcion ?? 'Kit de productos Amway originales en VitaGloss RD.',
  })

  if (!combo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24">
        <span className="text-6xl mb-4">🔍</span>
        <h2 className="text-2xl font-bold text-primary mb-2">Kit no encontrado</h2>
        <p className="text-gray-500 mb-6">El kit que buscas no existe o fue removido.</p>
        <Link to="/combos" className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors">
          Ver todos los kits
        </Link>
      </div>
    )
  }

  const otros = combos.filter(c => c.id !== combo.id).slice(0, 3)
  const descuento = Math.round(((combo.precioNormal - combo.precioCombo) / combo.precioNormal) * 100)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero header */}
      <div className={`bg-gradient-to-br ${combo.color} pt-20 pb-0 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

        {/* Breadcrumb */}
        <div className="relative max-w-6xl mx-auto px-6 pt-6 pb-0 flex items-center gap-2 text-sm text-white/60 flex-wrap">
          <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
          <span className="text-white/30">/</span>
          <Link to="/combos" className="hover:text-white transition-colors">Combos</Link>
          <span className="text-white/30">/</span>
          <span className="text-white/90 truncate">{combo.nombre}</span>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`inline-block ${combo.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
              {combo.badge}
            </span>
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {combo.categoria}
            </span>
            <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{descuento}% OFF
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-2">
            {combo.nombre}
          </h1>
          <p className="text-white/75 text-lg max-w-2xl">{combo.subtitulo}</p>
        </div>

        {/* Imágenes de productos — franja inferior del hero */}
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex gap-3 overflow-x-auto pb-0" style={{ scrollbarWidth: 'none' }}>
            {combo.productos.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex-shrink-0 w-28 sm:w-36 h-28 sm:h-36 bg-white rounded-2xl shadow-xl flex items-center justify-center p-3 -mb-8"
              >
                {imgErrors[i] ? (
                  <span className="text-4xl">💊</span>
                ) : (
                  <img
                    src={p.img}
                    alt={p.nombre}
                    className="w-full h-full object-contain"
                    onError={() => setImgErrors(prev => ({ ...prev, [i]: true }))}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ===== Columna izquierda (2/3) ===== */}
          <div className="lg:col-span-2 space-y-8">

            {/* Descripción */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Sobre este kit</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{combo.descripcionLarga}</p>
            </div>

            {/* Beneficios */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">¿Por qué elegir este kit?</h2>
              <ul className="space-y-0 rounded-xl border border-gray-100 overflow-hidden">
                {combo.beneficios.map((b, i, arr) => (
                  <li
                    key={i}
                    className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''} ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`}
                  >
                    <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckIcon />
                    </span>
                    <span className="text-gray-800 text-sm font-medium">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Productos incluidos — tarjetas detalladas */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Productos incluidos
                <span className="ml-2 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {combo.productos.length} productos
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {combo.productos.map((p, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gray-50 p-4 flex items-center justify-center h-36">
                      {imgErrors[`card-${i}`] ? (
                        <span className="text-5xl">💊</span>
                      ) : (
                        <img
                          src={p.img}
                          alt={p.nombre}
                          className="h-full w-full object-contain"
                          onError={() => setImgErrors(prev => ({ ...prev, [`card-${i}`]: true }))}
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-gray-900 text-sm leading-tight mb-1">{p.nombre}</p>
                      <p className="text-gray-400 text-xs mb-2">{p.cantidad}</p>
                      <p className="text-primary font-black text-base">RD${p.precio.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ===== Columna derecha (1/3) sticky ===== */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Precio y ahorro */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Precio normal</span>
                  <span className="text-gray-300 line-through text-sm">RD${combo.precioNormal.toLocaleString()}</span>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-4xl font-black text-gray-900">
                    RD${combo.precioCombo.toLocaleString()}
                  </span>
                  <span className="text-red-500 font-bold text-sm mb-1">-{descuento}%</span>
                </div>
                <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 mb-5">
                  <span className="text-green-700 text-sm font-semibold">Ahorras</span>
                  <span className="text-green-700 font-black text-lg">RD${combo.ahorro.toLocaleString()}</span>
                </div>

                {/* Desglose */}
                <div className="space-y-1.5 mb-5">
                  {combo.productos.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 truncate mr-2">{p.nombre}</span>
                      <span className="text-gray-400 flex-shrink-0">RD${p.precio.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-dashed border-gray-100 pt-2 mt-2 flex items-center justify-between text-sm font-bold">
                    <span className="text-primary">Kit completo</span>
                    <span className="text-primary">RD${combo.precioCombo.toLocaleString()}</span>
                  </div>
                </div>

                {/* Botón WhatsApp */}
                <a
                  href={`https://wa.me/18492763532?text=${combo.whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-green-100"
                >
                  <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Pedir este kit
                </a>
                <p className="text-center text-xs text-gray-400 mt-2">Te respondemos de inmediato</p>
              </div>

              {/* Garantías */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    <span>Garantía de satisfacción 30 días</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                    </svg>
                    <span>Envío a todo el país</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                    </svg>
                    <span>Distribuidor autorizado Amway RD</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Otros kits */}
        {otros.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Otros kits que te pueden interesar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {otros.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={`/combos/${c.id}`}
                    className="block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
                  >
                    <div className={`bg-gradient-to-r ${c.color} p-4 text-white`}>
                      <p className="text-xs font-bold opacity-75 mb-1">{c.categoria}</p>
                      <p className="font-black leading-tight">{c.nombre}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{c.descripcion}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-primary font-black">RD${c.precioCombo.toLocaleString()}</p>
                          <p className="text-xs text-green-600 font-semibold">Ahorras RD${c.ahorro.toLocaleString()}</p>
                        </div>
                        <span className="text-primary text-sm font-bold group-hover:underline">Ver kit →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="text-center mt-10">
          <Link to="/combos" className="text-gray-400 hover:text-primary text-sm font-semibold transition-colors">
            ← Ver todos los kits
          </Link>
        </div>
      </div>
    </div>
  )
}
