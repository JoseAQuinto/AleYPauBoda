/** Idiomas del álbum. El español vive en la raíz (/) y el inglés en /en/. */
export type Lang = 'es' | 'en'

/** Un texto en cada idioma. */
export type Localized = Record<Lang, string>

/** Texto de los datos: un string (igual en los dos idiomas) o `{ es: '…', en: '…' }`. */
export type Text = string | Localized

export type Orientation = 'landscape' | 'portrait' | 'square'

/** Lugares especiales del álbum que ocupa una fotografía. */
export type PhotoRole = 'hero' | 'intro' | 'closing'

export type Tone = 'light' | 'dark'

export interface ChapterDef {
  /** Identificador corto. Se usa en photos.ts y como nombre de carpeta dentro de /fotos. */
  id: string
  /** Título visible del capítulo, en cada idioma. */
  title: Text
  /** Frase breve que acompaña al título, en cada idioma. */
  lede: Text
  /** 'dark' oscurece suavemente la página mientras se recorre el capítulo (la noche). */
  tone?: Tone
}

/**
 * Una fotografía tal y como se declara en src/data/photos.ts.
 * Solo `src` es obligatorio; todo lo demás tiene un valor por defecto razonable.
 */
export interface PhotoEntry<C extends string = string> {
  /**
   * Ruta de la foto:
   *  - 'ceremonia/IMG_0412.jpg' → una foto procesada con `npm run photos` (carpeta /fotos)
   *    o copiada tal cual en /public/images/wedding.
   *  - 'https://…' → una imagen remota (los placeholders usan Unsplash).
   */
  src: string
  /**
   * Descripción para lectores de pantalla. Muy recomendable. Un texto o uno por idioma:
   * `alt: { es: 'El primer baile', en: 'The first dance' }`. Sin `alt` se usa
   * «Ale y Pau · <capítulo>», traducido.
   */
  alt?: Text
  /** Capítulo al que pertenece. Sin capítulo, la foto solo aparece en la galería completa. */
  chapter?: C
  /** Foto protagonista: ocupa (casi) toda la pantalla y crea una pausa en la narrativa. */
  featured?: boolean
  /** Pie de foto opcional (destacadas, aisladas y visor). Un texto o `{ es, en }`. */
  caption?: Text
  /** 'hero' portada · 'intro' foto vertical de la introducción · 'closing' foto final. */
  role?: PhotoRole
  /** false → no aparece en la narrativa, solo en «Todos los recuerdos». */
  story?: boolean
  /** Punto de encuadre cuando la foto se recorta, como object-position. Ej.: '50% 30%'. */
  focus?: string
  /** Solo si la foto no pasa por `npm run photos` y no indicas width/height. */
  orientation?: Orientation
  width?: number
  height?: number
  /** Color de fondo mientras carga (lo calcula `npm run photos`). */
  color?: string
}

/** Datos que genera `npm run photos` para cada foto (src/data/photos.manifest.json). */
export interface ManifestItem {
  w: number
  h: number
  color: string
  /** Ruta base de las variantes: `${base}-${ancho}.avif|webp` */
  base: string
  widths: number[]
}
