import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

interface LinesProps {
  as?: ElementType
  lines: readonly ReactNode[]
  className?: string
  lineClassName?: string
  /** Retardo inicial en ms. */
  delay?: number
  id?: string
}

/**
 * Texto que aparece línea a línea, subiendo desde una máscara.
 * Las líneas se separan con espacios reales para que los lectores de pantalla
 * lean la frase completa con naturalidad.
 */
export function Lines({ as: Tag = 'p', lines, className, lineClassName, delay = 0, id }: LinesProps) {
  const ref = useReveal<HTMLElement>()
  return (
    <Tag ref={ref} id={id} className={className} data-reveal="lines" style={{ '--delay': `${delay}ms` } as CSSProperties}>
      {lines.map((line, i) => (
        <span key={i} className={['line', lineClassName].filter(Boolean).join(' ')}>
          <span className="line-inner" style={{ '--i': i } as CSSProperties}>
            {line}
          </span>
          {i < lines.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}
