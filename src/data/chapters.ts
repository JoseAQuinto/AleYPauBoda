import type { ChapterDef, PhotoEntry } from './types'

/**
 * Capítulos del álbum, en orden.
 *
 * - El número (01, 02…) se calcula solo según la posición.
 * - Un capítulo sin fotos no se muestra.
 * - El `id` es también el nombre de la carpeta dentro de /fotos para `npm run photos`.
 * - `title` y `lede` llevan el texto en español (es) e inglés (en).
 * - `tone: 'dark'` oscurece suavemente la página mientras se recorre el capítulo.
 */
export const chapters = [
  {
    id: 'antes',
    title: { es: 'Antes del sí', en: 'Before the vows' },
    lede: {
      es: 'Los nervios, las risas y esos minutos que parecían no acabar nunca.',
      en: 'The nerves, the laughter and those minutes that seemed to last forever.',
    },
  },
  {
    id: 'ceremonia',
    title: { es: 'La ceremonia', en: 'The ceremony' },
    lede: {
      es: '18:30, Racó del Pastor. El instante en que todo lo demás desapareció.',
      en: '6.30 pm, Racó del Pastor. The moment everything else faded away.',
    },
  },
  {
    id: 'just-married',
    title: { es: 'Just married', en: 'Just married' },
    lede: {
      es: 'Salimos de la mano, entre pétalos, sabiendo que ya nada volvería a ser igual.',
      en: 'We walked out hand in hand, through the petals, knowing nothing would ever be the same.',
    },
  },
  {
    id: 'nosotros',
    title: { es: 'Nosotros', en: 'The two of us' },
    lede: {
      es: 'Un rato a solas, en mitad de todo, para mirarnos y darnos cuenta.',
      en: 'A moment alone, in the middle of it all, to look at each other and take it all in.',
    },
  },
  {
    id: 'celebracion',
    title: { es: 'La celebración', en: 'The celebration' },
    lede: {
      es: 'Cóctel, música en directo y una cena larga con las personas que más queremos.',
      en: 'Cocktails, live music and a long dinner with the people we love most.',
    },
  },
  {
    id: 'fiesta',
    title: { es: 'La fiesta', en: 'The party' },
    lede: {
      es: 'Cuando cayó la noche, solo quedaba una cosa por hacer: bailar.',
      en: 'When night fell, there was only one thing left to do: dance.',
    },
    tone: 'dark',
  },
  {
    id: 'vosotros',
    title: { es: 'Los que estuvieron allí', en: 'Those who were there' },
    lede: {
      es: 'Sin vosotros, este día no habría sido el mismo. Gracias por estar.',
      en: 'Without you, this day would not have been the same. Thank you for being there.',
    },
  },
] as const satisfies readonly ChapterDef[]

export type ChapterId = (typeof chapters)[number]['id']

/** Tipo de cada foto en photos.ts (con autocompletado de capítulos). */
export type AlbumPhoto = PhotoEntry<ChapterId>
