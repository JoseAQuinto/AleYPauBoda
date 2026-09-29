/**
 * npm run photos
 *
 * Convierte las fotos originales de /fotos en imágenes listas para la web:
 *   · AVIF + WebP en varios anchos (480 · 960 · 1600 · 2400 px) → public/images/wedding
 *   · orientación corregida, perfil sRGB y SIN metadatos (se eliminan GPS y EXIF)
 *   · dimensiones y color medio → src/data/photos.manifest.json (evita saltos de maquetación)
 *   · cada foto nueva se añade sola a src/data/photos.ts, con el capítulo según su carpeta
 *
 * Carpetas: /fotos/<capítulo>/…  (p. ej. /fotos/ceremonia/IMG_0412.jpg). Se admite
 * un prefijo numérico para ordenarlas en el explorador: /fotos/02-ceremonia/.
 * Los archivos que empiezan por «_» se ignoran; /fotos/_og.jpg genera la imagen
 * para compartir en WhatsApp (public/og-image.jpg, 1200×630).
 *
 * Opciones:  --force   regenera todas las variantes
 *            --no-sync no modifica photos.ts
 */
import crypto from 'node:crypto'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const SRC_DIR = path.join(ROOT, 'fotos')
const OUT_DIR = path.join(ROOT, 'public', 'images', 'wedding')
const PUBLIC_BASE = '/images/wedding'
const MANIFEST = path.join(ROOT, 'src', 'data', 'photos.manifest.json')
const PHOTOS_TS = path.join(ROOT, 'src', 'data', 'photos.ts')
const CHAPTERS_TS = path.join(ROOT, 'src', 'data', 'chapters.ts')
const OG_OUT = path.join(ROOT, 'public', 'og-image.jpg')
const MARKER = '// @nuevas-fotos'

const WIDTHS = [480, 960, 1600, 2400]
const FORMATS = [
  { ext: 'avif', apply: (img) => img.avif({ quality: 52, effort: 4 }) },
  { ext: 'webp', apply: (img) => img.webp({ quality: 78, effort: 5 }) },
]
const IMAGE = /\.(jpe?g|png|webp|avif|tiff?)$/i
const GENERATED = /-[0-9a-f]{8}-\d+\.(avif|webp)$/

const args = new Set(process.argv.slice(2))
const FORCE = args.has('--force')
const SYNC = !args.has('--no-sync')

const c = { dim: (s) => `\x1b[2m${s}\x1b[0m`, ok: (s) => `\x1b[32m${s}\x1b[0m`, warn: (s) => `\x1b[33m${s}\x1b[0m` }

const toPosix = (p) => p.split(path.sep).join('/')
const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

async function walk(dir) {
  if (!existsSync(dir)) return []
  const out = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out.sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
}

/** Lee id y título de cada capítulo de chapters.ts (sin necesidad de compilar TypeScript). */
async function readChapters() {
  const source = await fs.readFile(CHAPTERS_TS, 'utf8')
  const chapters = new Map()
  for (const m of source.matchAll(/id:\s*'([^']+)'\s*,\s*title:\s*'([^']+)'/g)) chapters.set(m[1], m[2])
  return chapters
}

function chapterOf(rel, chapters) {
  const folder = rel.includes('/') ? rel.split('/')[0] : ''
  const id = folder.replace(/^\d+[-_ .]*/, '')
  return chapters.has(id) ? id : undefined
}

const hex = ({ r, g, b }) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`

async function processPhoto(file, rel) {
  const buffer = await fs.readFile(file)
  const hash = crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 8)
  const dir = path.posix.dirname(rel) === '.' ? '' : path.posix.dirname(rel).split('/').map(slug).join('/')
  const name = `${slug(path.posix.parse(rel).name) || 'foto'}-${hash}`
  const base = `${PUBLIC_BASE}/${dir ? `${dir}/` : ''}${name}`
  const outDir = path.join(OUT_DIR, ...dir.split('/').filter(Boolean))

  const meta = await sharp(buffer).metadata()
  let { width = 0, height = 0 } = meta
  if ((meta.orientation ?? 1) >= 5) [width, height] = [height, width]

  const widths = WIDTHS.filter((w) => w <= width)
  if (widths.length === 0 || (width < WIDTHS[WIDTHS.length - 1] && !widths.includes(width))) widths.push(width)

  const outputs = widths.flatMap((w) => FORMATS.map((f) => ({ w, f, file: path.join(outDir, `${name}-${w}.${f.ext}`) })))
  const fresh = FORCE || outputs.some((o) => !existsSync(o.file))

  if (fresh) {
    await fs.mkdir(outDir, { recursive: true })
    for (const o of outputs) {
      const img = sharp(buffer, { failOn: 'none' }).rotate().resize({ width: o.w, withoutEnlargement: true })
      await o.f.apply(img).toFile(o.file)
    }
  }

  const { channels } = await sharp(buffer).rotate().resize(64).stats()
  const [r, g, b] = channels.map((ch) => Math.round(ch.mean))
  return {
    fresh,
    files: outputs.map((o) => o.file),
    item: { w: width, h: height, color: hex({ r, g, b }), base, widths },
  }
}

async function removeStale(keep) {
  let removed = 0
  for (const file of await walk(OUT_DIR)) {
    if (GENERATED.test(file) && !keep.has(path.resolve(file))) {
      await fs.rm(file)
      removed += 1
    }
  }
  return removed
}

async function syncPhotosTs(manifest, chapters) {
  const source = await fs.readFile(PHOTOS_TS, 'utf8')
  // Ignora los ejemplos que hay en los comentarios.
  const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
  const declared = new Set([...code.matchAll(/src:\s*(['"`])(.+?)\1/g)].map((m) => m[2]))
  const fresh = Object.keys(manifest).filter((key) => !declared.has(key))
  if (fresh.length === 0) return { added: 0, missing: [...declared].filter((k) => isMissing(k, manifest)) }

  if (!source.includes(MARKER)) {
    console.log(c.warn(`\n  No encuentro la línea «${MARKER}» en photos.ts. Añade estas fotos a mano:\n`))
    fresh.forEach((key) => console.log(`  ${entryLine(key, chapters)}`))
    return { added: 0, missing: [] }
  }

  const order = [...chapters.keys()]
  const rank = (key) => {
    const ch = chapterOf(key, chapters)
    return ch ? order.indexOf(ch) : order.length
  }
  const sorted = fresh.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, 'es', { numeric: true }))

  const lines = []
  let current = null
  for (const key of sorted) {
    const ch = chapterOf(key, chapters) ?? '—'
    if (ch !== current) {
      current = ch
      const title = chapters.get(ch) ?? 'Sin capítulo (solo en la galería)'
      lines.push(`  // ── ${title} ──`)
    }
    lines.push(`  ${entryLine(key, chapters)}`)
  }

  const markerLine = source.split('\n').find((l) => l.includes(MARKER))
  const updated = source.replace(markerLine, () => `${lines.join('\n')}\n${markerLine}`)
  await fs.writeFile(PHOTOS_TS, updated)
  return { added: fresh.length, missing: [...declared].filter((k) => isMissing(k, manifest)) }
}

function isMissing(key, manifest) {
  if (manifest[key] || /^(https?:)?\/\//.test(key) || key.startsWith('/')) return false
  return !existsSync(path.join(OUT_DIR, ...key.split('/')))
}

function entryLine(key, chapters) {
  const ch = chapterOf(key, chapters)
  const src = key.replace(/\\/g, '/').replace(/'/g, "\\'")
  const alt = ch ? `Ale y Pau · ${chapters.get(ch)}` : 'Ale y Pau'
  return ch ? `{ src: '${src}', chapter: '${ch}', alt: '${alt}' },` : `{ src: '${src}', alt: '${alt}' },`
}

async function makeOgImage() {
  const candidates = existsSync(SRC_DIR) ? (await fs.readdir(SRC_DIR)).filter((f) => /^_og\./i.test(f) && IMAGE.test(f)) : []
  if (candidates.length === 0) return false
  await sharp(path.join(SRC_DIR, candidates[0]))
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: sharp.strategy.attention })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(OG_OUT)
  return true
}

// ── Principal ────────────────────────────────────────────────────────────────

const started = Date.now()
const chapters = await readChapters()
const all = await walk(SRC_DIR)
const files = all.filter((f) => IMAGE.test(f))
const skipped = all.filter((f) => !IMAGE.test(f) && !/readme|leeme/i.test(path.basename(f)))

if (!existsSync(SRC_DIR)) await fs.mkdir(SRC_DIR, { recursive: true })
console.log(`\n  ${files.length} fotos en /fotos ${c.dim(`(${[...chapters.keys()].join(' · ')})`)}\n`)

const manifest = {}
const keep = new Set()
let generated = 0

// Dos fotos a la vez: sharp ya usa varios hilos por foto.
const queue = [...files]
async function worker() {
  while (queue.length > 0) {
    const file = queue.shift()
    const rel = toPosix(path.relative(SRC_DIR, file))
    try {
      const { fresh, files: outputs, item } = await processPhoto(file, rel)
      manifest[rel] = item
      outputs.forEach((o) => keep.add(path.resolve(o)))
      if (fresh) generated += 1
      const ch = chapterOf(rel, chapters)
      console.log(`  ${fresh ? c.ok('✓') : c.dim('·')} ${rel} ${c.dim(`${item.w}×${item.h}${ch ? '' : ' · sin capítulo'}`)}`)
    } catch (error) {
      console.log(c.warn(`  ✗ ${rel}: ${error.message}`))
    }
  }
}
await Promise.all([worker(), worker()])

const sortedManifest = Object.fromEntries(
  Object.keys(manifest)
    .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
    .map((k) => [k, manifest[k]]),
)
await fs.writeFile(MANIFEST, `${JSON.stringify(sortedManifest, null, 2)}\n`)

const removed = await removeStale(keep)
const og = await makeOgImage()
const sync = SYNC ? await syncPhotosTs(sortedManifest, chapters) : { added: 0, missing: [] }

console.log('')
console.log(`  ${c.ok('Listo')} en ${((Date.now() - started) / 1000).toFixed(1)} s`)
console.log(`  · ${generated} fotos optimizadas, ${files.length - generated} sin cambios${removed ? `, ${removed} variantes antiguas eliminadas` : ''}`)
if (sync.added) console.log(`  · ${sync.added} fotos nuevas añadidas a src/data/photos.ts (revisa alt, featured, caption…)`)
if (og) console.log('  · public/og-image.jpg generada desde /fotos/_og')
if (skipped.length) console.log(c.warn(`  · Ignorados (formato no compatible, convierte a JPG): ${skipped.map((f) => path.basename(f)).join(', ')}`))
if (sync.missing.length) console.log(c.warn(`  · En photos.ts pero no encontradas: ${sync.missing.join(', ')}`))
console.log('')
