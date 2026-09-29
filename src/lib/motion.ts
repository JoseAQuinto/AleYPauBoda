/**
 * Utilidades de movimiento compartidas: un único IntersectionObserver para las
 * apariciones y un único bucle de scroll (requestAnimationFrame) para parallax
 * y animaciones ligadas al scroll. Nada de un listener por componente.
 */

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ── Apariciones ──────────────────────────────────────────────────────────────

let revealObserver: IntersectionObserver | null = null

function getRevealObserver() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          revealObserver!.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )
  }
  return revealObserver
}

/** Marca el elemento con `.is-in` la primera vez que entra en pantalla. */
export function observeReveal(el: Element) {
  if (typeof IntersectionObserver === 'undefined') {
    el.classList.add('is-in')
    return () => {}
  }
  const io = getRevealObserver()
  io.observe(el)
  return () => io.unobserve(el)
}

// ── Bucle de scroll ──────────────────────────────────────────────────────────

type FrameCallback = (viewportHeight: number) => void

const subscribers = new Set<FrameCallback>()
let ticking = false
let listening = false

function runFrame() {
  ticking = false
  const vh = window.innerHeight
  subscribers.forEach((cb) => cb(vh))
}

function requestFrame() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(runFrame)
}

/** Llama a `cb` en cada frame en que haya scroll o cambio de tamaño. */
export function onScrollFrame(cb: FrameCallback) {
  subscribers.add(cb)
  if (!listening) {
    listening = true
    window.addEventListener('scroll', requestFrame, { passive: true })
    window.addEventListener('resize', requestFrame, { passive: true })
  }
  requestFrame()
  return () => {
    subscribers.delete(cb)
    if (subscribers.size === 0 && listening) {
      listening = false
      window.removeEventListener('scroll', requestFrame)
      window.removeEventListener('resize', requestFrame)
    }
  }
}

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
