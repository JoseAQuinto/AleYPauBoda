import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from 'react'
import type { Photo } from '../../lib/album'
import { loadedSrc } from '../../lib/loaded'
import { prefersReducedMotion } from '../../lib/motion'
import { ArrowLeft, ArrowRight, Close } from '../Icons'
import styles from './Lightbox.module.css'

interface LightboxProps {
  photos: Photo[]
  index: number | null
  onNavigate: (index: number) => void
  onClosed: () => void
}

const pad = (n: number, width: number) => String(n).padStart(width, '0')

/** Imagen grande del visor (y de las vecinas, que se precargan ocultas). */
function LargeImage({ photo, hidden = false }: { photo: Photo; hidden?: boolean }) {
  const { image } = photo
  return (
    <picture className={hidden ? styles.preload : styles.picture} aria-hidden={hidden || undefined}>
      {image.sources.map((s) => (
        <source key={s.type} type={s.type} srcSet={s.srcSet} sizes="100vw" />
      ))}
      <img
        className={styles.full}
        src={image.src}
        srcSet={image.srcSet}
        sizes={image.srcSet ? '100vw' : undefined}
        width={photo.width}
        height={photo.height}
        alt={hidden ? '' : photo.alt}
        decoding="async"
        draggable={false}
        onLoad={(e) => (e.currentTarget.dataset.loaded = '')}
        style={{ objectPosition: photo.focus }}
      />
    </picture>
  )
}

/**
 * Visor a pantalla completa sobre <dialog> nativo (foco atrapado, Esc y capa superior
 * gratis). Anterior / siguiente con botones, teclado (← →, Inicio, Fin) y gestos:
 * deslizar a los lados cambia de foto; deslizar hacia abajo cierra.
 */
export function Lightbox({ photos, index, onNavigate, onClosed }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)
  const [direction, setDirection] = useState(0)
  const [chromeHidden, setChromeHidden] = useState(false)

  const total = photos.length
  const isOpen = index !== null
  const photo = index !== null ? photos[index] : null
  const width = Math.max(2, String(total).length)

  // ── Abrir / cerrar ─────────────────────────────────────────────────────────
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !isOpen || dialog.open) return
    document.documentElement.classList.add('lb-open')
    setClosing(false)
    setChromeHidden(false)
    setDirection(0)
    dialog.showModal()
  }, [isOpen])

  const finishClose = useCallback(() => {
    document.documentElement.classList.remove('lb-open')
    const dialog = dialogRef.current
    if (dialog?.open) dialog.close()
    setClosing(false)
    onClosed()
  }, [onClosed])

  const closeTimer = useRef<number | undefined>(undefined)
  const requestClose = useCallback(() => {
    if (closeTimer.current) return
    if (prefersReducedMotion()) return finishClose()
    setClosing(true)
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = undefined
      finishClose()
    }, 360)
  }, [finishClose])

  useEffect(() => () => document.documentElement.classList.remove('lb-open'), [])

  // ── Navegación ─────────────────────────────────────────────────────────────
  const go = useCallback(
    (step: number) => {
      if (index === null) return
      setDirection(step)
      onNavigate((index + step + total) % total)
    },
    [index, total, onNavigate],
  )

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Home') onNavigate(0)
      else if (e.key === 'End') onNavigate(total - 1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, go, onNavigate, total])

  // ── Gestos ─────────────────────────────────────────────────────────────────
  const drag = useRef<{ x: number; y: number; id: number; axis?: 'x' | 'y' } | null>(null)
  const lastPointer = useRef<string>('mouse')
  const suppressClick = useRef(false)

  const setDrag = (dx: number, dy: number) => {
    const stage = stageRef.current
    if (!stage) return
    stage.style.setProperty('--dx', `${dx}px`)
    stage.style.setProperty('--dy', `${Math.max(0, dy)}px`)
    dialogRef.current?.style.setProperty('--fade', String(1 - Math.min(Math.max(0, dy) / 480, 0.55)))
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    lastPointer.current = e.pointerType
    if (e.pointerType === 'mouse' && e.button !== 0) return
    // Con zoom de pellizco activo dejamos que el navegador mueva la imagen.
    if (window.visualViewport && window.visualViewport.scale > 1.01) return
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.axis) {
      if (Math.hypot(dx, dy) < 10) return
      d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      e.currentTarget.setPointerCapture(e.pointerId)
      e.currentTarget.dataset.dragging = ''
    }
    if (d.axis === 'x') setDrag(dx, 0)
    else setDrag(0, dy)
  }

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    drag.current = null
    if (!d || d.id !== e.pointerId || !d.axis) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    delete e.currentTarget.dataset.dragging
    // El click que sigue a un arrastre no debe cerrar el visor; si el navegador no
    // lo emite, la marca se limpia sola para no tragarse el siguiente toque real.
    suppressClick.current = true
    window.setTimeout(() => (suppressClick.current = false), 0)
    setDrag(0, 0)
    if (d.axis === 'x' && Math.abs(dx) > 56) go(dx < 0 ? 1 : -1)
    else if (d.axis === 'y' && dy > 110) requestClose()
  }

  const onStageClick = (e: MouseEvent<HTMLDivElement>) => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    const onImage = (e.target as HTMLElement).closest('figure')
    if (!onImage) requestClose()
    // En táctil, tocar la foto muestra u oculta los controles (modo inmersivo).
    else if (lastPointer.current !== 'mouse') setChromeHidden((h) => !h)
  }

  const prev = index !== null ? photos[(index - 1 + total) % total] : null
  const next = index !== null ? photos[(index + 1) % total] : null
  const underlay = photo ? (loadedSrc(photo.index) ?? photo.image.thumb) : undefined

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Visor de fotografías"
      data-closing={closing || undefined}
      data-chrome-hidden={chromeHidden || undefined}
      onCancel={(e) => {
        e.preventDefault()
        requestClose()
      }}
    >
      {photo && (
        <>
          <div className={styles.top}>
            <p className={styles.count} aria-hidden="true">
              <span className={styles.current}>{pad(photo.index + 1, width)}</span>
              <span className={styles.slash}>/</span>
              <span className={styles.total}>{pad(total, width)}</span>
            </p>
            {photo.chapterTitle && <p className={styles.chapter}>{photo.chapterTitle}</p>}
            <button type="button" className={styles.close} onClick={requestClose} autoFocus>
              <span className={styles.closeLabel}>Cerrar</span>
              <Close className={styles.closeIcon} />
            </button>
          </div>

          <div
            ref={stageRef}
            className={styles.stage}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClick={onStageClick}
          >
            <figure
              key={photo.index}
              className={styles.figure}
              style={{ '--r': photo.ratio, '--from': direction, backgroundColor: photo.color } as CSSProperties}
            >
              {underlay && <img className={styles.under} src={underlay} alt="" aria-hidden="true" draggable={false} />}
              <LargeImage photo={photo} />
            </figure>
          </div>

          <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => go(-1)} aria-label="Foto anterior">
            <ArrowLeft />
          </button>
          <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label="Foto siguiente">
            <ArrowRight />
          </button>

          <div className={styles.bottom}>
            {photo.caption ? (
              <p className={styles.caption}>{photo.caption}</p>
            ) : (
              <p className={styles.chapterMobile}>{photo.chapterTitle}</p>
            )}
          </div>

          <p className="visually-hidden" aria-live="polite">
            {`Fotografía ${photo.index + 1} de ${total}. ${photo.alt}`}
          </p>

          {/* Precarga de las fotos vecinas para que el paso sea instantáneo. */}
          {prev && prev !== photo && <LargeImage photo={prev} hidden />}
          {next && next !== photo && next !== prev && <LargeImage photo={next} hidden />}
        </>
      )}
    </dialog>
  )
}
