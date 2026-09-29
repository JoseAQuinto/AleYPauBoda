import type { ManifestItem } from '../data/types'

export interface ImageSource {
  type: string
  srcSet: string
}

/** Todo lo necesario para pintar una foto de forma responsive. */
export interface ImageSet {
  /** <source> por formato (AVIF, WebP) cuando la foto está optimizada localmente. */
  sources: ImageSource[]
  /** srcset directo en <img> (imágenes remotas con redimensionado en su CDN). */
  srcSet?: string
  /** Imagen por defecto de <img>. */
  src: string
  /** Versión pequeña: se usa como anticipo mientras carga la grande en el visor. */
  thumb: string
}

/** Carpeta pública donde viven las fotos (optimizadas o copiadas a mano). */
export const PUBLIC_DIR = '/images/wedding/'

const UNSPLASH = 'https://images.unsplash.com/'
const REMOTE_WIDTHS = [480, 800, 1200, 1800, 2400]

const isAbsolute = (src: string) => /^(https?:)?\/\//.test(src) || src.startsWith('/')

function unsplashUrl(base: string, width: number, quality = 70) {
  return `${base}?w=${width}&q=${quality}&auto=format`
}

/**
 * `sizes` de una foto que cubre toda la pantalla (object-fit: cover). En una pantalla
 * más estrecha que la foto (un móvil en vertical), la imagen se escala por la altura y
 * se recorta por los lados: ocupa `alto × proporción`, mucho más que 100vw.
 */
export function coverSizes(photo: { width: number; height: number; ratio: number }) {
  return `(max-aspect-ratio: ${photo.width}/${photo.height}) ${Math.ceil(photo.ratio * 100)}vh, 100vw`
}

export function buildImageSet(src: string, meta: ManifestItem | undefined, originalWidth: number): ImageSet {
  // 1 · Optimizada con `npm run photos`: AVIF + WebP en varios anchos.
  if (meta) {
    const set = (ext: string) => meta.widths.map((w) => `${meta.base}-${w}.${ext} ${w}w`).join(', ')
    const mid = meta.widths.find((w) => w >= 1200) ?? meta.widths[meta.widths.length - 1]
    return {
      sources: [
        { type: 'image/avif', srcSet: set('avif') },
        { type: 'image/webp', srcSet: set('webp') },
      ],
      src: `${meta.base}-${mid}.webp`,
      thumb: `${meta.base}-${meta.widths[0]}.webp`,
    }
  }

  // 2 · Unsplash (placeholders): su CDN redimensiona y sirve AVIF/WebP automáticamente.
  if (src.startsWith(UNSPLASH)) {
    const base = src.split('?')[0]
    const widths = REMOTE_WIDTHS.filter((w) => w <= originalWidth)
    if (widths.length === 0) widths.push(originalWidth)
    return {
      sources: [],
      srcSet: widths.map((w) => `${unsplashUrl(base, w)} ${w}w`).join(', '),
      src: unsplashUrl(base, 1280),
      thumb: unsplashUrl(base, 480, 60),
    }
  }

  // 3 · Archivo servido tal cual (copiado a mano en /public/images/wedding o URL externa).
  const url = isAbsolute(src) ? src : PUBLIC_DIR + src
  return { sources: [], src: url, thumb: url }
}
