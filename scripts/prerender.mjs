/**
 * Último paso de `npm run build`:
 *  1. Renderiza la app a HTML estático y lo inserta en dist/index.html: la página
 *     se ve completa antes de que cargue el JavaScript (mejor LCP) y React solo
 *     tiene que «hidratarla».
 *  2. Genera el <head> (título, Open Graph para WhatsApp, precargas) a partir de
 *     src/data/site.ts.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, '.ssr')

const entry = (await fs.readdir(ssrDir)).find((f) => /^entry-server\.m?js$/.test(f))
if (!entry) throw new Error('No se encontró el bundle de servidor en .ssr/')
const { render, buildHead } = await import(pathToFileURL(path.join(ssrDir, entry)).href)

const indexPath = path.join(dist, 'index.html')
let html = await fs.readFile(indexPath, 'utf8')
for (const marker of ['<!--album-head-->', '<!--app-html-->']) {
  if (!html.includes(marker)) throw new Error(`dist/index.html no contiene el marcador ${marker}`)
}

// Tipografías que se ven en la portada: se precargan.
const assets = await fs.readdir(path.join(dist, 'assets'))
const fonts = assets
  .filter((f) => /^(bodoni-moda-latin-opsz-italic|montserrat-latin-500-normal)-.*\.woff2$/.test(f))
  .map((f) => `/assets/${f}`)

// En Netlify, URL es la dirección pública del sitio (WhatsApp necesita og:image absoluta).
const baseUrl = process.env.URL || process.env.SITE_URL || ''

const appHtml = render()
const head = buildHead({ baseUrl, fonts })
html = html.replace('<!--album-head-->', () => head).replace('<!--app-html-->', () => appHtml)
await fs.writeFile(indexPath, html)
await fs.rm(ssrDir, { recursive: true, force: true })

const kb = (n) => `${(n / 1024).toFixed(1)} kB`
console.log(`✓ prerender: dist/index.html (${kb(Buffer.byteLength(html))})${baseUrl ? ` · URL ${baseUrl}` : ''}`)
