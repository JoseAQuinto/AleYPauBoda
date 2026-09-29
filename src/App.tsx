import { album } from './lib/album'
import { LightboxProvider } from './context/LightboxContext'
import { useToneController } from './hooks/useToneController'
import { AmpersandDefs } from './components/Ampersand'
import { Header } from './components/Header/Header'
import { MemoryCounter } from './components/MemoryCounter/MemoryCounter'
import { Hero } from './sections/Hero/Hero'
import { Intro } from './sections/Intro/Intro'
import { Story, STORY_ID } from './sections/Story/Story'
import { Gallery } from './sections/Gallery/Gallery'
import { Finale } from './sections/Finale/Finale'
import { Closing } from './sections/Closing/Closing'

/**
 * El recorrido: portada → introducción e índice → capítulos del día →
 * todos los recuerdos → final → despedida.
 */
export function App() {
  useToneController()

  return (
    <LightboxProvider photos={album.photos}>
      <AmpersandDefs />
      <a className="skip-link" href="#historia">
        Saltar al álbum
      </a>
      <Header />
      <main>
        <Hero photo={album.hero} />
        <Intro photo={album.intro} chapters={album.chapters} total={album.photos.length} />
        <Story chapters={album.chapters} total={album.storyCount} />
        <Gallery photos={album.photos} />
        <Finale photo={album.closing} />
      </main>
      <Closing />
      <MemoryCounter total={album.storyCount} containerId={STORY_ID} />
    </LightboxProvider>
  )
}
