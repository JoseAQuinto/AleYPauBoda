import { useEffect, useRef } from 'react'
import { onScrollFrame, prefersReducedMotion } from '../lib/motion'

/**
 * Parallax extremadamente sutil: escribe `--parallax` (en px) en el elemento
 * según su posición respecto al centro de la pantalla. Sin re-renders.
 */
export function useParallax<T extends HTMLElement>(strength = 40, enabled = true) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled || prefersReducedMotion()) return

    return onScrollFrame((vh) => {
      const rect = el.getBoundingClientRect()
      if (rect.bottom < -100 || rect.top > vh + 100) return
      const center = rect.top + rect.height / 2
      const progress = (center - vh / 2) / (vh / 2 + rect.height / 2) // -1 … 1
      el.style.setProperty('--parallax', `${(progress * strength).toFixed(2)}px`)
    })
  }, [strength, enabled])

  return ref
}
