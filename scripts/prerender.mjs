/**
 * Último paso de `npm run build`, una vez por idioma (español en /, inglés en /en/):
 *  1. Renderiza la app a HTML estático y lo inserta en la página: se ve completa
 *     antes de que cargue el JavaScript (mejor LCP) y React solo tiene que «hidratarla».
 *  2. Genera el <head> (título, Open Graph para WhatsApp, hreflang, precargas) a
 *     partir de src/data/site.ts.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, '.ssr')

const entry = (await fs.readdir(ssrDir)).find((f) => /^entry-server\.m?js$/.test(f))
if (!entry) throw new Error('No se encontró el bundle de servidor en .ssr/')
const { render, buildHead, LANGS, pathFor } = await import(pathToFileURL(path.join(ssrDir, entry)).href)

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')
for (const marker of ['<!--album-head-->', '<!--app-html-->', '<html lang="es"']) {
  if (!template.includes(marker)) throw new Error(`dist/index.html no contiene ${marker}`)
}

// Tipografías que se ven en la portada: se precargan.
const assets = await fs.readdir(path.join(dist, 'assets'))
const fonts = assets
  .filter((f) => /^(bodoni-moda-latin-opsz-italic|montserrat-latin-500-normal)-.*\.woff2$/.test(f))
  .map((f) => `/assets/${f}`)

// En Netlify, URL es la dirección pública del sitio (WhatsApp necesita og:image absoluta).
const baseUrl = process.env.URL || process.env.SITE_URL || ''

const kb = (n) => `${(n / 1024).toFixed(1)} kB`
for (const lang of LANGS) {
  const html = template
    .replace('<html lang="es"', () => `<html lang="${lang}"`)
    .replace('<!--album-head-->', () => buildHead({ lang, baseUrl, fonts }))
    .replace('<!--app-html-->', () => render(lang))
  const file = path.join(dist, pathFor(lang), 'index.html')
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, html)
  console.log(`✓ prerender: ${path.relative(root, file)} (${kb(Buffer.byteLength(html))})${baseUrl ? ` · ${baseUrl}${pathFor(lang)}` : ''}`)
}

await fs.rm(ssrDir, { recursive: true, force: true })
