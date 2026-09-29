import { site } from '../../data/site'
import { Ampersand } from '../../components/Ampersand'
import { ArrowUp, ArrowUpRight } from '../../components/Icons'
import { Lines } from '../../components/Lines'
import { Reveal } from '../../components/Reveal'
import styles from './Closing.module.css'

/** Despedida, enlace a la web de la boda y pie. */
export function Closing() {
  const year = site.date.iso.slice(0, 4)
  const { photographer } = site

  return (
    <footer className={styles.closing} data-tone="light">
      <div className={styles.inner}>
        <Reveal kind="soft" className={styles.monogram}>
          <span>{site.monogram[0]}</span>
          <Ampersand className={styles.amp} scale={1.3} />
          <span>{site.monogram[1]}</span>
        </Reveal>

        <Lines as="p" className={`display ${styles.thanks}`} lines={[site.closing.thanks]} />

        <Reveal className={styles.ctaWrap} delay={250}>
          <a className={styles.cta} href={site.weddingUrl} target="_blank" rel="noopener">
            <span>{site.closing.backLabel}</span>
            <ArrowUpRight className={styles.ctaIcon} />
            <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
          </a>
        </Reveal>

        <Reveal as="p" kind="soft" className={styles.place} delay={400}>
          {site.place}
        </Reveal>
      </div>

      <div className={styles.bottom}>
        {/* Aquí el «&» va en Montserrat: el caligráfico, a este cuerpo, parecía una marca de verificación. */}
        <p>
          © {year} {site.couple} · {site.closing.signoff}
        </p>
        {photographer.name && (
          <p>
            Fotografía ·{' '}
            {photographer.url ? (
              <a href={photographer.url} target="_blank" rel="noopener" className={styles.textLink}>
                {photographer.name}
              </a>
            ) : (
              photographer.name
            )}
          </p>
        )}
        <a href="#top" className={styles.toTop}>
          Volver arriba <ArrowUp aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
