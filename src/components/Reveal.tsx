import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

interface RevealProps {
  as?: ElementType
  kind?: 'fade' | 'soft'
  delay?: number
  className?: string
  id?: string
  children: ReactNode
}

/** Envoltorio que hace aparecer su contenido con suavidad al entrar en pantalla. */
export function Reveal({ as: Tag = 'div', kind = 'fade', delay = 0, className, id, children }: RevealProps) {
  const ref = useReveal<HTMLElement>()
  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      data-reveal={kind}
      style={delay ? ({ '--delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
