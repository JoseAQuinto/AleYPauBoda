import { useEffect, useRef } from 'react'
import type { Photo } from '../../lib/album'
import { site } from '../../data/site'
import { useLang } from '../../lib/i18n'
import { coverSizes } from '../../lib/images'
import { clamp, onScrollFrame, prefersReducedMotion } from '../../lib/motion'
import { Ampersand } from '../../components/Ampersand'
import { Lines } from '../../components/Lines'
import { PhotoFrame } from '../../components/PhotoFrame/PhotoFrame'
import { Reveal } from '../../components/Reveal'
import styles from './Finale.module.css'

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Final emocional: una frase limpia, con mucho aire, y después la última
 * fotografía, que se abre desde un marco pequeño hasta llenar la pantalla
 * mientras haces scroll — como una puerta que se abre por última vez.
 */
export function Finale({ photo }: { photo: Photo }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const { t } = useLang()

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (prefersReducedMotion()) {
      track.dataset.static = ''
      return
    }
    return onScrollFrame((vh) => {
      const rect = track.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > vh) return
      const p = clamp(-rect.top / Math.max(1, rect.height - vh))
      const e = easeOutCubic(clamp(p / 0.62))
      track.style.setProperty('--e', e.toFixed(4))
      track.style.setProperty('--o', clamp((p - 0.55) / 0.3).toFixed(3))
    })
  }, [])

  return (
    <section className={styles.finale} data-tone="light" aria-labelledby="finale-quote">
      <blockquote className={styles.quote}>
        <Reveal kind="soft" className={styles.ornament}>
          <Ampersand scale={2.2} />
        </Reveal>
        <Lines as="p" id="finale-quote" className={`display ${styles.quoteText}`} lines={t.finale.quote} delay={150} />
      </blockquote>

      <div ref={trackRef} className={styles.track}>
        <div className={styles.sticky}>
          <div className={styles.frame}>
            <div className={styles.zoom}>
              <PhotoFrame photo={photo} aspect="fill" sizes={coverSizes(photo)} counted={false} />
            </div>
          </div>
          <div className={styles.overlay}>
            <p className={`display ${styles.names}`}>
              {site.names[0]} <Ampersand className={styles.amp} scale={1.4} /> {site.names[1]}
            </p>
            <p className={styles.date}>
              <time dateTime={site.date.iso}>{site.date.display}</time>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
