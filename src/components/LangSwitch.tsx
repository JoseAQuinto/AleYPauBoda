import type { MouseEvent } from 'react'
import { texts } from '../data/site'
import { LANGS, pathFor, useLang } from '../lib/i18n'

interface LangSwitchProps {
  className?: string
  /** 'code' → EN / ES (cabecera, como en la web de la boda) · 'name' → English / Español. */
  variant?: 'code' | 'name'
}

/**
 * Enlace al otro idioma. Es un enlace de verdad a su página (funciona sin JavaScript
 * y se puede abrir en otra pestaña); con JavaScript, el cambio es instantáneo.
 */
export function LangSwitch({ className, variant = 'code' }: LangSwitchProps) {
  const { lang, setLang } = useLang()
  const other = LANGS.find((l) => l !== lang) ?? lang
  const { code, name } = texts[other].lang

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    setLang(other)
  }

  return (
    <a href={pathFor(other)} hrefLang={other} lang={other} className={className} onClick={onClick}>
      {variant === 'code' ? (
        <>
          <span aria-hidden="true">{code}</span>
          <span className="visually-hidden">{name}</span>
        </>
      ) : (
        name
      )}
    </a>
  )
}
