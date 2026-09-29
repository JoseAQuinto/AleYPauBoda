import type { CSSProperties } from 'react'
import type { Photo } from '../../lib/album'
import { useLightbox } from '../../context/LightboxContext'
import { useReveal } from '../../hooks/useReveal'
import { useLang } from '../../lib/i18n'
import { Lines } from '../../components/Lines'
import { Picture } from '../../components/Picture'
import { Reveal } from '../../components/Reveal'
import styles from './Gallery.module.css'

/**
 * Tamaño aproximado de cada miniatura según la altura de fila de cada breakpoint
 * (ver Gallery.module.css). Así el navegador descarga solo lo necesario.
 */
const thumbSizes = (ratio: number) =>
  [
    `(min-width: 1200px) ${Math.round(ratio * 330)}px`,
    `(min-width: 768px) ${Math.round(ratio * 270)}px`,
    `${Math.round(ratio * 190)}px`,
  ].join(', ')

function GalleryItem({ photo, total }: { photo: Photo; total: number }) {
  const { open } = useLightbox()
  const { t } = useLang()
  const ref = useReveal<HTMLLIElement>()
  const width = Math.max(2, String(total).length)
  return (
    <li
      ref={ref}
      className={styles.item}
      data-reveal="fade"
      style={{ '--r': photo.ratio, '--delay': `${(photo.index % 4) * 70}ms`, backgroundColor: photo.color } as CSSProperties}
    >
      <button
        type="button"
        className={styles.button}
        onClick={() => open(photo.index)}
        aria-label={t.ui.viewPhoto(photo.index + 1, total, photo.alt)}
      >
        <Picture photo={photo} sizes={thumbSizes(photo.ratio)} className={styles.picture} imgClassName={styles.img} />
        <span className={styles.no} aria-hidden="true">
          {String(photo.index + 1).padStart(width, '0')}
        </span>
      </button>
    </li>
  )
}

/**
 * «Todos los recuerdos»: hoja de contactos justificada (filas de altura uniforme
 * que respetan la proporción de cada foto). Solo CSS, sin medir nada con JS.
 */
export function Gallery({ photos }: { photos: Photo[] }) {
  const { t } = useLang()

  return (
    <section id="galeria" className={styles.gallery} data-tone="light" aria-labelledby="galeria-titulo">
      <header className={styles.head}>
        <Reveal as="p" className={`label ${styles.eyebrow}`}>
          {t.gallery.eyebrow}
        </Reveal>
        <Lines as="h2" id="galeria-titulo" className={`display ${styles.title}`} lines={[t.gallery.title]} />
        <Reveal as="p" className={styles.meta} delay={240}>
          <span className={styles.count}>{t.ui.photographs(photos.length)}</span>
          <span className={styles.hint}>{t.gallery.hint}</span>
        </Reveal>
      </header>

      <ul className={styles.grid}>
        {photos.map((photo) => (
          <GalleryItem key={photo.key} photo={photo} total={photos.length} />
        ))}
      </ul>
    </section>
  )
}
