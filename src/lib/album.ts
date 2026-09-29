import { chapters, type AlbumPhoto, type ChapterId } from '../data/chapters'
import { photos as userPhotos } from '../data/photos'
import { placeholders } from '../data/placeholders'
import manifestJson from '../data/photos.manifest.json'
import { texts } from '../data/site'
import type { ChapterDef, Lang, ManifestItem, Orientation, PhotoRole, Tone } from '../data/types'
import { buildImageSet, type ImageSet } from './images'
import { composeChapter, type Spread } from './compose'
import { LANGS, pick } from './i18n'

export interface Photo {
  key: string
  /** Posición en la galería completa (0…n-1). También la usa el visor. */
  index: number
  /** Número dentro de la narrativa (1…), si aparece en ella. */
  storyNumber?: number
  alt: string
  caption?: string
  chapter?: ChapterId
  chapterTitle?: string
  featured: boolean
  role?: PhotoRole
  inStory: boolean
  width: number
  height: number
  ratio: number
  orientation: Orientation
  focus: string
  color: string
  image: ImageSet
}

export interface AlbumChapter {
  id: ChapterId
  number: string
  title: string
  lede: string
  tone: Tone
  photos: Photo[]
  spreads: Spread[]
}

export interface Album {
  photos: Photo[]
  hero: Photo
  intro?: Photo
  closing: Photo
  chapters: AlbumChapter[]
  storyCount: number
  usingPlaceholders: boolean
}

const manifest = manifestJson as Record<string, ManifestItem>

const RATIO: Record<Orientation, number> = { landscape: 3 / 2, portrait: 2 / 3, square: 1 }

const chapterIndex = new Map<string, number>(chapters.map((c, i) => [c.id, i]))
const chapterTitle = (id: string, lang: Lang) => {
  const chapter = chapters.find((c) => c.id === id)
  return chapter ? pick(chapter.title, lang) : undefined
}

function orientationOf(ratio: number): Orientation {
  if (ratio > 1.08) return 'landscape'
  if (ratio < 0.92) return 'portrait'
  return 'square'
}

function resolve(entry: AlbumPhoto, order: number, lang: Lang): Photo {
  const meta = manifest[entry.src]
  let width = meta?.w ?? entry.width
  let height = meta?.h ?? entry.height
  if (!width || !height) {
    const ratio = RATIO[entry.orientation ?? 'landscape']
    width = 2400
    height = Math.round(2400 / ratio)
  }
  const ratio = width / height
  const title = entry.chapter ? chapterTitle(entry.chapter, lang) : undefined

  return {
    key: `${order}-${entry.src}`,
    index: order,
    alt: entry.alt ? pick(entry.alt, lang) : texts[lang].ui.defaultAlt(title),
    caption: entry.caption && pick(entry.caption, lang),
    chapter: entry.chapter,
    chapterTitle: title,
    featured: entry.featured ?? false,
    role: entry.role,
    inStory: entry.story !== false && !entry.role && !!entry.chapter && chapterIndex.has(entry.chapter),
    width,
    height,
    ratio,
    orientation: orientationOf(ratio),
    focus: entry.focus ?? '50% 50%',
    color: meta?.color ?? entry.color ?? '#e8e1d5',
    image: buildImageSet(entry.src, meta, width),
  }
}

/** Orden de la galería: por capítulo (según chapters.ts) y, dentro de cada uno, según photos.ts. */
function galleryRank(p: Photo) {
  if (p.chapter && chapterIndex.has(p.chapter)) return chapterIndex.get(p.chapter)!
  if (p.role === 'hero' || p.role === 'intro') return -1
  if (p.role === 'closing') return chapters.length + 1
  return chapters.length
}

export function buildAlbum(entries: AlbumPhoto[], lang: Lang): Album {
  const usingPlaceholders = entries.length === 0
  const source = usingPlaceholders ? placeholders : entries

  const photos = source
    .map((entry, order) => resolve(entry, order, lang))
    .map((p, order) => ({ p, order }))
    .sort((a, b) => galleryRank(a.p) - galleryRank(b.p) || a.order - b.order)
    .map(({ p }, index) => ({ ...p, index }))

  if (photos.length === 0) throw new Error('El álbum no tiene fotografías.')

  const byRole = (role: PhotoRole) => photos.find((p) => p.role === role)
  const hero =
    byRole('hero') ??
    photos.find((p) => p.featured && p.orientation === 'landscape') ??
    photos.find((p) => p.orientation === 'landscape') ??
    photos[0]
  const intro = byRole('intro') ?? photos.find((p) => p.orientation === 'portrait' && p !== hero)
  const closing =
    byRole('closing') ?? [...photos].reverse().find((p) => p.orientation === 'landscape' && p !== hero) ?? hero

  let storyNumber = 0
  const albumChapters: AlbumChapter[] = []
  chapters.forEach((c, i) => {
    const chapterPhotos = photos.filter((p) => p.chapter === c.id && p.inStory)
    if (chapterPhotos.length === 0) return
    for (const p of chapterPhotos) p.storyNumber = ++storyNumber
    const def: ChapterDef = c
    albumChapters.push({
      id: c.id,
      number: String(albumChapters.length + 1).padStart(2, '0'),
      title: pick(c.title, lang),
      lede: pick(c.lede, lang),
      tone: def.tone ?? 'light',
      photos: chapterPhotos,
      spreads: composeChapter(chapterPhotos, i),
    })
  })

  return {
    photos,
    hero,
    intro,
    closing,
    chapters: albumChapters,
    storyCount: storyNumber,
    usingPlaceholders,
  }
}

/** El álbum en cada idioma: misma estructura (orden, pliegos, números), textos traducidos. */
export const albums = Object.fromEntries(LANGS.map((lang) => [lang, buildAlbum(userPhotos, lang)])) as Record<
  Lang,
  Album
>
