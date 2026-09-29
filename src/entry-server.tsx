import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'
import type { Lang } from './data/types'

export { buildHead } from './lib/head'
export { LANGS, pathFor } from './lib/i18n'

/**
 * Se usa solo durante `npm run build` (scripts/prerender.mjs) para generar el
 * HTML estático de cada idioma: se ve al instante, antes de que cargue el JS.
 */
export function render(lang: Lang) {
  return renderToString(
    <StrictMode>
      <App lang={lang} />
    </StrictMode>,
  )
}
