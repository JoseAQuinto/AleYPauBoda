import { useEffect, useRef, type CSSProperties } from 'react'
import type { Photo } from '../../lib/album'
import { site } from '../../data/site'
import { coverSizes } from '../../lib/images'
import { onScrollFrame, prefersReducedMotion } from '../../lib/motion'
import { Ampersand } from '../../components/Ampersand'
import { Picture } from '../../components/Picture'
import styles from './Hero.module.css'

const delay = (d: string) => ({ '--d': d }) as CSSProperties

/**
 * Portada a pantalla completa. La foto entra con un zoom lentísimo, el texto
 * aparece por capas (cuando la tipografía ya está lista) y al hacer scroll la
 * imagen se desplaza con un parallax mínimo mientras el texto se desvanece.
 */
export function Hero({ photo }: { photo: Photo }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    return onScrollFrame((vh) => {
      const y = window.scrollY
      if (y > vh * 1.2) return
      const p = Math.min(1, y / vh)
      el.style.setProperty('--hero-shift', `${(y * 0.28).toFixed(1)}px`)
      el.style.setProperty('--hero-fade', (1 - p * 1.35).toFixed(3))
      el.style.setProperty('--hero-lift', `${(y * -0.12).toFixed(1)}px`)
    })
  }, [])

  return (
    <section ref={ref} id="top" className={styles.hero} data-tone="light" aria-labelledby="hero-title">
      <div className={styles.media}>
        <Picture photo={photo} sizes={coverSizes(photo)} priority className={styles.picture} imgClassName={styles.img} />
      </div>
      <div className={styles.veil} aria-hidden="true" />

      <div className={styles.content}>
        <p className={`label label-center ${styles.kicker} hero-item`} style={delay('0.15s')}>
          {site.hero.kicker}
        </p>
        <h1 id="hero-title" className={`display ${styles.title}`}>
          <span className="hero-item" style={delay('0.35s')}>
            {site.names[0]}
          </span>{' '}
          <span className={`${styles.amp} hero-item`} style={delay('0.6s')}>
            <Ampersand scale={1.5} />
          </span>{' '}
          <span className="hero-item" style={delay('0.5s')}>
            {site.names[1]}
          </span>
        </h1>
        <p className={`${styles.date} hero-item`} style={delay('0.95s')}>
          <time dateTime={site.date.iso}>{site.date.display}</time>
        </p>
        <p className={`${styles.tagline} hero-item`} style={delay('1.15s')}>
          {site.hero.tagline}
        </p>
      </div>

      <a href="#historia" className={`${styles.cue} hero-item`} style={delay('1.6s')}>
        <span className="label">{site.hero.cue}</span>
        <span className={styles.cueLine} aria-hidden="true" />
      </a>
    </section>
  )
}
