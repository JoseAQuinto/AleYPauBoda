import { useEffect, useRef, type CSSProperties } from 'react'
import type { Photo } from '../lib/album'
import { rememberLoaded } from '../lib/loaded'

interface PictureProps {
  photo: Photo
  /** Atributo `sizes`: cuánto ocupa la foto en pantalla. Clave para no descargar de más. */
  sizes: string
  className?: string
  imgClassName?: string
  /** Solo para la portada: carga inmediata y prioridad alta. */
  priority?: boolean
  style?: CSSProperties
}

/**
 * <picture> responsive: AVIF → WebP → fallback, con dimensiones reales
 * (sin saltos de maquetación) y carga diferida salvo en la portada.
 */
export function Picture({ photo, sizes, className, imgClassName, priority = false, style }: PictureProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const { image } = photo

  // Si la imagen terminó de cargar antes de hidratar React, onLoad no llega a dispararse.
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) rememberLoaded(photo.index, img)
  }, [photo.index])

  return (
    <picture className={className}>
      {image.sources.map((source) => (
        <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
      ))}
      <img
        ref={imgRef}
        className={imgClassName}
        src={image.src}
        srcSet={image.srcSet}
        sizes={image.srcSet ? sizes : undefined}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'auto' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        draggable={false}
        onLoad={(e) => rememberLoaded(photo.index, e.currentTarget)}
        style={{ objectPosition: photo.focus, ...style }}
      />
    </picture>
  )
}
