import { useCallback, type CSSProperties } from 'react'
import type { Photo } from '../../lib/album'
import { useLightbox } from '../../context/LightboxContext'
import { useParallax } from '../../hooks/useParallax'
import { useReveal } from '../../hooks/useReveal'
import { Picture } from '../Picture'
import styles from './PhotoFrame.module.css'

interface PhotoFrameProps {
  photo: Photo
  sizes: string
  className?: string
  /**
   * 'natural' → respeta la proporción de la foto.
   * 'fill'    → rellena el contenedor (recortando).
   * '2 / 1'…  → proporción fija (recortando con el `focus` de la foto).
   */
  aspect?: 'natural' | 'fill' | string
  /** Intensidad del parallax en px (0 = sin parallax). */
  parallax?: number
  /** Retardo de aparición en ms. */
  delay?: number
  /** Marca la foto para el contador de recuerdos. */
  counted?: boolean
}

/** Una fotografía del álbum: aparece al hacer scroll y se abre en el visor al pulsarla. */
export function PhotoFrame({
  photo,
  sizes,
  className,
  aspect = 'natural',
  parallax = 0,
  delay = 0,
  counted = true,
}: PhotoFrameProps) {
  const { open } = useLightbox()
  const reveal = useReveal<HTMLDivElement>()
  const parallaxRef = useParallax<HTMLDivElement>(parallax, parallax > 0)

  const ref = useCallback(
    (el: HTMLDivElement | null) => {
      reveal(el)
      parallaxRef.current = el
    },
    [reveal, parallaxRef],
  )

  const style = {
    '--delay': `${delay}ms`,
    backgroundColor: photo.color,
    '--r': photo.ratio,
    '--ar': aspect === 'natural' || aspect === 'fill' ? `${photo.width} / ${photo.height}` : aspect,
    '--pmax': parallax > 0 ? `${parallax}px` : undefined,
  } as CSSProperties

  const storyAttrs =
    counted && photo.storyNumber
      ? { 'data-story-number': photo.storyNumber, 'data-chapter-title': photo.chapterTitle }
      : undefined

  return (
    <div
      ref={ref}
      className={[styles.frame, aspect === 'fill' && styles.fill, parallax > 0 && styles.parallax, className]
        .filter(Boolean)
        .join(' ')}
      data-reveal="image"
      style={style}
      {...storyAttrs}
    >
      <button
        type="button"
        className={styles.hit}
        onClick={() => open(photo.index)}
        aria-label={`Ver en grande: ${photo.alt}`}
      >
        <Picture photo={photo} sizes={sizes} className={styles.picture} imgClassName={styles.img} />
      </button>
    </div>
  )
}
