import type { AlbumChapter, Photo } from '../../lib/album'
import { site } from '../../data/site'
import { Ampersand } from '../../components/Ampersand'
import { Lines } from '../../components/Lines'
import { PhotoFrame } from '../../components/PhotoFrame/PhotoFrame'
import { Reveal } from '../../components/Reveal'
import styles from './Intro.module.css'

const fotos = (n: number) => `${n} ${n === 1 ? 'foto' : 'fotos'}`

interface IntroProps {
  photo?: Photo
  chapters: AlbumChapter[]
  total: number
}

/** Introducción editorial + índice del álbum, como la primera página de una revista. */
export function Intro({ photo, chapters, total }: IntroProps) {
  return (
    <section id="historia" className={styles.intro} data-tone="light" aria-labelledby="intro-title">
      <div className={styles.grid}>
        <div className={styles.text}>
          <Reveal as="p" className={`label ${styles.eyebrow}`}>
            {/* El punto va al final de cada parte: si la línea se parte, nunca queda un punto al principio. */}
            {site.intro.eyebrow.map((part, i, all) => (
              <span key={part}>
                {part}
                {i < all.length - 1 && <span className={styles.dot} aria-hidden="true" />}
              </span>
            ))}
          </Reveal>

          <Lines as="h2" id="intro-title" className={`display ${styles.statement}`} lines={site.intro.statement} />

          <Reveal as="p" className={styles.body} delay={200}>
            {site.intro.body}
          </Reveal>

          <Reveal as="p" className={styles.signature} delay={320}>
            <span className={styles.signatureRule} aria-hidden="true" />
            {site.names[0]} <Ampersand className={styles.amp} scale={1.3} /> {site.names[1]}
          </Reveal>
        </div>

        {photo && (
          <figure className={styles.figure}>
            <PhotoFrame
              photo={photo}
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 38vw, 80vw"
              counted={false}
              parallax={26}
            />
            <figcaption className={`label ${styles.figcaption}`}>{site.intro.photoCaption}</figcaption>
          </figure>
        )}
      </div>

      <nav className={styles.index} aria-labelledby="index-title">
        <Reveal as="h3" id="index-title" className={`label ${styles.indexTitle}`}>
          {site.intro.indexTitle}
        </Reveal>
        <ol className={styles.list}>
          {chapters.map((chapter, i) => (
            <Reveal as="li" key={chapter.id} delay={i * 60}>
              <a href={`#capitulo-${chapter.id}`} className={styles.item}>
                <span className={styles.num}>{chapter.number}</span>
                <span className={styles.title}>{chapter.title}</span>
                <span className={styles.count}>{fotos(chapter.photos.length)}</span>
              </a>
            </Reveal>
          ))}
          <Reveal as="li" delay={chapters.length * 60}>
            <a href="#galeria" className={styles.item}>
              <span className={styles.num} aria-hidden="true">
                —
              </span>
              <span className={styles.title}>{site.gallery.title}</span>
              <span className={styles.count}>{fotos(total)}</span>
            </a>
          </Reveal>
        </ol>
      </nav>
    </section>
  )
}
