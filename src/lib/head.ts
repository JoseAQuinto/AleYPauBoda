import { site, texts } from '../data/site'
import type { Lang } from '../data/types'
import { albums } from './album'
import { coverSizes } from './images'
import { DEFAULT_LANG, LANGS, pathFor } from './i18n'

const esc = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

interface HeadOptions {
  /** Idioma de la página. */
  lang: Lang
  /** URL pública sin barra final (en Netlify llega en la variable de entorno URL). */
  baseUrl: string
  /** Rutas de las fuentes críticas para precargar (/assets/…woff2). */
  fonts: string[]
}

/**
 * Todo lo que va en <head> y sale de src/data/site.ts: título, descripción,
 * Open Graph / Twitter (para que el enlace quede bonito en WhatsApp) en el idioma
 * de la página, los enlaces a la otra versión (hreflang), y la precarga de la foto
 * de portada y de las dos tipografías que se ven nada más abrir.
 */
export function buildHead({ lang, baseUrl, fonts }: HeadOptions) {
  const t = texts[lang]
  const album = albums[lang]
  const base = baseUrl.replace(/\/$/, '')
  const abs = (p: string) => (/^https?:\/\//.test(p) ? p : `${base}${p}`)
  const meta = (key: 'name' | 'property', name: string, content: string) =>
    `<meta ${key}="${name}" content="${esc(content)}" />`

  // Las URL canónicas y alternativas tienen que ser absolutas: solo si conocemos la dirección.
  const alternates = base
    ? [
        `<link rel="canonical" href="${esc(abs(pathFor(lang)))}" />`,
        ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${esc(abs(pathFor(l)))}" />`),
        `<link rel="alternate" hreflang="x-default" href="${esc(abs(pathFor(DEFAULT_LANG)))}" />`,
      ]
    : []

  const head: string[] = [
    `<title>${esc(t.seo.title)}</title>`,
    meta('name', 'description', t.seo.description),
    meta('name', 'theme-color', site.seo.themeColor),
    ...(site.seo.indexable ? [] : [meta('name', 'robots', 'noindex')]),
    ...alternates,
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', site.couple),
    meta('property', 'og:locale', t.seo.locale),
    ...LANGS.filter((l) => l !== lang).map((l) => meta('property', 'og:locale:alternate', texts[l].seo.locale)),
    meta('property', 'og:title', t.seo.title),
    meta('property', 'og:description', t.seo.description),
    ...(base ? [meta('property', 'og:url', abs(pathFor(lang)))] : []),
    meta('property', 'og:image', abs(site.seo.ogImage)),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', t.seo.ogImageAlt),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', t.seo.title),
    meta('name', 'twitter:description', t.seo.description),
    meta('name', 'twitter:image', abs(site.seo.ogImage)),
  ]

  // Precarga solo de lo crítico: la foto de portada (con los mismos `sizes` que su <img>,
  // o el navegador descargaría otra versión)…
  const hero = album.hero.image
  const sizes = esc(coverSizes(album.hero))
  if (/^https:\/\//.test(hero.src)) {
    head.push(`<link rel="preconnect" href="${new URL(hero.src).origin}" />`)
  }
  if (hero.sources.length > 0) {
    // Con `type`, solo la precargan los navegadores que entienden AVIF (los demás usarán WebP).
    const [avif] = hero.sources
    head.push(
      `<link rel="preload" as="image" type="${avif.type}" imagesrcset="${esc(avif.srcSet)}" imagesizes="${sizes}" fetchpriority="high" />`,
    )
  } else if (hero.srcSet) {
    head.push(`<link rel="preload" as="image" imagesrcset="${esc(hero.srcSet)}" imagesizes="${sizes}" fetchpriority="high" />`)
  } else {
    head.push(`<link rel="preload" as="image" href="${esc(hero.src)}" fetchpriority="high" />`)
  }

  // …y las tipografías de la portada.
  for (const font of fonts) {
    head.push(`<link rel="preload" as="font" type="font/woff2" href="${esc(font)}" crossorigin />`)
  }

  return head.join('\n    ')
}
