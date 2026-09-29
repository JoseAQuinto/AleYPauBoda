import type { AlbumPhoto } from './chapters'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FOTOGRAFÍAS DEL ÁLBUM
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Mientras esta lista esté vacía, la web muestra fotos temporales
 *  (src/data/placeholders.ts). En cuanto añadas la primera, desaparecen.
 *
 *  FORMA RÁPIDA (recomendada)
 *    1. Copia las fotos originales en /fotos/<capítulo>/  (p. ej. /fotos/ceremonia/)
 *    2. npm run photos
 *       → optimiza (AVIF + WebP en varios tamaños), calcula dimensiones y color,
 *         y añade aquí automáticamente cada foto nueva.
 *    3. (Opcional) Mejora aquí el `alt`, marca `featured`, añade un `caption`…
 *
 *  FORMA MANUAL
 *    Copia la foto (ya reducida para web) en /public/images/wedding/ y declárala:
 *      { src: 'mi-foto.jpg', chapter: 'fiesta', orientation: 'landscape', alt: '…' }
 *
 *  El orden de esta lista es el orden del álbum dentro de cada capítulo.
 *
 *  Campos (ver src/data/types.ts):
 *    src        ruta de la foto (obligatorio)
 *    alt        descripción accesible
 *    chapter    'antes' | 'ceremonia' | 'just-married' | 'nosotros'
 *               | 'celebracion' | 'fiesta' | 'vosotros'
 *    featured   true → foto protagonista a pantalla completa
 *    caption    pie de foto
 *    role       'hero' (portada) | 'intro' (foto de la introducción) | 'closing' (foto final)
 *    story      false → solo en la galería completa, no en la narrativa
 *    focus      encuadre al recortar, p. ej. '50% 30%'
 *
 *  Ejemplos:
 *    { src: 'nosotros/IMG_2210.jpg', role: 'hero', alt: 'Ale y Pau al atardecer' },
 *    { src: 'ceremonia/IMG_0412.jpg', chapter: 'ceremonia', featured: true, caption: 'El sí.' },
 */
export const photos: AlbumPhoto[] = [
  // @nuevas-fotos ← `npm run photos` añade aquí las fotos nuevas. No borres esta línea.
]
