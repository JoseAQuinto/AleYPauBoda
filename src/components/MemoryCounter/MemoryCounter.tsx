import type { CSSProperties } from 'react'
import { useStoryProgress } from '../../hooks/useStoryProgress'
import styles from './MemoryCounter.module.css'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/** Un dígito que «rueda» como un cuentafotogramas al cambiar de valor. */
function RollingDigit({ value }: { value: number }) {
  return (
    <span className={styles.digit}>
      <span className={styles.reel} style={{ '--n': value } as CSSProperties}>
        {DIGITS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </span>
    </span>
  )
}

/**
 * Detalle especial: mientras recorres la historia, un pequeño contador
 * cuenta los recuerdos (01, 02, 03…) y dice en qué capítulo estás.
 * Es decorativo (aria-hidden): el contenido ya es accesible por sí mismo.
 */
export function MemoryCounter({ total, containerId }: { total: number; containerId: string }) {
  const { current, chapter, active } = useStoryProgress(containerId)
  const width = Math.max(2, String(total).length)
  const digits = String(current).padStart(width, '0').split('').map(Number)
  const progress = total > 1 ? (current - 1) / (total - 1) : 1

  return (
    <div className={styles.counter} data-active={active || undefined} aria-hidden="true">
      <div className={styles.row}>
        <span className={styles.number}>
          {digits.map((d, i) => (
            <RollingDigit key={i} value={d} />
          ))}
        </span>
        <span className={styles.track}>
          <span className={styles.fill} style={{ transform: `scaleX(${progress})` }} />
        </span>
        <span className={styles.total}>{String(total).padStart(width, '0')}</span>
      </div>
      <span key={chapter} className={styles.chapter}>
        {chapter}
      </span>
    </div>
  )
}
