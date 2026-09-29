import { site } from '../../data/site'
import { useScrollState } from '../../hooks/useScrollState'
import { useLang } from '../../lib/i18n'
import { Ampersand } from '../Ampersand'
import { ArrowUpRight } from '../Icons'
import { LangSwitch } from '../LangSwitch'
import styles from './Header.module.css'

export function Header() {
  const { pastHero, hidden } = useScrollState()
  const { t } = useLang()

  return (
    <header className={styles.header} data-solid={pastHero || undefined} data-hidden={hidden || undefined}>
      <a href="#top" className={styles.brand} aria-label={`${site.couple} — ${t.ui.home}`}>
        <span>{site.monogram[0]}</span>
        <Ampersand className={styles.amp} scale={1.25} />
        <span>{site.monogram[1]}</span>
      </a>

      <nav aria-label={t.ui.mainNav} className={styles.nav}>
        <a href="#galeria" className={styles.link}>
          {t.ui.gallery}
        </a>
        <a href={site.weddingUrl} target="_blank" rel="noopener" className={styles.link}>
          {t.ui.wedding}
          <ArrowUpRight className={styles.arrow} />
          <span className="visually-hidden"> {t.ui.weddingNote}</span>
        </a>
        {/* Como en la web de la boda: el código del otro idioma, al final. */}
        <LangSwitch className={styles.link} />
      </nav>
    </header>
  )
}
