import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { texts, type Texts } from '../data/site'
import type { Lang, Text } from '../data/types'
import { prefersReducedMotion } from './motion'

/**
 * Idiomas. Cada uno tiene su propia página prerenderizada (el español en /, el
 * inglés en /en/), así que los dos se ven al instante y se comparten con su vista
 * previa. Al cambiar de idioma desde la web no se recarga nada: se cambia el texto
 * con un fundido y se actualiza la URL.
 */
export const LANGS: readonly Lang[] = ['es', 'en']
export const DEFAULT_LANG: Lang = 'es'

/** Preferencia guardada al elegir idioma. La lee también el script del <head> (index.html). */
export const LANG_STORAGE_KEY = 'ap-lang'

export const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang)

/** El texto de un dato en el idioma pedido (un string vale para los dos). */
export const pick = (text: Text, lang: Lang) => (typeof text === 'string' ? text : text[lang])

const BASE = import.meta.env.BASE_URL

/** Ruta de la página de cada idioma. */
export const pathFor = (lang: Lang) => (lang === DEFAULT_LANG ? BASE : `${BASE}${lang}/`)

export function langFromPath(pathname: string): Lang {
  const first = (pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname).split('/')[0]
  return isLang(first) ? first : DEFAULT_LANG
}

interface LangApi {
  lang: Lang
  t: Texts
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangApi | null>(null)

export function LangProvider({ initial, children }: { initial: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState(initial)

  const setLang = useCallback(
    (next: Lang) => {
      if (next === lang) return
      try {
        localStorage.setItem(LANG_STORAGE_KEY, next)
      } catch {
        // Sin almacenamiento (modo privado estricto): el cambio vale solo para esta visita.
      }
      const apply = () => {
        flushSync(() => setLangState(next))
        const t = texts[next]
        document.documentElement.lang = next
        document.title = t.seo.title
        document.querySelector('meta[name="description"]')?.setAttribute('content', t.seo.description)
        history.replaceState(history.state, '', pathFor(next) + location.search + location.hash)
      }
      // Fundido entre los dos idiomas: las fotos no cambian, solo el texto parece
      // disolverse en el otro. Sin soporte o con movimiento reducido, cambio directo.
      if ('startViewTransition' in document && !prefersReducedMotion()) document.startViewTransition(apply)
      else apply()
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, t: texts[lang], setLang }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang debe usarse dentro de <LangProvider>')
  return ctx
}
