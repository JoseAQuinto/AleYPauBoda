import { useEffect, useState } from 'react'

export interface StoryProgress {
  /** Número del recuerdo que ocupa el centro de la pantalla. */
  current: number
  /** Id del capítulo en curso (el título, en cada idioma, lo pone quien lo muestra). */
  chapter: string
  /** La narrativa está en pantalla (fuera de ella, el contador se oculta). */
  active: boolean
}

/**
 * Sigue qué fotografía de la narrativa está en el centro de la pantalla.
 * Las fotos solo tienen que llevar `data-story-number` y `data-chapter`.
 */
export function useStoryProgress(containerId: string): StoryProgress {
  const [progress, setProgress] = useState<StoryProgress>({ current: 1, chapter: '', active: false })

  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container || typeof IntersectionObserver === 'undefined') return

    const band = { rootMargin: '-46% 0px -46% 0px' }

    const photoObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        const current = Number(el.dataset.storyNumber)
        const chapter = el.dataset.chapter ?? ''
        setProgress((prev) =>
          prev.current === current && prev.chapter === chapter ? prev : { ...prev, current, chapter },
        )
      }
    }, band)

    // En la apertura de un capítulo el contador marca su primer recuerdo: así no se queda
    // con un número antiguo al llegar de un salto (índice, «Volver arriba»…).
    const openerObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        const chapter = el.dataset.chapter ?? ''
        const current = Number(el.dataset.storyStart) || 1
        setProgress((prev) =>
          prev.current === current && prev.chapter === chapter ? prev : { ...prev, current, chapter },
        )
      }
    }, band)

    const containerObserver = new IntersectionObserver(
      ([entry]) => setProgress((prev) => (prev.active === entry.isIntersecting ? prev : { ...prev, active: entry.isIntersecting })),
      { rootMargin: '-35% 0px -35% 0px' },
    )

    container.querySelectorAll('[data-story-number]').forEach((el) => photoObserver.observe(el))
    container.querySelectorAll('[data-chapter-opener]').forEach((el) => openerObserver.observe(el))
    containerObserver.observe(container)

    return () => {
      photoObserver.disconnect()
      openerObserver.disconnect()
      containerObserver.disconnect()
    }
  }, [containerId])

  return progress
}
