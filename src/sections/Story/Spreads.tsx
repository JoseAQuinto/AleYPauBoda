import type { Photo } from '../../lib/album'
import type { Spread } from '../../lib/compose'
import { PhotoFrame } from '../../components/PhotoFrame/PhotoFrame'
import { Reveal } from '../../components/Reveal'
import styles from './Spreads.module.css'

const orient = (p: Photo) => (p.orientation === 'portrait' ? 'p' : 'l')

/** Nº 07 · pie de foto — la «placa» editorial de las fotos aisladas y destacadas. */
function Plate({ photo, total }: { photo: Photo; total: number }) {
  if (!photo.storyNumber) return null
  const width = Math.max(2, String(total).length)
  return (
    <Reveal as="figcaption" kind="soft" delay={300} className={styles.plate}>
      <span className={styles.plateNo}>Nº {String(photo.storyNumber).padStart(width, '0')}</span>
      {photo.caption && (
        <>
          <span className={styles.plateRule} aria-hidden="true" />
          <span className={styles.plateCaption}>{photo.caption}</span>
        </>
      )}
    </Reveal>
  )
}

/** Pausa: foto destacada a sangre (horizontal) o enorme y centrada (vertical). */
function Feature({ photo, total }: { photo: Photo; total: number }) {
  const portrait = photo.orientation === 'portrait'
  return (
    <figure className={`${styles.feature} ${portrait ? styles.featureP : styles.featureL}`}>
      <PhotoFrame
        photo={photo}
        className={styles.featureFrame}
        sizes={portrait ? `(min-width: 768px) ${Math.ceil(92 * photo.ratio)}vh, 100vw` : '100vw'}
        parallax={portrait ? 0 : 48}
      />
      <Plate photo={photo} total={total} />
    </figure>
  )
}

/** Horizontal cinematográfica con margen a un lado. */
function Wide({ photo }: { photo: Photo }) {
  return (
    <figure className={styles.wide}>
      <PhotoFrame
        photo={photo}
        className={styles.wideFrame}
        sizes="(min-width: 1480px) 1360px, (min-width: 768px) 92vw, 100vw"
        parallax={28}
      />
    </figure>
  )
}

/** Vertical aislada, con mucho aire alrededor y su pie de foto al lado. */
function Solo({ photo, total }: { photo: Photo; total: number }) {
  return (
    <figure className={styles.solo}>
      <PhotoFrame photo={photo} className={styles.soloFrame} sizes="(min-width: 768px) 40vw, 80vw" />
      <Plate photo={photo} total={total} />
    </figure>
  )
}

const PAIR_SIZES: Record<string, [string, string]> = {
  pp: ['(min-width: 768px) 48vw, 50vw', '(min-width: 768px) 34vw, 50vw'],
  ll: ['(min-width: 768px) 58vw, 100vw', '(min-width: 768px) 42vw, 72vw'],
  mixed: ['(min-width: 768px) 58vw, 100vw', '(min-width: 768px) 58vw, 100vw'],
}

function Pair({ spread }: { spread: Spread }) {
  const [a, b] = spread.photos
  const variant = spread.variant ?? 'pp'
  const sizes =
    variant === 'mixed'
      ? spread.photos.map((p) => (orient(p) === 'p' ? '(min-width: 768px) 34vw, 64vw' : '(min-width: 768px) 58vw, 100vw'))
      : PAIR_SIZES[variant]
  return (
    <div className={`${styles.grid} ${styles.pair}`} data-variant={variant}>
      <figure className={styles.a} data-o={orient(a)}>
        <PhotoFrame photo={a} sizes={sizes[0]} />
      </figure>
      <figure className={styles.b} data-o={orient(b)}>
        <PhotoFrame photo={b} sizes={sizes[1]} delay={140} />
      </figure>
    </div>
  )
}

function Trio({ spread }: { spread: Spread }) {
  if (spread.variant === 'triptych') {
    return (
      <div className={`${styles.grid} ${styles.triptych}`}>
        {spread.photos.map((p, i) => (
          <figure key={p.key} className={[styles.a, styles.b, styles.c][i]}>
            <PhotoFrame photo={p} sizes="(min-width: 768px) 32vw, 50vw" delay={i * 120} />
          </figure>
        ))}
      </div>
    )
  }

  // Mosaico: la vertical (si hay) manda; las otras dos se apilan a su lado.
  const bigIndex = Math.max(0, spread.photos.findIndex((p) => p.orientation === 'portrait'))
  const big = spread.photos[bigIndex]
  const small = spread.photos.filter((_, i) => i !== bigIndex)
  // Las pequeñas se recortan: en móvil van en huecos 4:5, así que una horizontal
  // ocupa más ancho que su columna.
  const smallSizes = (p: Photo) =>
    `(min-width: 768px) ${orient(big) === 'p' ? 52 : 38}vw, ${Math.round(50 * Math.max(1, p.ratio / 0.8))}vw`
  return (
    <div className={`${styles.grid} ${styles.mosaic}`} data-big={orient(big)}>
      <figure className={styles.big}>
        <PhotoFrame photo={big} sizes="(min-width: 768px) 58vw, 100vw" />
      </figure>
      {small.map((p, i) => (
        <figure key={p.key} className={i === 0 ? styles.s1 : styles.s2}>
          <PhotoFrame photo={p} aspect="fill" sizes={smallSizes(p)} delay={140 + i * 120} />
        </figure>
      ))}
    </div>
  )
}

export function SpreadView({ spread, total }: { spread: Spread; total: number }) {
  const body = (() => {
    switch (spread.kind) {
      case 'feature':
        return <Feature photo={spread.photos[0]} total={total} />
      case 'wide':
        return <Wide photo={spread.photos[0]} />
      case 'solo':
        return <Solo photo={spread.photos[0]} total={total} />
      case 'pair':
        return <Pair spread={spread} />
      case 'trio':
        return <Trio spread={spread} />
    }
  })()

  return (
    <div className={styles.spread} data-kind={spread.kind} data-align={spread.align}>
      {body}
    </div>
  )
}
