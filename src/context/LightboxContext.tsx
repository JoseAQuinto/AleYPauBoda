import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Photo } from '../lib/album'
import { Lightbox } from '../components/Lightbox/Lightbox'

interface LightboxApi {
  open: (index: number) => void
}

const LightboxContext = createContext<LightboxApi | null>(null)

export function LightboxProvider({ photos, children }: { photos: Photo[]; children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null)
  const opener = useRef<HTMLElement | null>(null)

  const open = useCallback((i: number) => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setIndex(i)
  }, [])

  const handleClosed = useCallback(() => {
    setIndex(null)
    // Devuelve el foco a la foto desde la que se abrió, sin mover el scroll.
    opener.current?.focus({ preventScroll: true })
  }, [])

  const api = useMemo(() => ({ open }), [open])

  return (
    <LightboxContext.Provider value={api}>
      {children}
      <Lightbox photos={photos} index={index} onNavigate={setIndex} onClosed={handleClosed} />
    </LightboxContext.Provider>
  )
}

export function useLightbox() {
  const ctx = useContext(LightboxContext)
  if (!ctx) throw new Error('useLightbox debe usarse dentro de <LightboxProvider>')
  return ctx
}
