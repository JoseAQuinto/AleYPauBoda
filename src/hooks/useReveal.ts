import { useCallback, useRef } from 'react'
import { observeReveal } from '../lib/motion'

/**
 * Devuelve un ref que añade la clase `.is-in` cuando el elemento aparece en pantalla.
 * El estilo de la animación lo decide el CSS (atributo `data-reveal`).
 */
export function useReveal<T extends Element>() {
  const cleanup = useRef<(() => void) | null>(null)
  return useCallback((el: T | null) => {
    cleanup.current?.()
    cleanup.current = el ? observeReveal(el) : null
  }, [])
}
