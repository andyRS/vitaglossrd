const router = require('express').Router()
const Sale = require('../models/Sale')
const Lead = require('../models/Lead')
const protect = require('../middleware/auth')

router.use(protect)

// ── GET /api/dashboard — Estadísticas del vendedor o global (admin) ───────
router.get('/', async (req, res) => {
  try {
    const esAdmin = req.user.rol === 'admin'
    const vendedorFilter = esAdmin ? {} : { vendedor: req.user._id }

    // Fecha inicio del mes actual
    const ahora = new Date()
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)
    const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0)

    // Ventas del mes actual
    const ventasMes = await Sale.find({
      ...vendedorFilter,
      fecha: { $gte: inicioMes },
      estado: { $ne: 'cancelado' },
    })

    // Ventas del mes anterior (para comparación)
    const ventasMesAnterior = await Sale.find({
      ...vendedorFilter,
      fecha: { $gte: inicioMesAnterior, $lte: finMesAnterior },
      estado: { $ne: 'cancelado' },
    })

    // Todas las ventas (total histórico)
    const todasVentas = await Sale.find({
      ...vendedorFilter,
      estado: { $ne: 'cancelado' },
    })

    // Leads
    const totalLeads = await Lead.countDocuments(vendedorFilter)
    const leadsNuevos = await Lead.countDocuments({ ...vendedorFilter, estado: 'nuevo' })
    const leadsCerrados = await Lead.countDocuments({ ...vendedorFilter, estado: 'cerrado' })

    // Últimas 5 ventas
    const ultimasVentas = await Sale.find(vendedorFilter)
      .sort({ fecha: -1 })
      .limit(5)
      .populate('vendedor', 'nombre')

    // Últimos 5 leads
    const ultimosLeads = await Lead.find(vendedorFilter)
      .sort({ createdAt: -1 })
      .limit(5)

    // Calcular totales
    const totalMes = ventasMes.reduce((acc, v) => acc + v.total, 0)
    const totalMesAnterior = ventasMesAnterior.reduce((acc, v) => acc + v.total, 0)
    const totalHistorico = todasVentas.reduce((acc, v) => acc + v.total, 0)
    const crecimiento = totalMesAnterior > 0
      ? (((totalMes - totalMesAnterior) / totalMesAnterior) * 100).toFixed(1)
      : null

    // Progreso hacia meta mensual
    const meta = req.user.metaMensual || 10000
    const progreso = Math.min((totalMes / meta) * 100, 100).toFixed(1)

    // Ventas por producto (mes actual)
    const porProducto = {}
    ventasMes.forEach(v => {
      v.productos.forEach(p => {
        if (!porProducto[p.nombre]) porProducto[p.nombre] = { unidades: 0, total: 0 }
        porProducto[p.nombre].unidades += p.cantidad || 1
        porProducto[p.nombre].total += p.precio * (p.cantidad || 1)
      })
    })

    res.json({
      ventas: {
        totalMes,
        totalMesAnterior,
        crecimiento,
        totalHistorico,
        cantidadMes: ventasMes.length,
        progreso: parseFloat(progreso),
        meta,
        porProducto,
      },
      leads: {
        total: totalLeads,
        nuevos: leadsNuevos,
        cerrados: leadsCerrados,
        tasaConversion: totalLeads > 0 ? ((leadsCerrados / totalLeads) * 100).toFixed(1) : '0.0',
      },
      ultimos: {
        ventas: ultimasVentas,
        leads: ultimosLeads,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener estadísticas.' })
  }
})

module.exports = router
