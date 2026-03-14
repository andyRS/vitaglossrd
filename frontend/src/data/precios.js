// ============================================================
//  PRECIOS CENTRALIZADOS — edita SOLO este archivo para
//  actualizar precios en el catálogo y en los combos/kits.
//
//  precioOriginal = precio marketing con 35% descuento (tachado).
//  Fórmula: Math.round(precio / 0.65)
//
//  Para actualizar: cambia el valor de "precio" y recalcula
//  precioOriginal = Math.round(precio / 0.65)
// ============================================================

// ── PRODUCTOS INDIVIDUALES ──────────────────────────────────
// { precio: RD$, precioOriginal: RD$ tachado (precio / 0.65) }

export const PRECIOS = {
  //  id   nombre                               precio  precioOriginal
   1: { precio:    899, precioOriginal:  1383 }, // Pasta Dental Glister
   2: { precio:    820, precioOriginal:  1262 }, // Spray Bucal Glister
   3: { precio:   1169, precioOriginal:  1799 }, // Enjuague Bucal Glister
   4: { precio:   1099, precioOriginal:  1691 }, // Vitamina C Nutrilite
   5: { precio: 3052.35,precioOriginal:  4695 }, // Concentrado Frutas y Verduras
   6: { precio:   4040, precioOriginal:  6215 }, // Double X Reemplazo 31 días
   7: { precio:   1960, precioOriginal:  3015 }, // Double X Suministro 10 días
   8: { precio:   1400, precioOriginal:  1692 }, // Multivitamínico Niños
   9: { precio:   1350, precioOriginal:  2077 }, // Ácido Fólico Nutrilite
  10: { precio:   1270, precioOriginal:  1954 }, // Cal Mag D Nutrilite
  11: { precio:   1600, precioOriginal:  2462 }, // Defensa Inmunológica Zinc
  12: { precio:   2370, precioOriginal:  3646 }, // Fibra en Polvo Nutrilite
  13: { precio:   2340, precioOriginal:  3600 }, // Slimmetry Nutrilite
  14: { precio:   3140, precioOriginal:  4831 }, // Vitamina E Masticable
  15: { precio:   2470, precioOriginal:  3800 }, // Glucosamina Nutrilite
  16: { precio:   1290, precioOriginal:  1985 }, // Vitamina B Doble Acción
  17: { precio:   1560, precioOriginal:  2400 }, // Vitamina D Nutrilite
  18: { precio:   2050, precioOriginal:  3154 }, // Omega Nutrilite
  19: { precio:   1700, precioOriginal:  2615 }, // Pelo Piel y Uñas
  20: { precio:   3500, precioOriginal:  5385 }, // Proteína Vegetal
  21: { precio:   7730, precioOriginal: 11892 }, // Kit Envejecimiento Saludable
  22: { precio:   8718, precioOriginal: 13412 }, // Solución Nutrición Diaria
  23: { precio:   3402, precioOriginal:  5234 }, // CLA 500 Nutrilite
  24: { precio:   1823, precioOriginal:  2805 }, // Picolinato de Cromo
  25: { precio:   2550, precioOriginal:  3923 }, // Espectro Multicaroteno
  26: { precio:   1035, precioOriginal:  1592 }, // Diario Nutrilite
  27: { precio:   2350, precioOriginal:  3615 }, // Magnesio Nutrilite
  28: { precio:   1600, precioOriginal:  2462 }, // Nutrilite™ Cerocarb
  29: { precio:   3200, precioOriginal:  4923 }, // Serenoa Repens y Raíz de Ortiga
  30: { precio:   3200, precioOriginal:  4923 }, // XS Energy + Focus
  31: { precio:   2500, precioOriginal:  3846 }, // Bebida Energizante XS Jugo Burbujeante
}

// ── PRECIOS DE COMBOS/KITS ──────────────────────────────────
// precioCombo = precio final del bundle (decisión de negocio)
// precioNormal se calcula automáticamente como suma de productos.
// Para actualizar: cambia solo precioCombo.

export const COMBO_PRECIOS = {
  'kit-glister-completo':      { precioCombo: 2590 },  // productos: 1+3+2 = 2,888 normal
  'kit-inmunidad-total':       { precioCombo: 3770 },  // productos: 4+17+11 = 4,259 normal
  'kit-energia-vitalidad':     { precioCombo: 4720 },  // productos: 7+16+18 = 5,300 normal
  'kit-figura-saludable':      { precioCombo: 7420 },  // productos: 13+20+12 = 8,210 normal
  'kit-belleza-total':         { precioCombo: 5340 },  // productos: 19+14+4 = 5,939 normal
  'kit-huesos-articulaciones': { precioCombo: 4750 },  // productos: 10+15+17 = 5,300 normal
  'kit-bienestar-familiar':    { precioCombo: 2750 },  // productos: 1+4+8 = 3,098 normal
}
