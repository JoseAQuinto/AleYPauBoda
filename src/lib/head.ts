import { site } from '../data/site'
import { album } from './album'
import { coverSizes } from './images'

const esc = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

interface HeadOptions {
  /** URL pública sin barra final (en Netlify llega en la variable de entorno URL). */
  baseUrl: string
  /** Rutas de las fuentes críticas para precargar (/assets/…woff2). */
  fonts: string[]
}

/**
 * Todo lo que va en <head> y sale de src/data/site.ts: título, descripción,
 * Open Graph / Twitter (para que el enlace quede bonito en WhatsApp), la precarga
 * de la foto de portada y de las dos tipografías que se ven nada más abrir.
 */
export function buildHead({ baseUrl, fonts }: HeadOptions) {
  const base = baseUrl.replace(/\/$/, '')
  const abs = (p: string) => (/^https?:\/\//.test(p) ? p : `${base}${p}`)
  const meta = (key: 'name' | 'property', name: string, content: string) =>
    `<meta ${key}="${name}" content="${esc(content)}" />`

  const head: string[] = [
    `<title>${esc(site.seo.title)}</title>`,
    meta('name', 'description', site.seo.description),
    meta('name', 'theme-color', site.seo.themeColor),
    ...(site.seo.indexable ? [] : [meta('name', 'robots', 'noindex')]),
    ...(base ? [`<link rel="canonical" href="${esc(base)}/" />`] : []),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', site.couple),
    meta('property', 'og:locale', site.seo.locale),
    meta('property', 'og:title', site.seo.title),
    meta('property', 'og:description', site.seo.description),
    ...(base ? [meta('property', 'og:url', `${base}/`)] : []),
    meta('property', 'og:image', abs(site.seo.ogImage)),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', site.seo.ogImageAlt),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', site.seo.title),
    meta('name', 'twitter:description', site.seo.description),
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
