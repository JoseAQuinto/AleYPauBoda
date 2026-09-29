import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'

export { buildHead } from './lib/head'

/**
 * Se usa solo durante `npm run build` (scripts/prerender.mjs) para generar el
 * HTML estático de la página: se ve al instante, antes de que cargue el JS.
 */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
