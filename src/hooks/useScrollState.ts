import { useEffect, useState } from 'react'
import { onScrollFrame } from '../lib/motion'

export interface ScrollState {
  /** Hemos dejado atrás la portada. */
  pastHero: boolean
  /** Bajando: el header se esconde para dejar sitio a las fotos. */
  hidden: boolean
}

/** Estado del header según el scroll. Solo provoca un render cuando algo cambia de verdad. */
export function useScrollState(): ScrollState {
  const [state, setState] = useState<ScrollState>({ pastHero: false, hidden: false })

  useEffect(() => {
    let lastY = window.scrollY
    let hidden = false

    return onScrollFrame((vh) => {
      const y = Math.max(0, window.scrollY)
      const delta = y - lastY
      if (Math.abs(delta) > 6) {
        hidden = delta > 0 && y > vh * 1.1
        lastY = y
      }
      if (y < vh * 0.5) hidden = false
      const pastHero = y > vh - 90
      setState((prev) => (prev.pastHero === pastHero && prev.hidden === hidden ? prev : { pastHero, hidden }))
    })
  }, [])

  return state
}
