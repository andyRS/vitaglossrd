/**
 * Catálogo compacto de productos VitaGloss RD — usado por la IA.
 * Precios en RD$ (pesos dominicanos).
 */

const PRODUCTOS = [
  { id: 1,  nombre: 'Pasta Dental Glister',               categoria: 'Salud Bucal',     precio: 899,    url: 'https://vitaglossrd.vercel.app/catalogo/1',  desc: 'Pasta dental con flúor y menta Nutrilite™. 200g, hasta 198 usos. Previene caries y blanquea.' },
  { id: 2,  nombre: 'Spray Bucal Glister',                categoria: 'Salud Bucal',     precio: 820,    url: 'https://vitaglossrd.vercel.app/catalogo/2',  desc: 'Refresca el aliento instantáneamente. 14ml, 223 usos, sin aerosol.' },
  { id: 3,  nombre: 'Enjuague Bucal Glister',             categoria: 'Salud Bucal',     precio: 1169,   url: 'https://vitaglossrd.vercel.app/catalogo/3',  desc: 'Concentrado de acción múltiple sin alcohol. 100 usos por botella.' },
  { id: 4,  nombre: 'Vitamina C Nutrilite',               categoria: 'Vitaminas',       precio: 1099,   url: 'https://vitaglossrd.vercel.app/catalogo/4',  desc: 'Vitamina C con bioflavonoides cítricos. Refuerza el sistema inmune.' },
  { id: 5,  nombre: 'Concentrado Frutas y Verduras',      categoria: 'Vitaminas',       precio: 3052,   url: 'https://vitaglossrd.vercel.app/catalogo/5',  desc: 'Extracto concentrado de frutas y verduras Nutrilite™.' },
  { id: 6,  nombre: 'Double X 31 días',                   categoria: 'Vitaminas',       precio: 4040,   url: 'https://vitaglossrd.vercel.app/catalogo/6',  desc: 'Multivitamínico premium de 31 días con 12 vitaminas, 10 minerales y 22 extractos vegetales.' },
  { id: 7,  nombre: 'Double X 10 días',                   categoria: 'Vitaminas',       precio: 1960,   url: 'https://vitaglossrd.vercel.app/catalogo/7',  desc: 'Multivitamínico Double X. Suministro de 10 días para iniciarse.' },
  { id: 8,  nombre: 'Multivitamínico Niños',              categoria: 'Vitaminas',       precio: 1100,   url: 'https://vitaglossrd.vercel.app/catalogo/8',  desc: 'Vitaminas para niños con nutrientes esenciales para su crecimiento.' },
  { id: 9,  nombre: 'Ácido Fólico Nutrilite',             categoria: 'Vitaminas',       precio: 1350,   url: 'https://vitaglossrd.vercel.app/catalogo/9',  desc: 'Ácido fólico esencial, especialmente recomendado para embarazadas.' },
  { id: 10, nombre: 'Cal Mag D Nutrilite',                categoria: 'Vitaminas',       precio: 1270,   url: 'https://vitaglossrd.vercel.app/catalogo/10', desc: 'Calcio, magnesio y vitamina D para huesos y músculos sanos.' },
  { id: 11, nombre: 'Defensa Inmunológica con Zinc',      categoria: 'Vitaminas',       precio: 1600,   url: 'https://vitaglossrd.vercel.app/catalogo/11', desc: 'Refuerza el sistema inmune con zinc y vitaminas.' },
  { id: 12, nombre: 'Fibra en Polvo Nutrilite',           categoria: 'Nutrición',       precio: 2370,   url: 'https://vitaglossrd.vercel.app/catalogo/12', desc: 'Fibra dietética en polvo. Mejora la digestión y el tránsito intestinal.' },
  { id: 13, nombre: 'Slimmetry Nutrilite',                categoria: 'Nutrición',       precio: 2340,   url: 'https://vitaglossrd.vercel.app/catalogo/13', desc: 'Suplemento para control de peso y metabolismo.' },
  { id: 14, nombre: 'Vitamina E Masticable',              categoria: 'Vitaminas',       precio: 3140,   url: 'https://vitaglossrd.vercel.app/catalogo/14', desc: 'Vitamina E masticable, antioxidante poderoso.' },
  { id: 15, nombre: 'Glucosamina Nutrilite',              categoria: 'Articulaciones',  precio: 2470,   url: 'https://vitaglossrd.vercel.app/catalogo/15', desc: 'Glucosamina para la salud articular y cartílago.' },
  { id: 16, nombre: 'Vitamina B Doble Acción',            categoria: 'Vitaminas',       precio: 1290,   url: 'https://vitaglossrd.vercel.app/catalogo/16', desc: 'Complejo de vitaminas B de liberación extendida para energía y sistema nervioso.' },
  { id: 17, nombre: 'Vitamina D Nutrilite',               categoria: 'Vitaminas',       precio: 1560,   url: 'https://vitaglossrd.vercel.app/catalogo/17', desc: 'Vitamina D3 para huesos, inmunidad y bienestar general.' },
  { id: 18, nombre: 'Omega-3 Nutrilite',                  categoria: 'Corazón',         precio: 2050,   url: 'https://vitaglossrd.vercel.app/catalogo/18', desc: 'Ácidos grasos Omega-3 EPA y DHA para el corazón y el cerebro.' },
  { id: 19, nombre: 'Pelo Piel y Uñas',                   categoria: 'Belleza',         precio: 1700,   url: 'https://vitaglossrd.vercel.app/catalogo/19', desc: 'Biotina, vitaminas y minerales para cabello fuerte, piel radiante y uñas sanas.' },
  { id: 20, nombre: 'Proteína Vegetal Nutrilite',         categoria: 'Nutrición',       precio: 3500,   url: 'https://vitaglossrd.vercel.app/catalogo/20', desc: 'Proteína en polvo 100% vegetal. 23g de proteína por porción.' },
  { id: 21, nombre: 'Kit Envejecimiento Saludable',       categoria: 'Kits',            precio: 7730,   url: 'https://vitaglossrd.vercel.app/catalogo/21', desc: 'Kit completo anti-envejecimiento: antioxidantes, Omega-3 y Double X.' },
  { id: 22, nombre: 'Solución Nutrición Diaria',          categoria: 'Kits',            precio: 8718,   url: 'https://vitaglossrd.vercel.app/catalogo/22', desc: 'Kit de nutrición completa para el día a día.' },
  { id: 23, nombre: 'CLA 500 Nutrilite',                  categoria: 'Nutrición',       precio: 3402,   url: 'https://vitaglossrd.vercel.app/catalogo/23', desc: 'Ácido linoleico conjugado (CLA) para composición corporal.' },
  { id: 24, nombre: 'Picolinato de Cromo',                categoria: 'Nutrición',       precio: 1823,   url: 'https://vitaglossrd.vercel.app/catalogo/24', desc: 'Cromo para el metabolismo de carbohidratos y control del azúcar.' },
  { id: 25, nombre: 'Espectro Multicaroteno',             categoria: 'Vitaminas',       precio: 2550,   url: 'https://vitaglossrd.vercel.app/catalogo/25', desc: 'Carotenoides naturales para la visión y la piel.' },
  { id: 26, nombre: 'Diario Nutrilite',                   categoria: 'Vitaminas',       precio: 1035,   url: 'https://vitaglossrd.vercel.app/catalogo/26', desc: 'Multivitamínico diario básico. Ideal para comenzar.' },
  { id: 27, nombre: 'Magnesio Nutrilite',                 categoria: 'Vitaminas',       precio: 2350,   url: 'https://vitaglossrd.vercel.app/catalogo/27', desc: 'Magnesio para músculos, huesos y sistema nervioso.' },
  { id: 28, nombre: 'Nutrilite Cerocarb',                 categoria: 'Nutrición',       precio: 1600,   url: 'https://vitaglossrd.vercel.app/catalogo/28', desc: 'Bloqueador de carbohidratos y grasas. Apoya el control de peso.' },
]

/**
 * Genera el contexto de catálogo para la IA.
 */
function buildCatalogContext() {
  const lines = PRODUCTOS.map(p =>
    `• ${p.nombre} (${p.categoria}) — RD$${p.precio.toLocaleString()} | ${p.desc} | Ver: ${p.url}`
  )
  return lines.join('\n')
}

/**
 * Busca productos por nombre parcial (para respuestas rápidas sin IA).
 */
function buscarProducto(query) {
  const q = query.toLowerCase()
  return PRODUCTOS.filter(p =>
    p.nombre.toLowerCase().includes(q) ||
    p.categoria.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q)
  )
}

module.exports = { PRODUCTOS, buildCatalogContext, buscarProducto }
