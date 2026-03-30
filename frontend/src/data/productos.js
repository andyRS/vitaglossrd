import { PRECIOS } from './precios.js'

export const productos = [
  {
    id: 1,
    nombre: "Pasta Dental Glister",
    nombreCorto: "Glister™ Pasta Dental con Flúor de Acción Múltiple",
    categoria: "Salud Bucal",
    articulo: "124106SP",
    ...PRECIOS[1],
    pv: 2.59,
    bv: 369.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 5,
    ventasSemana: 12,
    descripcion: "Pasta dental con flúor y menta certificada Nutrilite™. Previene caries, elimina placa, blanquea y refresca el aliento. Cada tubo de 200 g rinde hasta 198 usos.",
    descripcionLarga: "La Pasta Dental con Flúor de Acción Múltiple Glister™ limpia los dientes de forma efectiva, ya sea que te guste el café o el té. El cepillado regular ayuda a eliminar la placa que causa caries y manchas para dejarte una sonrisa reluciente.\n\nCon flúor poderoso e ingredientes basados en plantas — un agente pulidor de sílice y menta certificada Nutrilite™ — te encantará desde el primer uso. No altera tu microbioma oral y su fórmula no contiene parabenos, alcohol, peróxido, azúcar ni ingredientes de origen animal.\n\nCada tubo de 200 g rinde hasta 198 usos. Certificación Kosher.",
    beneficios: [
      "Previene las caries con flúor de sodio conforme a normas FDA",
      "Ayuda a eliminar la placa con un cepillado regular",
      "Limpia de forma segura y ayuda a blanquear eliminando manchas del esmalte",
      "Promueve encías saludables como parte del sistema Glister™",
      "No altera tu microbioma oral",
      "Refresca el aliento con menta certificada Nutrilite™",
      "Protege y fortalece el esmalte dental",
      "Sin parabenos, alcohol, peróxido, azúcar ni ingredientes de origen animal",
      "Tapa abatible conveniente — hasta 198 usos por tubo de 200 g"
    ],
    instrucciones: [
      "Adultos y niños mayores de 2 años: cepilla los dientes a profundidad al menos 2 veces al día, o según indicación de un dentista.",
      "Para adultos: usa una cantidad del tamaño de un guisante en cada cepillado.",
      "Niños de 2 a 6 años: usa solo la cantidad del tamaño de un guisante y supervisa el cepillado y enjuague para minimizar la ingestión.",
      "Niños menores de 2 años: consulta a un dentista o doctor antes de usar.",
      "Mantener fuera del alcance de niños menores de 6 años.",
      "Si accidentalmente ingieren más de la cantidad para cepillado, busca ayuda médica inmediatamente."
    ],
    faqs: [
      {
        pregunta: "¿Por qué debería usar la Pasta Dental Glister™?",
        respuesta: "Ayuda a reducir las manchas en el esmalte para una sonrisa más blanca y brillante, previene caries gracias al flúor, y tiene un sabor inigualable gracias a la menta certificada Nutrilite™. ¡Ninguna otra marca de pasta dental contiene menta certificada Nutrilite™!"
      },
      {
        pregunta: "¿Cómo ayuda a blanquear los dientes?",
        respuesta: "La principal acción blanqueadora es limpiar y pulir las manchas de la superficie de los dientes mediante el agente pulidor de sílice, un ingrediente suave de origen natural."
      },
      {
        pregunta: "¿Elimina la placa?",
        respuesta: "Sí, el cepillado regular con la Pasta Dental Glister™ elimina la placa y, por lo tanto, ayuda a minimizar su acumulación en los dientes."
      },
      {
        pregunta: "¿Es concentrada? ¿Cuánta debo usar?",
        respuesta: "No es concentrada, está lista para usar. Sin embargo, no necesitas mucha: para adultos se recomienda una cantidad del tamaño de un guisante en cada uso."
      },
      {
        pregunta: "¿Funciona en dientes sensibles?",
        respuesta: "Limpia efectivamente y protege contra caries, pero no está especialmente formulada para dientes sensibles. Si tienes sensibilidad, consulta a tu dentista para el tratamiento adecuado."
      },
      {
        pregunta: "¿Contiene flúor?",
        respuesta: "Sí. Contiene fluoruro de sodio al 0.21%, conforme a las normas y reglamentos de la FDA."
      },
      {
        pregunta: "¿Qué es la marca negra en la parte posterior del tubo?",
        respuesta: "Se llama 'imark', una marca de empaque que ayuda a la máquina a identificar la parte superior del tubo durante el proceso de llenado en fábrica. No afecta el producto."
      }
    ],
    detalles: [
      { label: "Contenido", valor: "200 g" },
      { label: "Rendimiento", valor: "Hasta 198 usos" },
      { label: "Sabor", valor: "Menta certificada Nutrilite™" },
      { label: "Flúor", valor: "Fluoruro de sodio 0.21%" },
      { label: "Uso", valor: "Mín. 2 veces al día" },
      { label: "Pulidor", valor: "Sílice (origen natural)" },
      { label: "Sin", valor: "Parabenos · Alcohol · Peróxido" },
      { label: "Certificación", valor: "Kosher" },
      { label: "Artículo", valor: "124106SP" }
    ],
    imagenes: [
      "/124106SP-690px-01.webp",
      "/124106SP-690px-02.webp",
      "/124106SP-690px-03.webp",
      "/124106SP-690px-04.webp"
    ],
    imagen: "/124106SP-690px-01.webp",
    imagen400w: "/124106SP-400w.webp",
    rating: 4.8,
    reviewCount: 47,
    usosPorEnvase: 198,
    badge: "Más vendido",
    badgeColor: "bg-secondary"
  },
  {
    id: 2,
    nombre: "Spray Bucal Glister",
    nombreCorto: "Glister™ Refrescante Bucal en Spray Menta",
    categoria: "Salud Bucal",
    articulo: "124111",
    ...PRECIOS[2],
    pv: 2.21,
    bv: 315.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 8,
    ventasSemana: 7,
    descripcion: "Refresca tu aliento al instante con menta certificada Nutrilite™. Portátil, sin aerosol, hasta 223 usos por envase. Ideal para llevar a cualquier lugar.",
    descripcionLarga: "El Refrescante Bucal en Spray Glister™ Menta refresca tu aliento al instante — en cualquier momento y cualquier lugar. Con menta certificada Nutrilite™, este miniproducto esencial es la solución perfecta para mantener la frescura durante todo el día.\n\nSu diseño portátil cabe en cualquier bolsillo o cartera. Rociador de bomba sin aerosol, seguro y preciso. Cada envase rinde hasta 223 usos.\n\nFórmula sin colorantes artificiales, azúcar, parabenos ni ingredientes de origen animal.",
    beneficios: [
      "Refresca el aliento al instante en cualquier lugar",
      "Brinda frescura duradera con menta certificada Nutrilite™",
      "Tamaño portátil conveniente — cabe en cualquier bolsillo o cartera",
      "Mezcla de menta exclusiva",
      "Hasta 223 usos por envase de 14 ml",
      "Sin aerosol — rociador de bomba seguro y preciso",
      "Sin colorantes artificiales, azúcar ni parabenos",
      "Sin ingredientes de origen animal"
    ],
    instrucciones: [
      "Mantén el envase en posición vertical.",
      "Rocía directamente en la boca con una sola aplicación.",
      "Una aplicación/rocío proporciona la cantidad justa de frescura para toda la boca.",
      "Úsalo cuando necesites refrescar el aliento al instante.",
      "Si se rocía accidentalmente en el ojo, enjuágalo con agua."
    ],
    faqs: [
      {
        pregunta: "¿El Spray Glister™ contiene alcohol?",
        respuesta: "Sí, contiene alcohol etílico, que ayuda a disolver los ingredientes activos de la fórmula para una efectividad máxima al aplicarlo."
      },
      {
        pregunta: "¿Cuánta cantidad se debe usar a la vez?",
        respuesta: "El envase está diseñado para que cada aplicación/rocío proporcione la cantidad justa de frescura para toda la boca. Solo necesitas una aplicación por uso."
      },
      {
        pregunta: "¿Qué pasa si lo ingiero accidentalmente?",
        respuesta: "El spray está diseñado para uso oral y es seguro si se ingiere accidentalmente. Si se rocía en el ojo, enjuágalo inmediatamente con agua."
      },
      {
        pregunta: "¿Qué representa el sello de trazabilidad Amway?",
        respuesta: "Significa que el producto cumple con los rigurosos requisitos de trazabilidad de Amway, desde registros detallados de ingredientes hasta los proveedores de materias primas."
      }
    ],
    detalles: [
      { label: "Contenido", valor: "14 ml" },
      { label: "Rendimiento", valor: "Hasta 223 usos" },
      { label: "Sabor", valor: "Menta certificada Nutrilite™" },
      { label: "Uso", valor: "Cuando necesites" },
      { label: "Tipo", valor: "Rociador de bomba (sin aerosol)" },
      { label: "Sin", valor: "Colorantes · Azúcar · Parabenos" },
      { label: "Artículo", valor: "124111" },
      { label: "Origen", valor: "Sin ingredientes animales" }
    ],
    imagenes: [
      "/124111-690px-01.webp",
      "/124111-690px-02.webp",
      "/124111-690px-03.webp",
      "/124111-690px-04.webp"
    ],
    imagen: "/124111-690px-01.webp",
    imagen400w: "/124111-400w.webp",
    rating: 4.7,
    reviewCount: 23,
    usosPorEnvase: 223,
    badge: "Nuevo",
    badgeColor: "bg-green-700"
  },
  {
    id: 3,
    nombre: "Enjuague Bucal Glister",
    nombreCorto: "Glister™ Enjuague Bucal de Acción Múltiple Concentrado",
    categoria: "Salud Bucal",
    articulo: "124108",
    ...PRECIOS[3],
    pv: 4.42,
    bv: 630.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 4,
    ventasSemana: 9,
    descripcion: "Enjuague bucal concentrado con sabor a menta certificada Nutrilite™. Fórmula de acción múltiple que remueve placa, elimina bacterias y ofrece aliento fresco de larga duración.",
    descripcionLarga: "El Enjuague Bucal de Acción Múltiple Glister™ concentrado, sabor menta certificada Nutrilite™, ofrece una frescura de larga duración que va mucho más allá del cepillado. El 96% de los consumidores confirmó que refresca el aliento de forma notoria.\n\nÚsalo después del cepillado para limpiar entre los dientes, remover la placa y eliminar las bacterias que causan el mal aliento. Su fórmula concentrada rinde hasta 100 usos por botella con el dosificador y vaso mezclador integrados.\n\nSin alcohol, colorantes artificiales, peróxido, azúcar, parabenos, SLS ni ingredientes de origen animal. Apto para veganos. Certificación Kosher.",
    beneficios: [
      "Ayuda a remover más placa que solo el cepillado al usarse después de él",
      "Limpia entre los dientes y remueve bacterias que causan mal aliento",
      "Fórmula concentrada: hasta 100 usos por botella",
      "Empaque conveniente en tamaño de viaje con dosificador y vaso mezclador",
      "Brinda aliento fresco de larga duración",
      "No altera el microbioma oral",
      "Sin alcohol, colorantes artificiales, peróxido, azúcar, parabenos ni SLS",
      "Sin ingredientes de origen animal — apto para veganos"
    ],
    instrucciones: [
      "Usa el enjuague después del cepillado y el hilo dental, no antes.",
      "Libera 4 dosis de concentrado en la tapa (el vaso mezclador integrado).",
      "Llena la tapa de agua hasta la segunda línea / línea media (20 ml).",
      "Mezcla suavemente y enjuaga la boca durante 30 segundos.",
      "Repite una vez por la mañana y otra por la noche.",
      "Escupe el líquido. No ingieras el enjuague."
    ],
    faqs: [
      {
        pregunta: "¿El Enjuague Bucal Glister™ ayuda a remover la placa?",
        respuesta: "Sí. Usar un enjuague bucal después del cepillado puede ayudar a remover mejor la placa que solo el cepillado. Además, el Enjuague Bucal de Acción Múltiple Glister™ ayuda a limpiar entre los dientes."
      },
      {
        pregunta: "¿Debo usarlo antes o después del cepillado?",
        respuesta: "Debe usarse después del cepillado y el hilo dental para mayor efectividad en la remoción de placa y bacterias."
      },
      {
        pregunta: "¿Debo diluirlo con agua?",
        respuesta: "¡Sí! Es una fórmula altamente concentrada. Al diluirla siguiendo las instrucciones del vaso mezclador integrado en la tapa, obtienes hasta 100 usos por botella."
      },
      {
        pregunta: "¿Contiene alcohol?",
        respuesta: "No. La fórmula no contiene alcohol, lo que lo hace suave con las encías y adecuado para uso diario sin resecar la mucosa oral."
      }
    ],
    detalles: [
      { label: "Contenido", valor: "72 mL / 2.4 fl. oz." },
      { label: "Rendimiento", valor: "Hasta 100 usos" },
      { label: "Sabor", valor: "Menta certificada Nutrilite™" },
      { label: "Uso", valor: "2 veces al día" },
      { label: "Tipo", valor: "Concentrado" },
      { label: "Sin", valor: "Alcohol · SLS · Parabenos" },
      { label: "Artículo", valor: "124108" },
      { label: "Certificación", valor: "Kosher" }
    ],
    imagenes: [
      "/124108-690px-01.webp",
      "/124108-690px-02.webp",
      "/124108-690px-03.webp"
    ],
    imagen: "/124108-690px-01.webp",
    imagen400w: "/124108-400w.webp",
    rating: 4.9,
    reviewCount: 38,
    usosPorEnvase: 100,
    badge: "Premium",
    badgeColor: "bg-primary"
  },
  {
    id: 4,
    nombre: "Vitamina C Nutrilite",
    nombreCorto: "Nutrilite™ Vitamina C de Acción Prolongada",
    categoria: "Vitaminas",
    articulo: "109741CO",
    ...PRECIOS[4],
    pv: 4.09,
    bv: 585.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 6,
    ventasSemana: 15,
    descripcion: "Suplemento de Vitamina C de acción prolongada con 250 mg derivado de cerezas acerola. Apoya tu sistema inmunológico con liberación gradual durante 8 horas.",
    descripcionLarga: "La Vitamina C de Acción Prolongada Nutrilite™ proporciona 250 mg derivados de plantas para apoyar el sistema inmunológico durante todo el día. Elaborada con cerezas acerola — una de las fuentes naturales más concentradas de vitamina C — cultivadas en las granjas propias de Nutrilite™.\n\nSu fórmula de liberación lenta actúa de forma constante durante 8 horas para maximizar la utilización del nutriente. Una ración diaria equivale a más vitamina C que 7 naranjas, 16 limones o 6 toronjas.\n\nSin lactosa, fructosa, colorantes, conservantes ni edulcorantes artificiales. Certificado NSF, Kosher y Halal.",
    beneficios: [
      "Apoya el sistema inmunológico todo el día con 250 mg de Vitamina C",
      "Elaborado con cerezas acerola, una de las fuentes naturales más concentradas de Vitamina C",
      "Liberación lenta y constante durante 8 horas para mejor utilización del nutriente",
      "Contiene fitonutrientes con protección antioxidante contra radicales libres",
      "Equivale a más Vitamina C que 7 naranjas, 16 limones o 6 toronjas por ración",
      "Fácil de ingerir, ideal para estómagos sensibles",
      "Sin lactosa, fructosa, saborizantes, colorantes, conservantes ni edulcorantes",
      "Certificado NSF, Kosher y Halal"
    ],
    instrucciones: [
      "Toma 1 comprimido al día con un vaso de agua.",
      "Preferiblemente con las comidas para mejor absorción.",
      "No exceder la dosis diaria recomendada.",
      "Consulta a tu médico si eres diabético o tienes alguna condición médica.",
      "No apto para niños menores de 12 años, mujeres embarazadas o en periodo de lactancia.",
      "Mantener fuera del alcance de los niños."
    ],
    faqs: [
      {
        pregunta: "¿Cómo funciona la Vitamina C de Acción Prolongada Nutrilite™?",
        respuesta: "Todos los ingredientes se mezclan con un ingrediente fibroso para formar el comprimido. Al tragarlo, se humedece en el estómago y el ingrediente fibroso se expande formando una red. El comprimido libera gradualmente los ingredientes clave por difusión controlada a través de esa red mientras viaja por el intestino delgado, a una proporción lenta y constante hasta disolverse por completo."
      },
      {
        pregunta: "¿Es adecuada para personas vegetarianas?",
        respuesta: "Sí, este producto es adecuado para personas vegetarianas. Los diabéticos y toda persona con una condición médica deben consultar a un médico antes de usar. No está diseñado para mujeres embarazadas o en lactancia ni para niños menores de 12 años."
      },
      {
        pregunta: "¿Por qué se considera derivada de plantas?",
        respuesta: "Además del ácido ascórbico, incluye vitamina C natural de cerezas acerola en combinación con antioxidantes naturales de bioflavonoides cítricos de limones, naranjas y toronjas. Los 120 mg de polvo de acerola contribuyen con 30 mg de vitamina C natural por comprimido — el 50% del consumo diario recomendado en EE. UU."
      },
      {
        pregunta: "¿Cuenta con certificación NSF? ¿Qué es?",
        respuesta: "Sí. La certificación NSF garantiza que la empresa cumple estrictas normas y procedimientos. Incluye pruebas de productos, análisis de materiales e inspecciones no anunciadas en planta. Es la garantía de que los productos cumplen normas estrictas para proteger la salud pública."
      },
      {
        pregunta: "¿Tiene certificación Kosher y Halal?",
        respuesta: "Sí, la Vitamina C de Acción Prolongada Nutrilite™ cuenta con certificación tanto Kosher como Halal."
      }
    ],
    detalles: [
      { label: "Contenido", valor: "60 comprimidos" },
      { label: "Vitamina C", valor: "250 mg por comprimido" },
      { label: "Uso", valor: "1 comprimido al día" },
      { label: "Acción", valor: "8 horas de liberación" },
      { label: "Origen", valor: "Derivado de plantas" },
      { label: "Certificaciones", valor: "NSF · Kosher · Halal" },
      { label: "Artículo", valor: "109741CO" },
      { label: "Apto para", valor: "Vegetarianos" }
    ],
    imagenes: [
      "/109741CO-690px-01.webp"
    ],
    imagen: "/109741CO-690px-01.webp",
    imagen400w: "/109741CO-400w.webp",
    rating: 4.9,
    reviewCount: 62,
    usosPorEnvase: 60,
    badge: "Natural",
    badgeColor: "bg-yellow-500"
  },
  {
    id: 5,
    nombre: "Nutrilite™ Concentrado de frutas y verduras",
    nombreCorto: "Nutrilite™ Concentrado de frutas y verduras",
    categoria: "Vitaminas",
    articulo: "109966CO",
    ...PRECIOS[5],
    pv: 11.00,
    bv: 1570.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 3,
    ventasSemana: 8,
    descripcion: "Nuestra multivitamina más avanzada. 22 vitaminas y minerales + 22 nutrientes de frutas, verduras y hierbas. Más de 40 nutrientes para apoyar corazón, cerebro, huesos, ojos, inmunidad, piel, energía y vitalidad. Suministro para 31 días.",
    descripcionLarga: "Nuestra multivitamina más avanzada. Impulsado por las propiedades de las plantas, creado para ti.\n\nContiene 22 vitaminas y minerales — vitaminas de la A a la E, calcio, zinc, magnesio, selenio y más — junto a 22 nutrientes de frutas, verduras y hierbas cultivadas en las granjas propias Nutrilite™. Más de 40 nutrientes en total para apoyar corazón, cerebro, huesos, ojos, inmunidad, piel, energía, envejecimiento saludable y vitalidad.\n\nCertificado Halal, Kosher y NSF Contents Certified. Suministro para 31 días.",
    beneficios: [
      "Salud del cerebro — apoya función cerebral saludable con vitaminas E, B6, B12 y folato",
      "Salud del corazón — vitaminas B (B6 y B12), E y minerales como ácido fólico y selenio",
      "Energía — cinco vitaminas B (tiamina, riboflavina, niacina, biotina y ác. pantoténico)",
      "Salud inmunológica — 200 mg de vitamina C, 800 IU de vitamina D3 y 100% VD de zinc",
      "Salud de los ojos — vitamina A y luteína de flor de caléndula para la salud visual",
      "Salud de los huesos — 8 vitaminas y minerales para huesos fuertes (calcio, magnesio, cobre, zinc, manganeso, vitaminas D, C y A)",
      "Salud de la piel — vitaminas A, C, biotina y niacina para una piel saludable",
      "Salud celular — vitamina E, ácido pantoténico y selenio apoyan la función normal de las células",
      "22 nutrientes de plantas cultivadas en granjas propias Nutrilite™",
      "Certificado Halal, Kosher y NSF Contents Certified"
    ],
    instrucciones: [
      "Toma una tableta multivitamínica, una multimineral y una de fitonutriente dos veces al día con las comidas.",
      "Se recomiendan por la mañana y por la noche, siempre con alimentos.",
      "Los niños menores de 12 años, mujeres embarazadas o en lactancia deben consultar a su médico antes de consumir.",
      "Mantener fuera del alcance de los niños.",
      "No exceder la dosis diaria recomendada."
    ],
    advertencia: "Los niños menores de 12 años, las mujeres embarazadas o que amamantan, o cualquier persona que padezca una enfermedad deben consultar con su médico antes de consumir este producto. Mantener fuera del alcance de los niños.",
    faqs: [
      {
        pregunta: "¿Qué es un fitonutriente y por qué hay tantos en el suplemento Double X™?",
        respuesta: "Los fitonutrientes son compuestos químicos naturales en las plantas y defienden contra el estrés ambiental. La marca Nutrilite™ los incluye en sus fórmulas debido a sus beneficios en los seres humanos. Los fitonutrientes de los 22 concentrados de plantas del Double X™ brindan protección antioxidante amplia y específica, ayudando a que tu cuerpo se defienda contra el exceso de radicales libres que causan estrés oxidativo."
      },
      {
        pregunta: "¿Por qué son importantes los antioxidantes?",
        respuesta: "Nuestro cuerpo necesita radicales libres, pero demasiados causarían estrés oxidativo, resultando en daño celular y envejecimiento. Para contrarrestar esto, nuestro cuerpo procesa antioxidantes para equilibrar los radicales libres. Mantener ese equilibrio es clave para nuestro ecosistema interno y la salud óptima."
      },
      {
        pregunta: "¿Qué es la certificación NSF contenido?",
        respuesta: "Elegir un producto certificado por NSF significa que la empresa cumple con normas y procedimientos estrictos: pruebas extensas de productos, análisis de materiales e inspecciones a instalaciones sin previo aviso. Es la garantía de que los productos cumplen normas estrictas para proteger la salud pública."
      },
      {
        pregunta: "¿Double X™ de Nutrilite™ tiene certificación Kosher?",
        respuesta: "Sí, el suplemento Double X™ de Nutrilite™ cuenta con certificación Kosher."
      },
      {
        pregunta: "¿Double X™ de Nutrilite™ tiene certificación Halal?",
        respuesta: "Sí, el suplemento Double X™ de Nutrilite™ cuenta con certificación Halal."
      }
    ],
    detalles: [
      { label: "Contenido", valor: "Suministro para 31 días" },
      { label: "Vitaminas", valor: "22 vitaminas y minerales" },
      { label: "Nutrientes", valor: "22 de frutas, verduras y hierbas" },
      { label: "Total nutrientes", valor: "Más de 40" },
      { label: "Uso", valor: "3 tabletas × 2 veces al día" },
      { label: "Origen", valor: "Base de plantas · Granjas Nutrilite™" },
      { label: "Certificaciones", valor: "NSF · Kosher · Halal" },
      { label: "Artículo", valor: "109966CO" }
    ],
    certificaciones: [
      { nombre: "Halal", descripcion: "Halal" },
      { nombre: "Kosher", descripcion: "Certificación Kosher" },
      { nombre: "NSF", descripcion: "Certificación de contenido NSF" }
    ],
    imagenes: [
      "/128032-690px-01.webp"
    ],
    imagen: "/128032-690px-01.webp",
    rating: 4.9,
    reviewCount: 41,
    usosPorEnvase: 31,
    badge: "Premium",
    badgeColor: "bg-purple-600"
  },
  {
    id: 6,
    nombre: "Double X Reemplazo 31 días",
    nombreCorto: "Multivitamina Double X de Nutrilite – Reemplazo para 31 días",
    categoria: "Vitaminas",
    articulo: "A4300DR",
    ...PRECIOS[6],
    pv: 20.93,
    bv: 2992.5,
    disponible: true,
    stock: "En stock",
    stockUnidades: 5,
    ventasSemana: 10,
    descripcion: "Recarga de Multivitamina Double X™ de Nutrilite para suministro de 31 días. Más de 40 nutrientes: 22 vitaminas y minerales + 22 nutrientes de plantas. Apoya corazón, cerebro, huesos, inmunidad, energía y más.",
    descripcionLarga: "El paquete de reemplazo Double X™ de Nutrilite™ te permite continuar tu rutina de salud sin interrupciones. Con más de 40 nutrientes esenciales en una sola fórmula, es la multivitamina más completa disponible.\n\nIncluye 22 vitaminas y minerales más 22 concentrados de plantas cultivadas en las granjas propias Nutrilite™, diseñados para apoyar corazón, cerebro, huesos, inmunidad, energía y vitalidad celular.\n\nCertificado Halal, Kosher y NSF. Suministro para 31 días.",
    beneficios: [
      "Más de 40 nutrientes en una sola fórmula integral",
      "22 vitaminas y minerales esenciales",
      "22 nutrientes de frutas, verduras y hierbas de granjas Nutrilite™",
      "Apoya salud del corazón, cerebro, huesos, ojos e inmunidad",
      "Fórmula de base vegetal",
      "Certificado NSF, Kosher y Halal"
    ],
    instrucciones: [
      "Toma una tableta multivitamínica, una multimineral y una de fitonutriente dos veces al día con las comidas.",
      "Preferiblemente por la mañana y por la noche.",
      "No exceder la dosis diaria recomendada.",
      "Mantener fuera del alcance de los niños."
    ],
    faqs: [],
    detalles: [
      { label: "Contenido", valor: "Suministro para 31 días" },
      { label: "Vitaminas", valor: "22 vitaminas y minerales" },
      { label: "Nutrientes planta", valor: "22 concentrados" },
      { label: "Uso", valor: "3 tabletas × 2 veces al día" },
      { label: "Certificaciones", valor: "NSF · Kosher · Halal" },
      { label: "Artículo", valor: "A4300DR" }
    ],
    imagenes: ["/Multivitamina Double X de Nutrilite – Reemplazo para 31 días.webp"],
    imagen: "/Multivitamina Double X de Nutrilite – Reemplazo para 31 días.webp",
    rating: 4.9,
    reviewCount: 35,
    usosPorEnvase: 31,
    badge: "Reemplazo",
    badgeColor: "bg-blue-600"
  },
  {
    id: 7,
    nombre: "Double X Suministro 10 días",
    nombreCorto: "Multivitamina Double X de Nutrilite – Suministro para 10 días",
    categoria: "Vitaminas",
    articulo: "123364DR",
    ...PRECIOS[7],
    pv: 8.49,
    bv: 1215.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 8,
    ventasSemana: 14,
    descripcion: "Paquete de inicio de Multivitamina Double X™ de Nutrilite para 10 días. Ideal para probar la fórmula más completa de vitaminas y minerales con base de plantas.",
    descripcionLarga: "El suministro para 10 días de Double X™ de Nutrilite™ es la opción ideal para comenzar a experimentar la multivitamina más completa de Amway antes de comprometerte con el suministro mensual.\n\nEn solo 10 días recibirás más de 40 nutrientes esenciales: 22 vitaminas y minerales más 22 concentrados de plantas de granjas propias Nutrilite™, diseñados para apoyar tu bienestar integral.\n\nCertificado NSF, Kosher y Halal.",
    beneficios: [
      "Formato de inicio: ideal para probar Double X™ por primera vez",
      "Más de 40 nutrientes en 10 días de suministro",
      "22 vitaminas y minerales esenciales",
      "22 nutrientes de plantas de granjas Nutrilite™",
      "Certificado NSF, Kosher y Halal"
    ],
    instrucciones: [
      "Toma una tableta multivitamínica, una multimineral y una de fitonutriente dos veces al día con las comidas.",
      "No exceder la dosis diaria recomendada.",
      "Mantener fuera del alcance de los niños."
    ],
    faqs: [],
    detalles: [
      { label: "Contenido", valor: "Suministro para 10 días" },
      { label: "Vitaminas", valor: "22 vitaminas y minerales" },
      { label: "Nutrientes planta", valor: "22 concentrados" },
      { label: "Uso", valor: "3 tabletas × 2 veces al día" },
      { label: "Certificaciones", valor: "NSF · Kosher · Halal" },
      { label: "Artículo", valor: "123364DR" }
    ],
    imagenes: ["/Multivitamina Double X de Nutrilite – Suministro para 10 días.webp"],
    imagen: "/Multivitamina Double X de Nutrilite – Suministro para 10 días.webp",
    rating: 4.8,
    reviewCount: 28,
    usosPorEnvase: 10,
    badge: "Inicio",
    badgeColor: "bg-green-700"
  },
  {
    id: 8,
    nombre: "Multivitamínico Niños Nutrilite",
    nombreCorto: "Multivitamínico diario para niños Nutrilite™",
    categoria: "Vitaminas",
    articulo: "123043CO",
    ...PRECIOS[8],
    pv: 5.66,
    bv: 810.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 7,
    ventasSemana: 18,
    descripcion: "Vitaminas diarias para niños con base en plantas. Apoya el crecimiento, el sistema inmunológico y el desarrollo saludable. Fórmula masticable con sabores naturales.",
    descripcionLarga: "El Multivitamínico Diario para Niños Nutrilite™ está formulado especialmente para apoyar el crecimiento y desarrollo saludable de los más pequeños desde los 2 años. Con vitaminas y minerales esenciales de base vegetal en una presentación masticable que los niños amarán.\n\nApoya el sistema inmunológico, los huesos y la salud general durante las etapas clave del desarrollo. Sin colorantes artificiales ni edulcorantes para una opción limpia y segura.\n\nDisponible en tabletas masticables con sabores naturales. 60 comprimidos por envase.",
    beneficios: [
      "Fórmula diseñada específicamente para niños",
      "Vitaminas y minerales de base vegetal",
      "Apoya el sistema inmunológico y el crecimiento",
      "Sabor agradable, fácil de masticar",
      "Sin colorantes artificiales ni edulcorantes"
    ],
    instrucciones: [
      "Niños de 2 a 3 años: 1 tableta masticable al día.",
      "Niños de 4 años en adelante: 2 tabletas masticables al día.",
      "Masticar bien antes de tragar.",
      "Supervisar a niños pequeños durante el consumo.",
      "Mantener fuera del alcance de los niños pequeños."
    ],
    faqs: [],
    detalles: [
      { label: "Edad recomendada", valor: "2 años en adelante" },
      { label: "Forma", valor: "Tableta masticable" },
      { label: "Origen", valor: "Base de plantas" },
      { label: "Contenido", valor: "60 comprimidos" },
      { label: "Sin", valor: "Colorantes y edulcorantes artificiales" },
      { label: "Artículo", valor: "123043CO" }
    ],
    imagenes: ["/Multivitamínico diario para niños Nutrilite.webp"],
    imagen: "/Multivitamínico diario para niños Nutrilite.webp",
    rating: 5.0,
    reviewCount: 13,
    usosPorEnvase: 60,
    badge: "Niños",
    badgeColor: "bg-orange-400"
  },
  {
    id: 9,
    nombre: "Ácido Fólico Nutrilite",
    nombreCorto: "Nutrilite™ Ácido Fólico",
    categoria: "Vitaminas",
    articulo: "102046",
    ...PRECIOS[9],
    pv: 5.35,
    bv: 765.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 6,
    ventasSemana: 11,
    descripcion: "Suplemento de ácido fólico (vitamina B9) de Nutrilite. Esencial para el desarrollo celular, la salud cardiovascular y especialmente recomendado para mujeres en etapa reproductiva.",
    descripcionLarga: "El Ácido Fólico Nutrilite™ proporciona folato (vitamina B9), fundamental para la producción de ADN y el correcto desarrollo celular. Es uno de los suplementos más recomendados para mujeres en etapa reproductiva y durante el embarazo.\n\nTambién contribuye a la salud cardiovascular al apoyar los niveles normales de homocisteína, y favorece el funcionamiento saludable del sistema nervioso.\n\nFormulado con la calidad certificada de Nutrilite™ y libre de aditivos innecesarios.",
    beneficios: [
      "Apoya la producción saludable de ADN y células",
      "Esencial durante el embarazo para el desarrollo del bebé",
      "Contribuye a la salud cardiovascular",
      "Apoya el funcionamiento del sistema nervioso",
      "Formulado con la calidad Nutrilite™"
    ],
    instrucciones: [
      "Toma 1 tableta al día con un vaso de agua.",
      "Preferiblemente con las comidas.",
      "Las mujeres embarazadas deben consultar a su médico antes de usar.",
      "No exceder la dosis diaria recomendada."
    ],
    faqs: [],
    detalles: [
      { label: "Nutriente principal", valor: "Ácido fólico (vitamina B9)" },
      { label: "Uso", valor: "1 tableta al día" },
      { label: "Recomendado para", valor: "Mujeres en etapa reproductiva" },
      { label: "Artículo", valor: "102046" }
    ],
    imagenes: ["/acido-folico.webp"],
    imagen: "/acido-folico.webp",
    rating: 4.7,
    reviewCount: 29,
    usosPorEnvase: 90,
    badge: "Esencial",
    badgeColor: "bg-pink-500"
  },
  {
    id: 10,
    nombre: "Cal Mag D Nutrilite",
    nombreCorto: "Nutrilite™ Cal Mag D – Calcio, Magnesio y Vitamina D",
    categoria: "Vitaminas",
    articulo: "110609CO",
    ...PRECIOS[10],
    pv: 4.91,
    bv: 702.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 5,
    ventasSemana: 13,
    descripcion: "Fórmula triple de Calcio, Magnesio y Vitamina D de Nutrilite. Refuerza huesos y dientes, apoya la función muscular y mejora la absorción de calcio gracias a la vitamina D.",
    descripcionLarga: "Cal Mag D de Nutrilite™ combina tres nutrientes esenciales en una sola fórmula potente: calcio, magnesio y vitamina D3. El calcio y el magnesio son los pilares de la salud ósea, mientras que la vitamina D3 activa su absorción eficiente en el organismo.\n\nJuntos, estos tres nutrientes fortalecen huesos y dientes, regulan la función muscular y ayudan a prevenir la pérdida ósea con el paso del tiempo.\n\nFórmula de base vegetal con la calidad y respaldo científico de Nutrilite™.",
    beneficios: [
      "Fortalece huesos y dientes con calcio y magnesio",
      "La vitamina D3 mejora la absorción del calcio",
      "Apoya la función muscular normal",
      "Ayuda a prevenir la pérdida ósea",
      "Fórmula triple de acción combinada",
      "Calidad Nutrilite™ de base vegetal"
    ],
    instrucciones: [
      "Toma 2 tabletas al día con un vaso de agua.",
      "Preferiblemente con las comidas para mejor absorción.",
      "No exceder la dosis diaria recomendada.",
      "Mantener fuera del alcance de los niños."
    ],
    faqs: [],
    detalles: [
      { label: "Nutrientes", valor: "Calcio + Magnesio + Vitamina D3" },
      { label: "Uso", valor: "2 tabletas al día" },
      { label: "Beneficio principal", valor: "Salud ósea" },
      { label: "Artículo", valor: "110609CO" }
    ],
    imagenes: ["/Nutrilite Cal Mag D-transparente.webp"],
    imagen: "/Nutrilite Cal Mag D-transparente.webp",
    rating: 4.8,
    reviewCount: 31,
    usosPorEnvase: 90,
    badge: "Huesos",
    badgeColor: "bg-sky-500"
  },
  {
    id: 11,
    nombre: "Defensa Inmunológica Zinc Nutrilite",
    nombreCorto: "Nutrilite™ Defensa inmunológica Zinc + Albahaca Sagrada",
    categoria: "Vitaminas",
    articulo: "NUTRI-ZINC",
    ...PRECIOS[11],
    pv: 2.52,
    bv: 359.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 6,
    ventasSemana: 16,
    descripcion: "Suplemento de zinc con albahaca sagrada de Nutrilite. Refuerza el sistema inmunológico, apoya la respuesta natural del organismo ante enfermedades y contribuye a la salud celular.",
    descripcionLarga: "La fórmula Defensa Inmunológica de Nutrilite™ combina zinc con extracto de albahaca sagrada (Tulsi), una planta reconocida por sus propiedades adaptógenas e inmunomoduladoras en la medicina tradicional y la ciencia moderna.\n\nEl zinc es un mineral esencial para el correcto funcionamiento del sistema inmune, la cicatrización de heridas y la síntesis de proteínas. Juntos forman una combinación única de mineral y planta funcional diseñada para fortalecer tus defensas naturales.\n\nCalidad certificada Nutrilite™ con ingredientes de base vegetal.",
    beneficios: [
      "Refuerza el sistema inmunológico con zinc",
      "Albahaca sagrada con propiedades adaptógenas",
      "Apoya la respuesta natural ante enfermedades",
      "Contribuye a la salud celular y la síntesis proteica",
      "Combinación única de mineral + planta funcional",
      "Calidad certificada Nutrilite™"
    ],
    instrucciones: [
      "Toma 1 tableta al día con un vaso de agua.",
      "Preferiblemente con las comidas.",
      "No exceder la dosis diaria recomendada.",
      "Consulta a tu médico si tomas otros medicamentos."
    ],
    faqs: [],
    detalles: [
      { label: "Ingrediente activo", valor: "Zinc + Albahaca Sagrada" },
      { label: "Uso", valor: "1 tableta al día" },
      { label: "Beneficio principal", valor: "Sistema inmunológico" },
      { label: "Artículo", valor: "NUTRI-ZINC" }
    ],
    imagenes: ["/nutrilite-zinc-defensa-inmunologica.webp"],
    imagen: "/nutrilite-zinc-defensa-inmunologica.webp",
    rating: 4.7,
    reviewCount: 24,
    usosPorEnvase: 60,
    badge: "Inmunidad",
    badgeColor: "bg-emerald-500"
  },
  {
    id: 12,
    nombre: "Fibra en Polvo Nutrilite",
    nombreCorto: "Nutrilite™ Fibra en Polvo",
    categoria: "Vitaminas",
    articulo: "NUTRI-FIBRA",
    ...PRECIOS[12],
    pv: 3.06,
    bv: 437.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 4,
    ventasSemana: 12,
    descripcion: "Suplemento de fibra soluble en polvo de Nutrilite. Apoya la salud digestiva, regula el tránsito intestinal, ayuda a controlar el colesterol y favorece la sensación de saciedad.",
    descripcionLarga: "La Fibra en Polvo Nutrilite™ es una fuente concentrada de fibra dietética soluble de origen vegetal diseñada para apoyar el correcto funcionamiento del sistema digestivo. Se disuelve fácilmente en agua o cualquier bebida sin alterar su sabor.\n\nAyuda a regular los niveles de colesterol y glucosa en sangre, favorece el tránsito intestinal y contribuye a la sensación de saciedad — ideal como apoyo en el control de peso.\n\nDe origen 100% vegetal, sin sabor artificial. Fácil de incorporar a tu rutina diaria.",
    beneficios: [
      "Apoya la salud digestiva y el tránsito intestinal",
      "Ayuda a reducir niveles de colesterol",
      "Contribuye al control de glucosa en sangre",
      "Favorece la sensación de saciedad",
      "Se disuelve fácilmente sin alterar sabores",
      "De origen vegetal, sin sabor artificial"
    ],
    instrucciones: [
      "Mezcla 1 porción en un vaso de agua u otra bebida.",
      "Agita o revuelve bien hasta disolver.",
      "Consume 1 a 3 veces al día, preferiblemente antes de las comidas.",
      "Aumenta el consumo de agua al tomar este suplemento."
    ],
    faqs: [],
    detalles: [
      { label: "Tipo", valor: "Fibra soluble en polvo" },
      { label: "Uso", valor: "1-3 veces al día" },
      { label: "Origen", valor: "Base vegetal" },
      { label: "Sin", valor: "Sabor artificial" },
      { label: "Artículo", valor: "NUTRI-FIBRA" }
    ],
    imagenes: ["/Nutrilite Fibra en polvo-transparente.webp"],
    imagen: "/Nutrilite Fibra en polvo-transparente.webp",
    rating: 4.6,
    reviewCount: 19,
    usosPorEnvase: 30,
    badge: "Digestivo",
    badgeColor: "bg-lime-600"
  },
  {
    id: 13,
    nombre: "Slimmetry Nutrilite",
    nombreCorto: "Nutrilite™ Slimmetry – Suplemento para Control de Peso",
    categoria: "Vitaminas",
    articulo: "117085",
    ...PRECIOS[13],
    pv: 10.95,
    bv: 1566.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 5,
    ventasSemana: 9,
    descripcion: "Suplemento nutricional Slimmetry de Nutrilite. Diseñado para apoyar el control de peso saludable, incrementar la sensación de saciedad y favorecer el metabolismo de grasas.",
    descripcionLarga: "Nutrilite™ Slimmetry es un suplemento formulado para acompañar un estilo de vida activo y apoyar el proceso de control de peso de manera saludable. Su combinación de ingredientes activos está diseñada para modular el apetito y favorecer el metabolismo de los lípidos.\n\nAyuda a incrementar la sensación de saciedad, lo que facilita mantener porciones adecuadas en cada comida. Ideal como complemento de una dieta equilibrada y actividad física regular.\n\nNo es un sustituto de comidas. Recomendado para adultos mayores de 18 años con supervisión médica.",
    beneficios: [
      "Apoya el control de peso saludable",
      "Incrementa la sensación de saciedad",
      "Favorece el metabolismo de grasas",
      "Complemento ideal para plan de alimentación balanceada",
      "Formulado con ingredientes de calidad Nutrilite™"
    ],
    instrucciones: [
      "Toma 2 tabletas antes de las comidas principales.",
      "Acompañar con una dieta equilibrada y ejercicio regular.",
      "No usar como sustituto de comidas.",
      "No recomendado para menores de 18 años, embarazadas o en lactancia.",
      "Consulta a tu médico antes de empezar."
    ],
    faqs: [],
    detalles: [
      { label: "Uso", valor: "2 tabletas antes de comidas" },
      { label: "Objetivo", valor: "Control de peso" },
      { label: "Recomendado para", valor: "Adultos mayores de 18 años" },
      { label: "Artículo", valor: "117085" }
    ],
    imagenes: ["/Nutrilite Suplemento nutricional Slimmetry Ideal para bajar de peso.webp"],
    imagen: "/Nutrilite Suplemento nutricional Slimmetry Ideal para bajar de peso.webp",
    rating: 4.5,
    reviewCount: 33,
    usosPorEnvase: 60,
    badge: "Peso",
    badgeColor: "bg-violet-500"
  },
  {
    id: 14,
    nombre: "Vitamina E Masticable Nutrilite",
    nombreCorto: "Nutrilite™ Vitamina E Masticable",
    categoria: "Vitaminas",
    articulo: "A4042",
    ...PRECIOS[14],
    pv: 14.63,
    bv: 2092.5,
    disponible: true,
    stock: "En stock",
    stockUnidades: 6,
    ventasSemana: 10,
    descripcion: "Vitamina E masticable de Nutrilite. Poderoso antioxidante que protege las células del daño oxidativo, apoya la salud de la piel, el corazón y el sistema inmunológico.",
    descripcionLarga: "La Vitamina E Masticable Nutrilite™ ofrece uno de los antioxidantes más potentes en una presentación cómoda y agradable, perfecta para quienes tienen dificultad para tragar tabletas convencionales.\n\nLa vitamina E protege a las células del daño causado por los radicales libres, apoya la salud cardiovascular y favorece una piel saludable y luminosa. También refuerza el sistema inmunológico y actúa como defensa antioxidante de amplio espectro.\n\nCalidad Nutrilite™ en formato masticable. 270 porciones por envase.",
    beneficios: [
      "Potente antioxidante: protege células del daño oxidativo",
      "Apoya la salud cardiovascular",
      "Favorece una piel sana y luminosa",
      "Refuerza el sistema inmunológico",
      "Presentación masticable, fácil de tomar",
      "Calidad Nutrilite™"
    ],
    instrucciones: [
      "Mastica 1 tableta al día.",
      "Puede tomarse en cualquier momento del día.",
      "No exceder la dosis diaria recomendada.",
      "Mantener fuera del alcance de los niños."
    ],
    faqs: [],
    detalles: [
      { label: "Nutriente principal", valor: "Vitamina E" },
      { label: "Forma", valor: "Tableta masticable" },
      { label: "Uso", valor: "1 tableta al día" },
      { label: "Beneficio principal", valor: "Antioxidante" },
      { label: "Artículo", valor: "A4042" }
    ],
    imagenes: ["/nutrilite-vitamina-e.webp"],
    imagen: "/nutrilite-vitamina-e.webp",
    rating: 4.9,
    reviewCount: 100,
    usosPorEnvase: 270,
    badge: "Antioxidante",
    badgeColor: "bg-amber-500"
  },
  {
    id: 15,
    nombre: "Glucosamina Nutrilite",
    nombreCorto: "Nutrilite™ Glucosamina – Suministro para 30 días",
    categoria: "Vitaminas",
    articulo: "104664",
    ...PRECIOS[15],
    pv: 12.27,
    bv: 1755.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 4,
    ventasSemana: 8,
    descripcion: "Glucosamina Nutrilite para la salud de las articulaciones. Suministro para 30 días. Apoya el cartílago, reduce la rigidez y mejora la movilidad articular.",
    descripcionLarga: "La Glucosamina Nutrilite™ es un suplemento esencial para mantener articulaciones sanas y móviles. La glucosamina es un componente natural del cartílago que ayuda a mantener su estructura y función a lo largo del tiempo.\n\nAyuda a reducir la rigidez articular, apoya la movilidad y la flexibilidad, y es especialmente recomendado para adultos activos y personas mayores que buscan cuidar sus articulaciones a largo plazo.\n\nSuministro para 30 días. Calidad Nutrilite™ con ingredientes de confianza.",
    beneficios: [
      "Apoya la salud y regeneración del cartílago",
      "Reduce la rigidez y el malestar articular",
      "Mejora la movilidad y flexibilidad",
      "Suministro para 30 días",
      "Ideal para adultos activos y mayores",
      "Calidad Nutrilite™"
    ],
    instrucciones: [
      "Toma 3 tabletas al día con agua.",
      "Preferiblemente con las comidas.",
      "Los resultados óptimos se observan después de uso continuo.",
      "Consulta a tu médico si tienes alergia a mariscos.",
      "Mantener fuera del alcance de los niños."
    ],
    faqs: [],
    detalles: [
      { label: "Contenido", valor: "Suministro para 30 días" },
      { label: "Ingrediente activo", valor: "Glucosamina" },
      { label: "Uso", valor: "3 tabletas al día" },
      { label: "Beneficio principal", valor: "Articulaciones" },
      { label: "Artículo", valor: "104664" }
    ],
    imagenes: ["/Nutrilite™ Glucosamina – Suministro para 30 días Articulaciones.jpg"],
    imagen: "/Nutrilite™ Glucosamina – Suministro para 30 días Articulaciones.jpg",
    rating: 5.0,
    reviewCount: 47,
    usosPorEnvase: 120,
    badge: "Articulaciones",
    badgeColor: "bg-teal-500"
  },
  {
    id: 16,
    nombre: "Vitamina B Doble Acción Nutrilite",
    nombreCorto: "Nutrilite™ Vitamina B de Acción Doble",
    categoria: "Vitaminas",
    articulo: "NUTRI-VITB",
    ...PRECIOS[16],
    pv: 2.70,
    bv: 385.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 7,
    ventasSemana: 11,
    descripcion: "Complejo de Vitamina B de acción doble de Nutrilite. Combinación de vitaminas del grupo B para apoyar la energía, la función nerviosa, el metabolismo y la salud mental.",
    descripcionLarga: "La Vitamina B de Acción Doble Nutrilite™ ofrece una fórmula completa del complejo B con liberación extendida, diseñada para una absorción óptima durante todo el día. Las vitaminas del grupo B son esenciales para la producción de energía a nivel celular.\n\nApoya el funcionamiento del sistema nervioso, favorece el metabolismo de carbohidratos, proteínas y grasas, y contribuye al mantenimiento de la salud mental y emocional. Su fórmula de acción doble garantiza una liberación constante.\n\nCalidad Nutrilite™. 1 tableta al día para una energía sostenida.",
    beneficios: [
      "Apoya la producción de energía celular",
      "Contribuye al funcionamiento del sistema nervioso",
      "Favorece el metabolismo de carbohidratos, proteínas y grasas",
      "Apoya la salud mental y emocional",
      "Acción doble para absorción extendida",
      "Calidad Nutrilite™"
    ],
    instrucciones: [
      "Toma 1 tableta al día con un vaso de agua.",
      "Preferiblemente con las comidas.",
      "No exceder la dosis diaria recomendada.",
      "Mantener fuera del alcance de los niños."
    ],
    faqs: [],
    detalles: [
      { label: "Nutriente principal", valor: "Complejo vitamina B" },
      { label: "Acción", valor: "Liberación extendida" },
      { label: "Uso", valor: "1 tableta al día" },
      { label: "Beneficio principal", valor: "Energía y sistema nervioso" },
      { label: "Artículo", valor: "NUTRI-VITB" }
    ],
    imagenes: ["/Nutrilite™-Vitamina-B-de-acción-doble.webp"],
    imagen: "/Nutrilite™-Vitamina-B-de-acción-doble.webp",
    rating: 4.7,
    reviewCount: 20,
    usosPorEnvase: 90,
    badge: "Energía",
    badgeColor: "bg-yellow-500"
  },
  {
    id: 17,
    nombre: "Vitamina D Nutrilite",
    nombreCorto: "Nutrilite™ Vitamina D",
    categoria: "Vitaminas",
    articulo: "118761CN",
    ...PRECIOS[17],
    pv: 6.45,
    bv: 922.5,
    disponible: true,
    stock: "En stock",
    stockUnidades: 8,
    ventasSemana: 20,
    descripcion: "Vitamina D3 de Nutrilite. Esencial para la absorción del calcio, la salud ósea, el sistema inmunológico fuerte y la regulación del estado de ánimo.",
    descripcionLarga: "La Vitamina D Nutrilite™ proporciona vitamina D3, la forma más biodisponible de esta vitamina fundamental para el organismo. Sin ella, el calcio no puede absorberse de manera eficiente, lo que compromete la salud ósea y muscular.\n\nEsencial para el mantenimiento de huesos y dientes fuertes, el correcto funcionamiento del sistema inmunológico y la regulación del estado de ánimo. Muchas personas presentan deficiencia por baja exposición solar.\n\nCalidad Nutrilite™. 1 tableta al día para corregir y mantener niveles óptimos.",
    beneficios: [
      "Mejora la absorción de calcio y fósforo",
      "Fortalece huesos y dientes",
      "Refuerza el sistema inmunológico",
      "Apoya la regulación del estado de ánimo",
      "Vitamina D3: la forma más biodisponible",
      "Calidad Nutrilite™"
    ],
    instrucciones: [
      "Toma 1 tableta al día con un vaso de agua.",
      "Preferiblemente con las comidas.",
      "No exceder la dosis diaria recomendada.",
      "Mantener fuera del alcance de los niños."
    ],
    faqs: [],
    detalles: [
      { label: "Nutriente principal", valor: "Vitamina D3" },
      { label: "Uso", valor: "1 tableta al día" },
      { label: "Beneficio principal", valor: "Huesos e inmunidad" },
      { label: "Artículo", valor: "118761CN" }
    ],
    imagenes: ["/Vitamina-D-transparente.webp"],
    imagen: "/Vitamina-D-transparente.webp",
    rating: 4.9,
    reviewCount: 18,
    usosPorEnvase: 90,
    badge: "Esencial",
    badgeColor: "bg-sky-400"
  },
  {
    id: 18,
    nombre: "Omega Nutrilite",
    nombreCorto: "Nutrilite™ Omega – Ácidos Grasos Esenciales",
    categoria: "Vitaminas",
    articulo: "126132",
    ...PRECIOS[18],
    pv: 8.49,
    bv: 1215.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 6,
    ventasSemana: 14,
    descripcion: "Suplemento de ácidos grasos omega de Nutrilite. Rico en omega-3 (EPA y DHA) para apoyar la salud cardiovascular, la función cerebral, la visión y reducir la inflamación.",
    descripcionLarga: "El Omega Nutrilite™ proporciona ácidos grasos esenciales EPA y DHA de alta calidad, derivados de aceite de pescado purificado de calidad farmacéutica. El cuerpo no puede producirlos por sí mismo, por lo que su suplementación es clave.\n\nSon fundamentales para la salud cardiovascular, contribuyen al mantenimiento de una función cerebral normal, apoyan la salud visual y ejercen propiedades antiinflamatorias naturales que benefician articulaciones y tejidos.\n\nCalidad Nutrilite™. Suministro para 30 días con 1-2 cápsulas al día.",
    beneficios: [
      "Apoya la salud cardiovascular con EPA y DHA",
      "Contribuye a la función cerebral normal",
      "Favorece la salud visual",
      "Propiedades antiinflamatorias naturales",
      "Aceite de pescado purificado de calidad superior",
      "Calidad Nutrilite™"
    ],
    instrucciones: [
      "Toma 1-2 cápsulas al día con un vaso de agua.",
      "Preferiblemente con las comidas para reducir reflujo.",
      "No exceder la dosis diaria recomendada.",
      "Consulta a tu médico si tomas anticoagulantes."
    ],
    faqs: [],
    detalles: [
      { label: "Ácidos grasos", valor: "EPA y DHA (Omega-3)" },
      { label: "Origen", valor: "Aceite de pescado purificado" },
      { label: "Uso", valor: "1-2 cápsulas al día" },
      { label: "Beneficio principal", valor: "Corazón y cerebro" },
      { label: "Artículo", valor: "126132" }
    ],
    imagenes: ["/omega-nutrilite.webp"],
    imagen: "/omega-nutrilite.webp",
    rating: 5.0,
    reviewCount: 38,
    usosPorEnvase: 30,
    badge: "Corazón",
    badgeColor: "bg-red-500"
  },
  {
    id: 19,
    nombre: "Pelo Piel y Uñas Nutrilite",
    nombreCorto: "Nutrilite™ Pelo, Piel y Uñas",
    categoria: "Vitaminas",
    articulo: "A7553",
    ...PRECIOS[19],
    pv: 7.87,
    bv: 1125.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 7,
    ventasSemana: 17,
    descripcion: "Suplemento Nutrilite para cabello, piel y uñas. Con biotina, zinc, vitamina C y otros nutrientes clave para fortalecer el cabello, mejorar la apariencia de la piel y endurecer las uñas.",
    descripcionLarga: "El suplemento Pelo, Piel y Uñas Nutrilite™ está formulado con una combinación de nutrientes específicamente seleccionados para apoyar la belleza desde adentro. La biotina contribuye al mantenimiento del cabello y las uñas, la vitamina C participa en la síntesis de colágeno para la piel, y el zinc apoya la salud de la dermis.\n\nCon uso continuo de 4 a 6 semanas empezarás a notar cabello más fuerte, piel más luminosa y uñas más duras. Una fórmula integral para lucir tu mejor versión.\n\nBase vegetal. Calidad Nutrilite™. 1 tableta al día.",
    beneficios: [
      "Fortalecer el cabello y reduce su caída",
      "Mejora la elasticidad y luminosidad de la piel",
      "Endurece y hace crecer las uñas",
      "Biotina, zinc y vitamina C de base vegetal",
      "Resultados visibles con uso continuo",
      "Calidad Nutrilite™"
    ],
    instrucciones: [
      "Toma 1 tableta al día con un vaso de agua.",
      "Preferiblemente con las comidas.",
      "Los resultados óptimos se observan después de uso continuo por al menos 4-6 semanas.",
      "Mantener fuera del alcance de los niños."
    ],
    faqs: [],
    detalles: [
      { label: "Ingredientes clave", valor: "Biotina + Zinc + Vitamina C" },
      { label: "Uso", valor: "1 tableta al día" },
      { label: "Resultados", valor: "A partir de 4-6 semanas" },
      { label: "Beneficio principal", valor: "Belleza desde adentro" },
      { label: "Artículo", valor: "A7553" }
    ],
    imagenes: ["/Pelo_-Piel-y-Uñas-Nutrilite.webp"],
    imagen: "/Pelo_-Piel-y-Uñas-Nutrilite.webp",
    rating: 5.0,
    reviewCount: 86,
    usosPorEnvase: 60,
    badge: "Belleza",
    badgeColor: "bg-rose-400"
  },
  {
    id: 20,
    nombre: "Proteína Vegetal Nutrilite",
    nombreCorto: "Nutrilite™ Proteína Vegetal en Polvo",
    categoria: "Vitaminas",
    articulo: "NUTRI-PROT",
    ...PRECIOS[20],
    pv: 5.22,
    bv: 745.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 5,
    ventasSemana: 9,
    descripcion: "Proteína vegetal en polvo de Nutrilite. Fuente de proteína completa de soya y trigo para apoyar el crecimiento muscular, la recuperación y un estilo de vida activo y saludable.",
    descripcionLarga: "La Proteína Vegetal en Polvo Nutrilite™ ofrece una fuente completa de proteínas de origen vegetal, derivada principalmente de concentrado de proteína de soya. Proporciona todos los aminoácidos esenciales para el crecimiento, la recuperación muscular y el mantenimiento de un estilo de vida activo.\n\nSin sabor artificial, se mezcla fácilmente con agua, leche o batidos. Bajo en grasas y azúcar, es una alternativa limpia y conveniente para cubrir tus requerimientos proteicos diarios.\n\nCalidad Nutrilite™. Suministro para 30 días.",
    beneficios: [
      "Fuente completa de proteína de origen vegetal",
      "Apoya el crecimiento y la recuperación muscular",
      "Todos los aminoácidos esenciales",
      "Sin sabor artificial, versatil para mezclar",
      "Bajo en grasas y azúcar",
      "Calidad Nutrilite™"
    ],
    instrucciones: [
      "Mezcla 1 porción (según indicación del envase) en agua, leche o tu batido favorito.",
      "Agita bien hasta obtener una mezcla homogénea.",
      "Consume 1-2 veces al día, idealmente antes o después del ejercicio.",
      "Mantener fuera del alcance de los niños."
    ],
    faqs: [],
    detalles: [
      { label: "Fuente de proteína", valor: "Soya y trigo" },
      { label: "Uso", valor: "1-2 porciones al día" },
      { label: "Sin", valor: "Sabor artificial" },
      { label: "Beneficio principal", valor: "Músculo y recuperación" },
      { label: "Artículo", valor: "NUTRI-PROT" }
    ],
    imagenes: ["/protenia-vegetal-transparente.webp"],
    imagen: "/protenia-vegetal-transparente.webp",
    rating: 4.7,
    reviewCount: 38,
    usosPorEnvase: 30,
    badge: "Proteína",
    badgeColor: "bg-green-600"
  },
  {
    id: 21,
    nombre: "Kit Envejecimiento Saludable",
    nombreCorto: "Solución de Envejecimiento Saludable – KIT Nutrilite",
    categoria: "Vitaminas",
    articulo: "NUTRI-AGING-KIT",
    ...PRECIOS[21],
    pv: 10.41,
    bv: 1486.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 3,
    ventasSemana: 5,
    descripcion: "Kit completo de suplementos Nutrilite para el envejecimiento saludable. Incluye fórmulas clave para apoyar la vitalidad, la salud celular, la piel y la energía a largo plazo.",
    descripcionLarga: "El Kit de Solución de Envejecimiento Saludable de Nutrilite™ reúne los suplementos más importantes para enfrentar el paso del tiempo con vitalidad y energía. Una solución integral diseñada para adultos mayores de 40 años.\n\nCombina fórmulas que apoyan la salud celular, la elasticidad de la piel, la función cognitiva, la energía sostenida y la salud cardiovascular — las áreas que más se ven afectadas con el envejecimiento.\n\nUso continuo para mejores resultados. Consulta a tu médico si tienes condiciones médicas preexistentes.",
    beneficios: [
      "Kit integral para el envejecimiento saludable",
      "Apoya la salud celular y la vitalidad",
      "Contribuye a la elasticidad y luminosidad de la piel",
      "Favorece la función cognitiva y la energía",
      "Apoya la salud cardiovascular",
      "Ideal para mayores de 40 años"
    ],
    instrucciones: [
      "Sigue las instrucciones de cada producto incluido en el kit.",
      "Para mejores resultados, úsalo de manera continua.",
      "Consulta a tu médico si tienes condiciones médicas preexistentes."
    ],
    faqs: [],
    detalles: [
      { label: "Tipo", valor: "Kit de suplementos" },
      { label: "Recomendado para", valor: "Adultos mayores de 40 años" },
      { label: "Objetivo", valor: "Envejecimiento saludable" },
      { label: "Artículo", valor: "NUTRI-AGING-KIT" }
    ],
    imagenes: ["/kit-envejecimiento-saludable.webp"],
    imagen: "/kit-envejecimiento-saludable.webp",
    rating: 4.9,
    reviewCount: 15,
    usosPorEnvase: 30,
    badge: "Kit",
    badgeColor: "bg-purple-500"
  },
  {
    id: 22,
    nombre: "Solución Nutrición Diaria",
    nombreCorto: "Solución de Nutrición Diaria – Kit Nutrilite",
    categoria: "Vitaminas",
    articulo: "324813",
    ...PRECIOS[22],
    pv: 45.15,
    bv: 6457.5,
    disponible: true,
    stock: "En stock",
    stockUnidades: 4,
    ventasSemana: 7,
    descripcion: "Kit de nutrición diaria Nutrilite. Solución completa con suplementos esenciales para cubrir los requerimientos nutricionales básicos del día a día con la calidad y respaldo de Nutrilite.",
    descripcionLarga: "La Solución de Nutrición Diaria Nutrilite™ es un kit diseñado para simplificar y optimizar tu rutina de suplementación sin complicaciones. Reúne los nutrientes más importantes para el bienestar diario en una sola solución práctica.\n\nIncluye vitaminas, minerales, antioxidantes y compuestos de origen vegetal que cubren las necesidades nutricionales básicas que la alimentación cotidiana muchas veces no puede proporcionar por sí sola.\n\nCon el respaldo científico de más de 90 años de Nutrilite™, la marca de suplementos más respetada y vendida en el mundo.",
    beneficios: [
      "Cubre las necesidades nutricionales básicas del día",
      "Kit completo con vitaminas, minerales y antioxidantes",
      "Solución práctica para la rutina diaria",
      "Ingredientes de base vegetal con calidad Nutrilite™",
      "Respaldo científico de la marca más reconocida en suplementos"
    ],
    instrucciones: [
      "Sigue las instrucciones de cada producto incluido en el kit.",
      "Para mejores resultados, tómalos de manera regular.",
      "Mantener fuera del alcance de los niños."
    ],
    faqs: [],
    detalles: [
      { label: "Tipo", valor: "Kit de nutrición diaria" },
      { label: "Objetivo", valor: "Nutrición diaria completa" },
      { label: "Origen", valor: "Base vegetal · Nutrilite™" },
      { label: "Artículo", valor: "324813" }
    ],
    imagenes: ["/solucion-nutricion-diaria.webp"],
    imagen: "/solucion-nutricion-diaria.webp",
    rating: 4.8,
    reviewCount: 21,
    usosPorEnvase: 30,
    badge: "Kit Diario",
    badgeColor: "bg-indigo-500"
  },
  {
    id: 23,
    nombre: "CLA 500 Nutrilite",
    nombreCorto: "CLA 500 Nutrilite™ – Ácido Linoleico Conjugado",
    categoria: "Vitaminas",
    articulo: "100280",
    ...PRECIOS[23],
    pv: 18.76,
    bv: 2682.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 5,
    ventasSemana: 7,
    descripcion: "CLA 500 de Nutrilite™ aporta ácido linoleico conjugado de origen vegetal para apoyar la composición corporal, reducir grasa y mantener masa muscular magra.",
    descripcionLarga: "El CLA 500 de Nutrilite™ contiene ácido linoleico conjugado (CLA) derivado de aceite de cártamo, una fuente vegetal de alta calidad. El CLA es un ácido graso omega-6 que se ha estudiado por su capacidad para apoyar la composición corporal saludable.\n\nEn combinación con ejercicio regular y una dieta equilibrada, el CLA puede contribuir a reducir la acumulación de grasa corporal y a preservar la masa muscular magra. Es especialmente popular entre personas activas que buscan optimizar su rendimiento o composición física.\n\nCalidad Nutrilite™. Suministro para 45 días.",
    beneficios: [
      "Apoya la reducción de grasa corporal",
      "Contribuye a mantener masa muscular magra",
      "Derivado de aceite de cártamo (vegetal)",
      "Ideal para complementar rutinas de ejercicio",
      "Sin estimulantes ni cafeína"
    ],
    instrucciones: [
      "Toma dos cápsulas blandas tres veces al día, preferentemente con las comidas."
    ],
    ingredientesTexto: "Por 2 cápsulas blandas: Calorías 15 · Grasas totales 1.5g (2%) · Ácido Linoleico Conjugado —CLA de aceite de cártamo— 1,000mg.\nPor 6 cápsulas (dosis diaria): Calorías 45 · Grasas totales 4.5g (7%) · CLA 3,000mg.\n\nOtros ingredientes: gelatina, glicerina.",
    faqs: [
      {
        pregunta: "¿CLA 500 Nutrilite™ cuenta con certificación Halal?",
        respuesta: "Sí."
      }
    ],
    certificaciones: [
      { nombre: "Halal", descripcion: "Halal" }
    ],
    detalles: [
      { label: "Contenido", valor: "180 cápsulas blandas" },
      { label: "Ingrediente activo", valor: "CLA 1,000mg por 2 cápsulas" },
      { label: "Origen", valor: "Aceite de cártamo 100% vegetal" },
      { label: "Uso", valor: "2 cápsulas × 3 veces al día con comidas" },
      { label: "Suministro", valor: "30 días" },
      { label: "Artículo", valor: "100280" }
    ],
    imagenes: ["/CLA500Nutrilite.webp"],
    imagen: "/CLA500Nutrilite.webp",
    rating: 4.6,
    reviewCount: 14,
    usosPorEnvase: 135,
    badge: "Figura",
    badgeColor: "bg-orange-500"
  },
  {
    id: 24,
    nombre: "Picolinato de Cromo Nutrilite",
    nombreCorto: "Picolinato de Cromo Nutrilite™ – Control de Azúcar y Metabolismo",
    categoria: "Vitaminas",
    articulo: "A8600",
    ...PRECIOS[24],
    pv: 10.05,
    bv: 1436.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 6,
    ventasSemana: 5,
    descripcion: "El Picolinato de Cromo de Nutrilite™ ayuda a regular los niveles de azúcar en sangre, reducir antojos de carbohidratos y apoyar el metabolismo de glucosa en personas activas.",
    descripcionLarga: "El Picolinato de Cromo Nutrilite™ proporciona cromo en su forma picolinato, la variante con mayor biodisponibilidad. El cromo es un oligoelemento esencial que potencia la acción de la insulina, contribuyendo a mantener niveles normales de glucosa en sangre.\n\nEs especialmente útil para personas que experimentan antojos frecuentes de azúcares o carbohidratos, ya que al mejorar la sensibilidad a la insulina ayuda a reducir estos impulsos. También apoya el metabolismo de carbohidratos, grasas y proteínas.\n\nCalidad Nutrilite™. Cada tableta aporta 200 mcg de cromo.",
    beneficios: [
      "Apoya el control de niveles de azúcar en sangre",
      "Reduce antojos de azúcar y carbohidratos",
      "Potencia la sensibilidad a la insulina",
      "Favorece el metabolismo de macronutrientes",
      "Forma picolinato: máxima biodisponibilidad"
    ],
    instrucciones: [
      "Toma una cápsula con un vaso grande de agua tres veces al día, entre 30 y 45 minutos antes de las comidas."
    ],
    ingredientesTexto: "Por cápsula: Cromo (picolinato de cromo) 100mcg (83%) · Garcinia (fruta) 300mg · Gymnema (hojas) 33.3mg · Concentrado de Perejil Nutrilite™ 33.3mg · Vanadio (bis-glicinato-oxo-vanadio) 6.7mcg.\n\nOtros ingredientes: celulosa microcristalina, gelatina, agua, maltodextrina, estearato de magnesio, acacia, dióxido de silicio. Sin saborizantes, colorantes ni conservantes artificiales.",
    faqs: [
      {
        pregunta: "¿Picolinato de Cromo Nutrilite™ cuenta con certificación Halal?",
        respuesta: "Sí."
      }
    ],
    certificaciones: [
      { nombre: "Halal", descripcion: "Halal" }
    ],
    detalles: [
      { label: "Contenido", valor: "120 comprimidos" },
      { label: "Ingrediente activo", valor: "Cromo 100mcg + Garcinia + Gymnema" },
      { label: "Uso", valor: "1 cápsula × 3 veces al día (30-45 min antes de comer)" },
      { label: "Objetivo", valor: "Metabolismo de glucosa y control de antojos" },
      { label: "Sin", valor: "Saborizantes · colorantes · conservantes artificiales" },
      { label: "Artículo", valor: "A8600" }
    ],
    imagenes: ["/Picolinato-cromo.webp"],
    imagen: "/Picolinato-cromo.webp",
    rating: 4.5,
    reviewCount: 11,
    usosPorEnvase: 90,
    badge: "Glucosa",
    badgeColor: "bg-cyan-600"
  },
  {
    id: 25,
    nombre: "Espectro Multicaroteno Nutrilite",
    nombreCorto: "Espectro Multicaroteno Nutrilite™ – Antioxidante Natural",
    categoria: "Vitaminas",
    articulo: "124708",
    ...PRECIOS[25],
    pv: 13.56,
    bv: 1938.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 4,
    ventasSemana: 6,
    descripcion: "Espectro Multicaroteno de Nutrilite™ es una mezcla de carotenoides naturales — alfa, beta y gamma caroteno, licopeno, luteína y zeaxantina — para protección antioxidante completa.",
    descripcionLarga: "El Espectro Multicaroteno Nutrilite™ proporciona una combinación única de carotenoides naturales derivados de plantas cultivadas en granjas Nutrilite™. A diferencia de suplementos que solo ofrecen beta-caroteno aislado, esta fórmula incluye el espectro completo que se encuentra en los alimentos.\n\nLos carotenoides son antioxidantes potentes que protegen las células del daño oxidativo, apoyan la salud ocular (luteína y zeaxantina), la salud cardiovascular (licopeno) y contribuyen a la producción de vitamina A (alfa y beta-caroteno).\n\nIdeal para personas expuestas a factores de estrés oxidativo: sol, humo, contaminación, estrés crónico.",
    beneficios: [
      "Protección antioxidante amplia con múltiples carotenoides",
      "Apoya la salud ocular con luteína y zeaxantina",
      "Beneficios cardiovasculares con licopeno",
      "Contribuye a la producción natural de vitamina A",
      "Origen 100% vegetal de granjas Nutrilite™",
      "Sin beta-caroteno sintético"
    ],
    instrucciones: [
      "Toma una cápsula blanda al día."
    ],
    ingredientesTexto: "Por cápsula: Calorías 5 · Vitamina A (betacaroteno) 1,750mcg (194%) · Zinc (gluconato de zinc) 2mg (18%) · Luteína y zeaxantina (extracto de caléndula Tagetes erecta) 18mg · Licopeno (extracto de tomate) 2.5mg.\n\nNutrientes vegetales de caléndula, tomates y algas cultivadas en granjas asociadas Nutrilite™. Sin gluten, sin soja, sin lácteos, sin saborizantes ni colorantes artificiales.",
    faqs: [
      {
        pregunta: "¿Qué son los carotenoides y cuál es su función?",
        respuesta: "Los carotenoides dan a las plantas sus pigmentos amarillos, rojos y anaranjados. En el cuerpo actúan como antioxidantes, protegiendo las células del daño oxidativo causado por los radicales libres."
      },
      {
        pregunta: "¿Cuáles son los beneficios de tomar este producto?",
        respuesta: "Espectro Multicaroteno Nutrilite™ complementa la dieta con carotenoides naturales que apoyan la salud visual. Ayuda a los ojos a filtrar la luz azul, apoya el enfoque visual, proporciona vitamina A esencial para la retina y ofrece protección antioxidante."
      }
    ],
    certificaciones: [
      { nombre: "Halal", descripcion: "Halal" },
      { nombre: "NSF", descripcion: "Certificación de contenido NSF" }
    ],
    detalles: [
      { label: "Contenido", valor: "60 cápsulas blandas" },
      { label: "Ingredientes activos", valor: "Luteína 15mg + Zeaxantina 3mg + Licopeno + Betacaroteno" },
      { label: "Origen", valor: "Caléndula, tomates y algas — granjas Nutrilite™" },
      { label: "Uso", valor: "1 cápsula blanda al día" },
      { label: "Certificaciones", valor: "Halal · NSF" },
      { label: "Artículo", valor: "124708" }
    ],
    imagenes: ["/espectro-multicaroteno.webp"],
    imagen: "/espectro-multicaroteno.webp",
    rating: 4.7,
    reviewCount: 9,
    usosPorEnvase: 60,
    badge: "Antioxidante",
    badgeColor: "bg-yellow-600"
  },
  {
    id: 26,
    nombre: "Diario Nutrilite",
    nombreCorto: "Nutrilite™ Daily – Multivitamínico Diario Esencial",
    categoria: "Vitaminas",
    articulo: "120011DR",
    ...PRECIOS[26],
    pv: 3.95,
    bv: 565.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 10,
    ventasSemana: 12,
    descripcion: "Nutrilite™ Daily es el multivitamínico de entrada ideal. Cubre las vitaminas y minerales esenciales del día a día con nutrientes de base vegetal en una sola tableta diaria.",
    descripcionLarga: "El Nutrilite™ Daily es el complemento vitamínico perfecto para quienes buscan una cobertura nutricional básica sin complicaciones. Con una sola tableta al día obtienes un amplio espectro de vitaminas y minerales esenciales respaldados por concentrados de plantas de calidad Nutrilite™.\n\nIdeal para personas que recién comienzan con la suplementación, adultos con dietas poco variadas o quienes necesitan una opción de valor para cubrir sus necesidades diarias básicas. Es el punto de entrada perfecto al ecosistema Nutrilite™.\n\nFormulación de base vegetal. Sin conservantes artificiales.",
    beneficios: [
      "Cobertura completa de vitaminas y minerales esenciales",
      "Una sola tableta al día — fácil de mantener",
      "Base vegetal certificada Nutrilite™",
      "Ideal para comenzar con suplementación",
      "Precio accesible para uso diario continuo"
    ],
    instrucciones: [
      "Toma una tableta diaria, preferiblemente con comida."
    ],
    ingredientesTexto: "Por tableta: Vitamina A 800mcg (89%) · Vitamina C 90mg (100%) · Vitamina D 10mcg (50%) · Vitamina E 10mg (67%) · Tiamina 1.4mg (117%) · Riboflavina 1.4mg (108%) · Niacina 18mg (113%) · Vitamina B6 1.4mg (82%) · Ácido fólico 240mcg (60%) · Vitamina B12 2.4mcg (100%) · Biotina 30mcg (100%) · Ácido pantoténico 5mg (100%) · Calcio 160mg (12%) · Hierro 10mg (56%) · Yodo 150mcg (100%) · Magnesio 63mg (15%) · Zinc 10mg (91%) · Selenio 65mcg (64%) · Cobre 0.5mg (56%) · Manganeso 2.3mg (100%) · Cromo 35mcg (100%) · Molibdeno 23mcg (51%) · Concentrado de acerola 75.27mg · Concentrado de zanahoria 4.86mg.\n\nSin colorantes, saborizantes ni conservantes artificiales. Sin gluten.",
    faqs: [
      {
        pregunta: "¿Daily Nutrilite™ cuenta con certificación NSF?",
        respuesta: "Sí. NSF International evalúa a fondo cada aspecto del desarrollo del producto antes de otorgar la certificación."
      },
      {
        pregunta: "¿Daily Nutrilite™ cuenta con certificación Kosher?",
        respuesta: "Sí."
      },
      {
        pregunta: "¿Daily Nutrilite™ cuenta con certificación Halal?",
        respuesta: "Sí."
      }
    ],
    certificaciones: [
      { nombre: "Kosher", descripcion: "Certificación Kosher" },
      { nombre: "Halal", descripcion: "Halal" }
    ],
    detalles: [
      { label: "Contenido", valor: "45 tabletas" },
      { label: "Nutrientes", valor: "22 vitaminas y minerales + concentrados vegetales" },
      { label: "Uso", valor: "1 tableta al día con comida" },
      { label: "Sin", valor: "Gluten · colorantes · conservantes artificiales" },
      { label: "Certificaciones", valor: "Kosher · Halal · NSF" },
      { label: "Artículo", valor: "120011DR" }
    ],
    imagenes: ["/diario-nutrilite.webp"],
    imagen: "/diario-nutrilite.webp",
    rating: 4.8,
    reviewCount: 28,
    usosPorEnvase: 30,
    badge: "Esencial",
    badgeColor: "bg-teal-600"
  },
  {
    id: 27,
    nombre: "Magnesio Nutrilite",
    nombreCorto: "Nutrilite™ Magnesio – Mejor absorción para mejores días",
    categoria: "Vitaminas",
    articulo: "NUTRI-MAG",
    ...PRECIOS[27],
    pv: 12.20,
    bv: 1743.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 8,
    ventasSemana: 10,
    descripcion: "Magnesio Nutrilite™ apoya más de 300 procesos en el cuerpo: corazón, nervios, músculos, sueño, estrés ocasional y producción de energía. Formulado para absorber 2× mejor que el producto líder.",
    descripcionLarga: "El magnesio, clave para más de 300 procesos en el cuerpo humano, ayuda a que tus células puedan crear proteína esencial, apoyar tus músculos y nervios, producir energía y mucho más.\n\nMagnesio Nutrilite™ está formulado para absorber dos veces mejor que el producto líder al maximizar las formas protegidas de magnesio: quelato bisglicinato de magnesio y malato de dimagnesio. Además contiene extracto de fruto de olivo para la salud del corazón y apoyo antioxidante.\n\nIdeal para adultos que buscan apoyo diario para su corazón, nervios, músculos, sueño, estrés ocasional, producción de energía y salud del cerebro.",
    beneficios: [
      "Apoya más de 300 procesos biológicos esenciales",
      "2× mejor absorción que el producto líder",
      "Quelato bisglicinato de magnesio y malato de dimagnesio",
      "Extracto de fruto de olivo para la salud del corazón",
      "Apoyo para sueño, estrés ocasional y energía",
      "Vegano · sin gluten · sin lactosa · sin soja"
    ],
    instrucciones: [
      "Toma dos cápsulas por día, preferiblemente con la cena."
    ],
    ingredientesTexto: "Por 2 cápsulas: Magnesio (como quelato bisglicinato de magnesio, hidróxido de magnesio y malato de dimagnesio) 200mg (48% VD) · Extracto de olivo (Olea Europaea L.) (fruta) 54mg (brinda 10mg de hidroxitirosol) †\n\nOtros ingredientes: Hidroxipropil metilcelulosa, fibra de maíz, dextrina, ácido cítrico, fibra de bambú, acacia.\n\nSin colorantes, saborizantes ni conservantes artificiales. Vegano. Sin lactosa, sin lácteos, sin soja, sin gluten, sin OMG.",
    faqs: [
      {
        pregunta: "¿Este producto contiene magnesio quelado y por qué es importante?",
        respuesta: "Sí, Magnesio Nutrilite™ incluye magnesio quelado en forma de quelato bisglicinato de magnesio y malato de dimagnesio. Estas formas se absorben mejor y son más suaves para el estómago, lo que reduce las molestias gastrointestinales."
      },
      {
        pregunta: "¿Qué significa que Magnesio Nutrilite™ tiene certificación de contenido NSF?",
        respuesta: "La certificación NSF garantiza que el producto cumpla con estrictos estándares de calidad y seguridad a través de pruebas de terceros e inspecciones de plantas."
      },
      {
        pregunta: "¿Magnesio Nutrilite™ cuenta con certificación Kosher?",
        respuesta: "Sí."
      },
      {
        pregunta: "¿Magnesio Nutrilite™ cuenta con certificación Halal?",
        respuesta: "Sí."
      },
      {
        pregunta: "¿Puedo tomar Magnesio Nutrilite™ con otros productos Amway que contengan magnesio?",
        respuesta: "Sí, pero el límite máximo de ingesta tolerable de suplementos es 400 mg/día. Evita tomar Magnesio Nutrilite™, Double X™ y Cal Mag D al mismo tiempo."
      },
      {
        pregunta: "¿Magnesio Nutrilite reemplaza a Cal Mag D?",
        respuesta: "No, son productos distintos. Magnesio Nutrilite cubre múltiples beneficios (sueño, estrés, energía, corazón, nervio, músculo y cerebro). Cal Mag D está diseñado específicamente para apoyar la salud de los huesos."
      },
      {
        pregunta: "¿Este producto es recomendable para niños?",
        respuesta: "No, Magnesio Nutrilite™ está diseñado para adultos mayores de 18 años."
      },
      {
        pregunta: "¿Las mujeres embarazadas o que amamantan pueden consumir este producto?",
        respuesta: "Consulta a tu médico antes de usarlo si estás embarazada o amamantando."
      }
    ],
    certificaciones: [
      { nombre: "Halal", descripcion: "Halal" },
      { nombre: "Kosher", descripcion: "Certificación Kosher" },
      { nombre: "NSF", descripcion: "Certificación de contenido NSF" }
    ],
    detalles: [
      { label: "Contenido", valor: "60 cápsulas" },
      { label: "Porción", valor: "2 cápsulas · 30 porciones por envase" },
      { label: "Magnesio por porción", valor: "200mg (48% VD)" },
      { label: "Ingrediente especial", valor: "Extracto de fruto de olivo 54mg" },
      { label: "Uso", valor: "2 cápsulas al día, preferiblemente con la cena" },
      { label: "Certificaciones", valor: "Halal · Kosher · NSF" },
      { label: "Artículo", valor: "NUTRI-MAG" }
    ],
    imagenes: ["/magnesio.webp"],
    imagen: "/magnesio.webp",
    rating: 4.8,
    reviewCount: 12,
    usosPorEnvase: 30,
    badge: "Absorción 2×",
    badgeColor: "bg-green-600"
  },
  {
    id: 28,
    nombre: "Nutrilite™ Cerocarb",
    nombreCorto: "Nutrilite™ Cerocarb – Inhibidor de carbohidratos",
    categoria: "Vitaminas",
    articulo: "NUTRI-CEROCARB",
    ...PRECIOS[28],
    pv: 8.30,
    bv: 1187.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 10,
    ventasSemana: 8,
    descripcion: "Cerocarb ayuda a inhibir la digestión de azúcares simples y carbohidratos complejos. Puede ayudar a prevenir la absorción de hasta 500 calorías en comidas altas en carbohidratos.",
    descripcionLarga: "Nutrilite™ Cerocarb está diseñado para inhibir la digestión de azúcares simples y carbohidratos complejos, ayudando a prevenir la absorción de hasta 500 calorías cuando se ingiere con comidas altas en carbohidratos.\n\nBloquea los carbohidratos sin privar a tu cuerpo de vitaminas, minerales y fibra esenciales. Elaborado a partir de soja fermentada y extractos de frijol blanco, ingredientes naturales con respaldo científico.\n\nCertificado Halal. Calidad Nutrilite™.",
    beneficios: [
      "Inhibe la digestión de azúcares simples y carbohidratos complejos",
      "Puede prevenir la absorción de hasta 500 calorías por comida",
      "No priva al cuerpo de vitaminas, minerales ni fibra",
      "Elaborado de soja fermentada y extracto de frijol blanco",
      "Fórmula natural con certificación Halal"
    ],
    instrucciones: [
      "Tomar de una a tres tabletas con comidas ricas en carbohidratos.",
      "No consumir más de 9 tabletas por día."
    ],
    ingredientesTexto: "Por porción: Extracto de Frijol (Phaseolus vulgaris) 500mg † · Extracto de soja (Glycine max L.) 300mg † · Concentrado de Perejil (hojas, tallo) 30mg †\n\nOtros ingredientes: Celulosa microcristalina, ácido esteárico, goma arábiga, dióxido de silicio, carboximetilcelulosa sódica, metilcelulosa, glicerina, cera de carnaúba.\n\n† Valor diario no establecido.",
    faqs: [
      {
        pregunta: "¿Nutrilite™ Cerocarb cuenta con certificación Halal?",
        respuesta: "Sí."
      },
      {
        pregunta: "¿Quiénes deben consultar a un médico antes de usar este producto?",
        respuesta: "Las mujeres embarazadas o que amamantan, o toda persona con una enfermedad, incluidas diabetes e hipoglucemia, deben consultar con un médico antes de usar este producto."
      },
      {
        pregunta: "¿Cuántas tabletas puedo tomar al día?",
        respuesta: "Toma de una a tres tabletas con comidas ricas en carbohidratos. No consumas más de 9 tabletas por día."
      },
      {
        pregunta: "¿Cerocarb elimina nutrientes esenciales junto con los carbohidratos?",
        respuesta: "No. Cerocarb bloquea los carbohidratos sin privar a tu cuerpo de vitaminas, minerales y fibra esenciales."
      }
    ],
    certificaciones: [
      { nombre: "Halal", descripcion: "Halal" }
    ],
    detalles: [
      { label: "Contenido", valor: "60 tabletas" },
      { label: "Extracto principal", valor: "Frijol blanco 500mg + Soja 300mg por porción" },
      { label: "Uso", valor: "1-3 tabletas con comidas ricas en carbohidratos" },
      { label: "Máximo diario", valor: "9 tabletas" },
      { label: "Certificaciones", valor: "Halal" },
      { label: "Artículo", valor: "NUTRI-CEROCARB" }
    ],
    imagenes: ["/Nutrilite™-Cerocarb.webp"],
    imagen: "/Nutrilite™-Cerocarb.webp",
    rating: 4.6,
    reviewCount: 15,
    usosPorEnvase: 60,
    badge: "Bloquea Carbos",
    badgeColor: "bg-blue-600"
  },
  {
    id: 29,
    nombre: "Serenoa Repens y Raíz de Ortiga Nutrilite",
    nombreCorto: "Nutrilite™ Serenoa Repens y Raíz de Ortiga",
    categoria: "Salud Masculina",
    articulo: "NUTRI-SERENOA",
    ...PRECIOS[29],
    pv: 16.50,
    bv: 2360.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 8,
    ventasSemana: 6,
    descripcion: "Suplemento para hombres de 35+ con serenoa repens, raíz de ortiga y aceite de semillas de calabaza. Favorece el funcionamiento normal de la próstata y el flujo urinario. Incluye betacaroteno Nutrilite™. 100 cápsulas blandas.",
    descripcionLarga: "Nutrilite™ Serenoa Repens y Raíz de Ortiga es un refuerzo natural diseñado especialmente para hombres de 35 años en adelante — la edad en que los expertos recomiendan empezar a prestar atención a la salud de la próstata.\n\nCombina extracto de serenoa repens y aceite de semillas de calabaza para favorecer el normal funcionamiento de la próstata, junto con extracto de raíz de ortiga para apoyar un flujo urinario normal.\n\nIncluye concentrado de betacaroteno Nutrilite™, cultivado en granjas propias de Amway. Sin conservantes agregados, colorantes ni saborizantes artificiales.\n\nCertificación NSF International y certificación Halal. Calidad Nutrilite™ desde 1934.",
    beneficios: [
      "Favorece el funcionamiento normal de la próstata",
      "Apoya un flujo urinario normal gracias a la raíz de ortiga",
      "Contiene extracto de serenoa repens y aceite de semillas de calabaza",
      "Incluye concentrado de betacaroteno Nutrilite™",
      "Sin conservantes, colorantes ni saborizantes artificiales",
      "Certificado por NSF International y Halal",
      "100 cápsulas blandas — suministro de más de un mes"
    ],
    instrucciones: [
      "Tomar tres cápsulas blandas al día, preferentemente con las comidas."
    ],
    ingredientesTexto: "Extracto de serenoa repens · Aceite de semillas de calabaza · Extracto de raíz de ortiga · Concentrado de betacaroteno Nutrilite™\n\nSin conservantes agregados, colorantes ni saborizantes artificiales.",
    avisos: [
      "Cualquier persona que padezca alguna enfermedad debe consultar a un médico antes de usar este producto.",
      "Mantener fuera del alcance de los niños.",
      "†Esta declaración no fue evaluada por la Administración de Alimentos y Medicamentos de EE. UU. Este producto no pretende diagnosticar, tratar, curar ni prevenir ninguna enfermedad."
    ],
    faqs: [
      {
        pregunta: "¿Para quién está recomendado este suplemento?",
        respuesta: "Está diseñado para hombres de 35 años en adelante, edad en que se recomienda prestar atención a la salud de la próstata."
      },
      {
        pregunta: "¿Cuenta con certificación NSF?",
        respuesta: "Sí. La certificación NSF International garantiza que lo que aparece en la etiqueta es exactamente lo que contiene el producto, con pruebas exhaustivas y estándares estrictos para proteger la salud pública."
      },
      {
        pregunta: "¿Tiene certificación Halal?",
        respuesta: "Sí, el suplemento Nutrilite™ Serenoa Repens y Raíz de Ortiga cuenta con certificación Halal."
      },
      {
        pregunta: "¿Cuántas cápsulas trae y cuánto dura?",
        respuesta: "El frasco contiene 100 cápsulas blandas. Tomando 3 al día con las comidas, el suministro dura aproximadamente 33 días."
      },
      {
        pregunta: "¿Este producto cura enfermedades de la próstata?",
        respuesta: "No. Este es un suplemento alimenticio que favorece el funcionamiento normal de la próstata. No pretende diagnosticar, tratar, curar ni prevenir ninguna enfermedad. Consulta a tu médico si tienes alguna condición de salud."
      }
    ],
    certificaciones: [
      { nombre: "NSF", descripcion: "Certificado por NSF International" },
      { nombre: "Halal", descripcion: "Certificado Halal" }
    ],
    detalles: [
      { label: "Contenido", valor: "100 cápsulas blandas" },
      { label: "Uso", valor: "3 cápsulas al día con las comidas" },
      { label: "Público objetivo", valor: "Hombres de 35 años en adelante" },
      { label: "Ingredientes clave", valor: "Serenoa repens, raíz de ortiga, aceite de semillas de calabaza, betacaroteno" },
      { label: "Certificaciones", valor: "NSF International · Halal" },
      { label: "Artículo", valor: "NUTRI-SERENOA" }
    ],
    imagenes: ["/serenoa.webp"],
    imagen: "/serenoa.webp",
    rating: 4.8,
    reviewCount: 9,
    usosPorEnvase: 33,
    badge: "Salud Masculina",
    badgeColor: "bg-green-700"
  },
  {
    id: 30,
    nombre: "XS™ Energy + Focus",
    nombreCorto: "Suplemento XS™ Energy + Focus",
    categoria: "Energizantes",
    articulo: "XS-ENERGY-FOCUS",
    ...PRECIOS[30],
    pv: 3.90,
    bv: 557.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 6,
    ventasSemana: 10,
    descripcion: "60 comprimidos. Ayuda a maximizar la resistencia física y aumentar la concentración mental durante el ejercicio. Con cafeína natural de té verde y extracto de rhodiola rosea.",
    descripcionLarga: "Da lo mejor en tu entrenamiento.\n\nAyuda a maximizar la resistencia física y aumentar la concentración mental durante el ejercicio.†\n\nLa cafeína natural del extracto de té verde combinado con extractos de rhodiola rosea ayuda a mejorar la resistencia física y la concentración mental para lograr entrenamientos más intensos.†\n\nLa investigación sugiere que la rhodiola rosea mejora el sistema de respuesta ante el estrés del cuerpo, lo cual puede ayudar con el tiempo de recuperación.†",
    beneficios: [
      "Maximiza la resistencia física durante el ejercicio",
      "Aumenta la concentración mental para entrenamientos más intensos",
      "Cafeína natural derivada del extracto de té verde (75 mg por comprimido)",
      "Rhodiola rosea apoya el sistema de respuesta ante el estrés y la recuperación",
      "Aporta Vitamina C (30 mg, 33% del valor diario)",
      "Contiene espinaca deshidratada y concentrado de acerola",
      "Certificación Halal y Kosher"
    ],
    instrucciones: [
      "Tomar uno o dos comprimidos antes de realizar actividad física.",
      "No consumir más de dos comprimidos por día.",
      "No se recomienda para niños, mujeres embarazadas o en período de lactancia y personas sensibles a la cafeína.",
      "Los niños menores de 12 años, las mujeres embarazadas o que amamantan y las personas que tienen una enfermedad deben consultar con un médico antes de usar este producto.",
      "Mantener fuera del alcance de los niños."
    ],
    advertencia: "Contiene 0.002 oz (75 mg) de cafeína por comprimido. No se recomienda para niños, mujeres embarazadas o en período de lactancia y personas sensibles a la cafeína. Los niños menores de 12 años, las mujeres embarazadas o que amamantan y las personas que tienen una enfermedad deben consultar con un médico antes de usar este producto. Mantener fuera del alcance de los niños.",
    ingredientesTexto: "Porción: 1 Tableta\n\nVitamina C (de ácido ascórbico y concentrado de acerola) 30 mg — 33%\nRhodiola rosea (raíz) 100 mg — †\nCafeína (de extracto de té verde, hojas) 75 mg — †\nEspinaca deshidratada (hojas) 50 mg — †\nMezcla patentada de concentrado de acerola 50 mg — †\n\n*El porcentaje del valor diario se basa en una dieta de 2,000 calorías. †Valor diario no establecido.\n\nOtros ingredientes: Dextrosa, Celulosa microcristalina, Crospovidona, Maltodextrina, Dióxido de silicio, Hidroxipropilmetilcelulosa, Ácido esteárico, Glicerina, Estearato de magnesio, Cera de carnaúba.",
    faqs: [
      {
        pregunta: "¿El Suplemento XS™ Energy + Focus contiene cafeína?",
        respuesta: "Sí. El Suplemento XS™ Energy + Focus contiene 0.002 oz (75 mg) de cafeína por comprimido, aproximadamente la cantidad que se encuentra en una taza de café. Una dosis diaria de dos comprimidos brinda 0.005 oz (150 mg) de cafeína."
      },
      {
        pregunta: "¿De dónde se obtiene la cafeína del Suplemento XS™ Energy + Focus?",
        respuesta: "La cafeína del Suplemento XS™ Energy + Focus se obtiene naturalmente del extracto de té verde."
      },
      {
        pregunta: "¿El Suplemento XS™ Energy + Focus contiene lactosa u otro producto derivado de la leche?",
        respuesta: "No, el Suplemento XS™ Energy + Focus no contiene lactosa u otro producto derivado de la leche."
      },
      {
        pregunta: "¿El Suplemento XS™ Energy + Focus cuenta con certificación Halal?",
        respuesta: "Sí."
      }
    ],
    certificaciones: [
      { nombre: "Halal", descripcion: "Halal" },
      { nombre: "Kosher", descripcion: "Certificación Kosher" }
    ],
    detalles: [
      { label: "Contenido", valor: "60 comprimidos" },
      { label: "Cafeína", valor: "75 mg por comprimido (de té verde)" },
      { label: "Rhodiola rosea", valor: "100 mg por comprimido" },
      { label: "Vitamina C", valor: "30 mg (33% VD)" },
      { label: "Uso", valor: "1-2 comprimidos antes del ejercicio" },
      { label: "Máximo diario", valor: "2 comprimidos" },
      { label: "Certificaciones", valor: "Halal · Kosher" },
      { label: "Sin", valor: "Lactosa ni derivados lácteos" },
      { label: "Artículo", valor: "XS-ENERGY-FOCUS" }
    ],
    imagenes: ["/energia-enfoque-xs.webp"],
    imagen: "/energia-enfoque-xs.webp",
    imagen400w: "/energia-enfoque-xs.webp",
    rating: 4.8,
    reviewCount: 0,
    usosPorEnvase: 60,
    badge: "Energía",
    badgeColor: "bg-orange-500"
  },
  {
    id: 31,
    nombre: "Jugo de energía XS™ burbujeante 12 oz - Toronja rosada",
    nombreCorto: "Jugo de energía XS™ burbujeante 12 oz - Toronja rosada",
    categoria: "Energizantes",
    articulo: "XS-JUGO-BURBUJEANTE",
    ...PRECIOS[31],
    pv: 5.80,
    bv: 829.0,
    disponible: true,
    stock: "En stock",
    stockUnidades: 10,
    ventasSemana: 12,
    descripcion: "12 latas de 355 mL. Bebida energizante con sabor a mango, piña y guayaba. 25% de jugo natural, 280% de Vitamina C, vitaminas B y 114 mg de cafeína. Sin azúcar agregada.",
    descripcionLarga: "¡Energía para despertar tu día!\n\nImpúlsate con la ayuda de esta energizante y deliciosa bebida con sabor a mango, piña y guayaba que te ayudará a vivir tu día al máximo.\n\nContiene 25% de jugo natural de frutas proveniente de concentrado y el 280% de tus requerimientos diarios de vitamina C.\nHecha con una mezcla de ingredientes de primera calidad, hierbas y vitaminas B.\nContiene 114 mg de cafeína, comparable con una taza de café de 10 onzas.\nSin azúcar agregada.",
    beneficios: [
      "Energía y enfoque para vivir el día al máximo",
      "25% de jugo natural de frutas (mango, piña, guayaba)",
      "280% del valor diario de Vitamina C por lata",
      "Vitaminas B: Niacina 140%, B6 420%, B12 6,960%, Pantoténico 140%",
      "114 mg de cafeína natural (equivalente a una taza de café de 10 oz)",
      "Sin azúcar agregada — 11 g de azúcar naturales de la fruta",
      "Sabores 100% naturales, sin colorantes artificiales",
      "Certificación Unión Ortodoxa (Kosher)"
    ],
    instrucciones: [
      "Disfruta diariamente hasta dos productos de Energía XS™ (bebidas de energía XS™, XS™ Energy + Focus o Pre-entrenamiento intenso XS™) para mantenerte con energía y enfoque.",
      "No se recomienda para niños, mujeres embarazadas o que amamantan, ni para personas sensibles a la cafeína.",
      "Si tienes más preguntas, consulta a tu médico."
    ],
    advertencia: "Contiene 114 mg de cafeína por porción. No se recomienda para niños, mujeres embarazadas o que amamantan, ni para personas sensibles a la cafeína.",
    ingredientesTexto: "Porción: 1 lata (355 mL / 12 oz líq.)\n\nCalorías 50\nGrasas totales 0 g (0%)\nSodio 10 mg (0%)\nCarbohidratos totales 11 g (4%) — Azúcares totales 11 g (incluye 0 g de azúcar agregado)\nProteína 2 g\nPotasio 74 mg (2%)\nVitamina C 256 mg (280%)\nNiacina 23 mg (140%)\nVitamina B6 7.2 mg (420%)\nVitamina B12 167 mcg (6,960%)\nÁcido pantoténico 7 mg (140%)\n\nIngredientes: Agua carbonatada, jugo de uva blanca concentrado, jugo de manzana concentrado, taurina, L-glutamina, ácido ascórbico (vitamina C), ácido cítrico, ácido málico, cafeína, sorbato de potasio (conservante), jugo de toronja rosada concentrado, sucralosa, acesulfamo de potasio, jugo de verduras (colorante), niacinamida, D-pantotenato de calcio, saborizante natural, clorhidrato de piridoxina, extracto de raíz de Panax ginseng, extracto de raíz de Panax quinquefolius, cianocobalamina.",
    faqs: [
      {
        pregunta: "¿Cuánta azúcar hay en los Jugos de Energía XS™ Burbujeantes?",
        respuesta: "Los sabores de los Jugos de Energía XS™ Burbujeantes tienen 11 g de azúcar, derivados naturalmente del jugo de fruta, y sin azúcar agregada."
      },
      {
        pregunta: "¿Existe la posibilidad de tener una sobredosis de vitaminas B?",
        respuesta: "Las vitaminas B son parte del grupo de vitaminas llamadas «solubles en agua». Las cantidades excesivas de vitaminas solubles en agua se eliminan con la orina."
      },
      {
        pregunta: "¿Las Bebidas de Energía XS™ contienen saborizantes y colorantes artificiales?",
        respuesta: "No. Las Bebidas de Energía XS™ solo contienen sabores naturales y usan ingredientes naturales para obtener su color intenso."
      },
      {
        pregunta: "¿Las bebidas de energía XS™ tienen certificación Kosher?",
        respuesta: "Sí."
      },
      {
        pregunta: "¿Se cambiaron los sabores o fórmulas de las bebidas de energía XS™ al pasar al tamaño de 12 onzas?",
        respuesta: "No se realizaron cambios ni a sabores ni a fórmulas, pero se mejoró el diseño de las latas para maximizar la experiencia del usuario."
      }
    ],
    certificaciones: [
      { nombre: "Kosher", descripcion: "Unión Ortodoxa (OU Kosher)" }
    ],
    detalles: [
      { label: "Contenido", valor: "12 latas × 355 mL (12 oz líq.)" },
      { label: "Sabor", valor: "Mango, piña y guayaba" },
      { label: "Cafeína", valor: "114 mg por lata" },
      { label: "Vitamina C", valor: "256 mg (280% VD)" },
      { label: "Jugo natural", valor: "25% de concentrado de frutas" },
      { label: "Azúcar agregada", valor: "0 g" },
      { label: "Calorías", valor: "50 por lata" },
      { label: "Uso máximo", valor: "2 productos XS™ por día" },
      { label: "Certificación", valor: "Unión Ortodoxa (Kosher)" },
      { label: "Artículo", valor: "XS-JUGO-BURBUJEANTE" }
    ],
    imagenes: ["/bebida-energizante.webp"],
    imagen: "/bebida-energizante.webp",
    imagen400w: "/bebida-energizante.webp",
    rating: 4.9,
    reviewCount: 0,
    usosPorEnvase: 12,
    badge: "Sin Azúcar",
    badgeColor: "bg-yellow-500"
  }
]
