import type { AlbumChapter } from '../../lib/album'
import { useLang } from '../../lib/i18n'
import { Lines } from '../../components/Lines'
import { Reveal } from '../../components/Reveal'
import { SpreadView } from './Spreads'
import styles from './Chapter.module.css'

const ALIGN = ['start', 'end', 'center'] as const

/**
 * Un capítulo del día. No es una «sección» rígida: se abre con un hilo fino,
 * el número y un título grande, y enseguida deja paso a las fotografías.
 */
export function Chapter({ chapter, position, total }: { chapter: AlbumChapter; position: number; total: number }) {
  const { t } = useLang()
  const align = ALIGN[position % ALIGN.length]
  const titleId = `capitulo-${chapter.id}-titulo`

  return (
    <section
      id={`capitulo-${chapter.id}`}
      className={styles.chapter}
      data-tone={chapter.tone}
      aria-labelledby={titleId}
    >
      <header
        className={styles.opener}
        data-align={align}
        data-chapter-opener=""
        data-chapter={chapter.id}
        data-story-start={chapter.photos[0].storyNumber}
      >
        <Reveal kind="soft" className={styles.thread}>
          <span />
        </Reveal>
        <Reveal as="p" className={styles.kicker}>
          <span className={styles.number}>{chapter.number}</span>
          <span className={styles.rule} aria-hidden="true" />
          <span className="label">{t.ui.chapter}</span>
        </Reveal>
        <Lines as="h2" id={titleId} className={`display ${styles.title}`} lines={[chapter.title]} delay={120} />
        <Reveal as="p" className={styles.lede} delay={360}>
          {chapter.lede}
        </Reveal>
      </header>

      <div className={styles.spreads}>
        {chapter.spreads.map((spread) => (
          <SpreadView key={spread.photos[0].key} spread={spread} total={total} />
        ))}
      </div>
    </section>
  )
}
