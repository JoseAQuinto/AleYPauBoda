import type { AlbumChapter } from '../../lib/album'
import { Chapter } from './Chapter'

export const STORY_ID = 'capitulos'

/** La narración del día, capítulo a capítulo. */
export function Story({ chapters, total }: { chapters: AlbumChapter[]; total: number }) {
  return (
    <div id={STORY_ID}>
      {chapters.map((chapter, i) => (
        <Chapter key={chapter.id} chapter={chapter} position={i} total={total} />
      ))}
    </div>
  )
}
