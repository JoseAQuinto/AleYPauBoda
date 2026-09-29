import { site } from '../../data/site'
import { useScrollState } from '../../hooks/useScrollState'
import { Ampersand } from '../Ampersand'
import { ArrowUpRight } from '../Icons'
import styles from './Header.module.css'

export function Header() {
  const { pastHero, hidden } = useScrollState()

  return (
    <header className={styles.header} data-solid={pastHero || undefined} data-hidden={hidden || undefined}>
      <a href="#top" className={styles.brand} aria-label={`${site.couple} — volver al inicio`}>
        <span>{site.monogram[0]}</span>
        <Ampersand className={styles.amp} scale={1.25} />
        <span>{site.monogram[1]}</span>
      </a>

      <nav aria-label="Principal" className={styles.nav}>
        <a href="#galeria" className={styles.link}>
          Galería
        </a>
        <a href={site.weddingUrl} target="_blank" rel="noopener" className={styles.link}>
          The wedding
          <ArrowUpRight className={styles.arrow} />
          <span className="visually-hidden"> (web de la boda, se abre en una pestaña nueva)</span>
        </a>
      </nav>
    </header>
  )
}
