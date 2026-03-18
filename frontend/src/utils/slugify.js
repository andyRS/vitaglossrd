/**
 * Convierte un nombre de producto a un slug URL-friendly.
 * Ej: "Ácido Fólico Nutrilite" → "acido-folico-nutrilite"
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // elimina tildes
    .replace(/[™®]/g, '')            // elimina símbolos de marca
    .replace(/[^a-z0-9]+/g, '-')     // reemplaza no-alfanuméricos con guion
    .replace(/^-+|-+$/g, '')         // recorta guiones al inicio/fin
}
