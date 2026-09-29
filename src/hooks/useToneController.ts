import { useEffect } from 'react'

/**
 * La página cambia de «luz» según la sección que ocupa el centro de la pantalla.
 * Cada sección declara `data-tone="light|dark"`; el CSS anima la transición
 * (propiedades registradas con @property), como cuando cae la noche.
 */
export function useToneController() {
  useEffect(() => {
    const root = document.documentElement
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-tone]'))
    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const tone = (entry.target as HTMLElement).dataset.tone ?? 'light'
          if (root.dataset.tone !== tone) root.dataset.tone = tone
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => {
      io.disconnect()
      root.dataset.tone = 'light'
    }
  }, [])
}
