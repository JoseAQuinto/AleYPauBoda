import type { Photo } from './album'

/**
 * Maquetación automática de cada capítulo.
 *
 * Agrupa las fotos en «pliegos» (spreads) como en una revista: fotos a sangre,
 * parejas, tríos, fotos aisladas con mucho aire… Así, añadir o quitar fotos en
 * photos.ts nunca obliga a tocar componentes: la composición se recalcula sola.
 */
export type SpreadKind = 'feature' | 'wide' | 'solo' | 'pair' | 'trio'
export type Align = 'start' | 'end'

export interface Spread {
  kind: SpreadKind
  photos: Photo[]
  /** Lado hacia el que se inclina la composición (alterna para crear ritmo). */
  align: Align
  /** Subtipo según las orientaciones: 'pp' (dos verticales), 'll', 'mixed', 'triptych', 'mosaic'. */
  variant?: string
}

/** Ritmo base. Cada capítulo empieza en un punto distinto para no repetirse. */
const RHYTHM: SpreadKind[] = ['pair', 'wide', 'solo', 'trio', 'pair', 'solo', 'wide', 'pair']

const isPortrait = (p: Photo) => p.orientation === 'portrait'

function pairVariant(a: Photo, b: Photo) {
  if (isPortrait(a) && isPortrait(b)) return 'pp'
  if (!isPortrait(a) && !isPortrait(b)) return 'll'
  return 'mixed'
}

function trioVariant(photos: Photo[]) {
  return photos.every(isPortrait) ? 'triptych' : 'mosaic'
}

export function composeChapter(photos: Photo[], seed: number): Spread[] {
  const spreads: Spread[] = []
  let beat = seed * 3
  let align: Align = seed % 2 === 0 ? 'end' : 'start'
  const flip = () => (align = align === 'start' ? 'end' : 'start')

  let i = 0
  while (i < photos.length) {
    const current = photos[i]

    if (current.featured) {
      spreads.push({ kind: 'feature', photos: [current], align })
      i += 1
      continue
    }

    // Fotos consecutivas disponibles antes de la siguiente destacada.
    let run = 0
    while (i + run < photos.length && !photos[i + run].featured) run += 1

    let kind = RHYTHM[beat % RHYTHM.length]
    beat += 1

    if (kind === 'trio' && (run < 3 || run === 4)) kind = run >= 2 ? 'pair' : 'solo'
    if (kind === 'pair' && run < 2) kind = 'solo'
    // Si quedaría una foto huérfana justo antes de una destacada, mejor un trío.
    if (kind === 'pair' && run === 3) kind = 'trio'
    if (kind === 'wide' && isPortrait(current)) kind = run >= 2 ? 'pair' : 'solo'
    if (kind === 'solo' && !isPortrait(current)) kind = 'wide'

    const size = kind === 'trio' ? 3 : kind === 'pair' ? 2 : 1
    const group = photos.slice(i, i + size)
    const variant =
      kind === 'pair' ? pairVariant(group[0], group[1]) : kind === 'trio' ? trioVariant(group) : undefined

    spreads.push({ kind, photos: group, align, variant })
    flip()
    i += size
  }

  return spreads
}
