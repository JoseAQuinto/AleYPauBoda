import type { ChapterDef, PhotoEntry } from './types'

/**
 * Capítulos del álbum, en orden.
 *
 * - El número (01, 02…) se calcula solo según la posición.
 * - Un capítulo sin fotos no se muestra.
 * - El `id` es también el nombre de la carpeta dentro de /fotos para `npm run photos`.
 * - `tone: 'dark'` oscurece suavemente la página mientras se recorre el capítulo.
 */
export const chapters = [
  {
    id: 'antes',
    title: 'Antes del sí',
    lede: 'Los nervios, las risas y esos minutos que parecían no acabar nunca.',
  },
  {
    id: 'ceremonia',
    title: 'La ceremonia',
    lede: '18:30, Racó del Pastor. El instante en que todo lo demás desapareció.',
  },
  {
    id: 'just-married',
    title: 'Just married',
    lede: 'Salimos de la mano, entre pétalos, sabiendo que ya nada volvería a ser igual.',
  },
  {
    id: 'nosotros',
    title: 'Nosotros',
    lede: 'Un rato a solas, en mitad de todo, para mirarnos y darnos cuenta.',
  },
  {
    id: 'celebracion',
    title: 'La celebración',
    lede: 'Cóctel, música en directo y una cena larga con las personas que más queremos.',
  },
  {
    id: 'fiesta',
    title: 'La fiesta',
    lede: 'Cuando cayó la noche, solo quedaba una cosa por hacer: bailar.',
    tone: 'dark',
  },
  {
    id: 'vosotros',
    title: 'Los que estuvieron allí',
    lede: 'Sin vosotros, este día no habría sido el mismo. Gracias por estar.',
  },
] as const satisfies readonly ChapterDef[]

export type ChapterId = (typeof chapters)[number]['id']

/** Tipo de cada foto en photos.ts (con autocompletado de capítulos). */
export type AlbumPhoto = PhotoEntry<ChapterId>
