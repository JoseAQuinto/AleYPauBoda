import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import { isLang, langFromPath } from './lib/i18n'
import './styles/global.css'

const container = document.getElementById('root')!
const prerendered = container.firstElementChild !== null

// El idioma del HTML prerenderizado manda (así la hidratación coincide siempre);
// en desarrollo no hay prerender y se deduce de la URL (/ o /en/).
const htmlLang = document.documentElement.lang
const lang = prerendered && isLang(htmlLang) ? htmlLang : langFromPath(location.pathname)
document.documentElement.lang = lang

const app = (
  <StrictMode>
    <App lang={lang} />
  </StrictMode>
)

// En producción el HTML llega ya renderizado (prerender): solo hay que hidratarlo.
if (prerendered) hydrateRoot(container, app)
else createRoot(container).render(app)
