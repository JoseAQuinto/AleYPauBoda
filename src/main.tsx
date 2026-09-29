import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import './styles/global.css'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// En producción el HTML llega ya renderizado (prerender): solo hay que hidratarlo.
if (container.firstElementChild) hydrateRoot(container, app)
else createRoot(container).render(app)
