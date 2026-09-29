import type { Lang } from './types'

/**
 * Datos generales del álbum: lo que es igual en los dos idiomas.
 * Los textos que se leen en la web están más abajo, en `texts` (español e inglés).
 */
export const site = {
  couple: 'Ale & Pau',
  names: ['Ale', 'Pau'] as const,
  monogram: ['A', 'P'] as const,
  date: {
    iso: '2026-09-25',
    display: '25 · 09 · 2026',
  },
  place: 'Racó del Pastor · Orba, Alicante',

  /** Web oficial de la boda (se abre siempre en una pestaña nueva). */
  weddingUrl: 'https://theweddingaleypau.com/',

  seo: {
    /** Imagen para WhatsApp / redes (1200×630). Sustituye public/og-image.jpg. */
    ogImage: '/og-image.jpg',
    /**
     * URL pública del álbum, sin barra final. En Netlify se detecta sola (variable URL).
     * Rellénala solo si publicas en otro sitio o con un dominio propio.
     */
    siteUrl: '',
    /** false → se pide a los buscadores que no indexen el álbum (recomendado: es algo personal). */
    indexable: false,
    themeColor: '#fcfaf7',
  },

  /** Crédito del fotógrafo (se muestra en el pie si tiene nombre). */
  photographer: {
    name: '',
    url: '',
  },
} as const

export type Site = typeof site

/* ─────────────────────────────────────────────────────────────────────────────
   TEXTOS · español (en la raíz, /) e inglés (en /en/)
   Las dos versiones tienen exactamente las mismas claves: si falta una
   traducción, `npm run build` avisa.
   ───────────────────────────────────────────────────────────────────────────── */

const es = {
  seo: {
    title: 'Ale & Pau — 25.09.2026 | Our Memories',
    description:
      'El álbum de la boda de Ale & Pau. 25 de septiembre de 2026, Racó del Pastor. Un día. Cientos de momentos. Un recuerdo para siempre.',
    ogImageAlt: 'Ale & Pau · 25 · 09 · 2026',
    locale: 'es_ES',
  },

  /** Cómo se nombra este idioma en el selector (que muestra siempre el otro). */
  lang: { code: 'ES', name: 'Español' },

  hero: {
    kicker: 'Nuestro álbum',
    tagline: 'Un día para recordar toda la vida.',
    cue: 'Desliza para recordar',
  },

  intro: {
    eyebrow: ['Un día', 'Cientos de momentos', 'Un recuerdo para siempre'],
    /** Tres versos: cada uno ocupa una línea (el segundo va sangrado). */
    statement: ['Hay días que pasan.', 'Y otros que se quedan', 'para siempre.'],
    body: 'El 25 de septiembre de 2026 nos dijimos «sí, quiero» en Racó del Pastor, rodeados de las personas que más queremos. Aquí guardamos aquel día tal y como fue: para volver a él siempre que queramos, y para compartirlo con vosotros.',
    photoCaption: 'Racó del Pastor, Orba',
    indexTitle: 'El álbum',
  },

  gallery: {
    eyebrow: 'La galería',
    title: 'Todos los recuerdos',
    hint: 'Pulsa cualquier fotografía para verla en grande.',
  },

  finale: {
    quote: ['Y volveríamos a elegirnos,', 'una y otra vez.'],
  },

  closing: {
    thanks: 'Gracias por formar parte de nuestra historia.',
    backLabel: 'Volver a la web de la boda',
    signoff: 'Con amor',
  },

  /** Etiquetas de la interfaz y textos para lectores de pantalla. */
  ui: {
    skipLink: 'Saltar al álbum',
    home: 'volver al inicio',
    mainNav: 'Principal',
    gallery: 'Galería',
    wedding: 'The wedding',
    weddingNote: '(web de la boda, se abre en una pestaña nueva)',
    newTab: '(se abre en una pestaña nueva)',
    chapter: 'Capítulo',
    number: 'Nº',
    photos: (n: number) => `${n} ${n === 1 ? 'foto' : 'fotos'}`,
    photographs: (n: number) => `${n} fotografías`,
    viewLarge: (alt: string) => `Ver en grande: ${alt}`,
    viewPhoto: (n: number, total: number, alt: string) => `Ver fotografía ${n} de ${total}: ${alt}`,
    viewer: 'Visor de fotografías',
    close: 'Cerrar',
    previous: 'Foto anterior',
    next: 'Foto siguiente',
    photoOf: (n: number, total: number) => `Fotografía ${n} de ${total}.`,
    photography: 'Fotografía',
    toTop: 'Volver arriba',
    /** `alt` de las fotos que no tienen uno propio. */
    defaultAlt: (chapter?: string) => (chapter ? `Ale y Pau · ${chapter}` : 'Ale y Pau'),
  },
}

export type Texts = typeof es

const en: Texts = {
  seo: {
    title: 'Ale & Pau — 25.09.2026 | Our Memories',
    description:
      'The wedding album of Ale & Pau. 25 September 2026, Racó del Pastor. One day. Hundreds of moments. A memory to keep forever.',
    ogImageAlt: 'Ale & Pau · 25 · 09 · 2026',
    locale: 'en_GB',
  },

  lang: { code: 'EN', name: 'English' },

  hero: {
    kicker: 'Our album',
    tagline: 'A day to remember for a lifetime.',
    cue: 'Scroll to remember',
  },

  intro: {
    eyebrow: ['One day', 'Hundreds of moments', 'A memory to keep forever'],
    statement: ['Some days just pass.', 'Others stay with us', 'forever.'],
    body: 'On 25 September 2026 we said “I do” at Racó del Pastor, surrounded by the people we love most. Here we keep that day just as it was: to return to it whenever we like, and to share it with you.',
    photoCaption: 'Racó del Pastor, Orba',
    indexTitle: 'The album',
  },

  gallery: {
    eyebrow: 'The gallery',
    title: 'All the memories',
    hint: 'Open any photograph to see it up close.',
  },

  finale: {
    quote: ['We would choose each other', 'all over again.'],
  },

  closing: {
    thanks: 'Thank you for being part of our story.',
    backLabel: 'Back to the wedding site',
    signoff: 'With love',
  },

  ui: {
    skipLink: 'Skip to the album',
    home: 'back to the top',
    mainNav: 'Main',
    gallery: 'Gallery',
    wedding: 'The wedding',
    weddingNote: '(wedding website, opens in a new tab)',
    newTab: '(opens in a new tab)',
    chapter: 'Chapter',
    number: 'No.',
    photos: (n) => `${n} ${n === 1 ? 'photo' : 'photos'}`,
    photographs: (n) => `${n} photographs`,
    viewLarge: (alt) => `View larger: ${alt}`,
    viewPhoto: (n, total, alt) => `View photograph ${n} of ${total}: ${alt}`,
    viewer: 'Photo viewer',
    close: 'Close',
    previous: 'Previous photo',
    next: 'Next photo',
    photoOf: (n, total) => `Photograph ${n} of ${total}.`,
    photography: 'Photography',
    toTop: 'Back to top',
    defaultAlt: (chapter) => (chapter ? `Ale and Pau · ${chapter}` : 'Ale and Pau'),
  },
}

export const texts: Record<Lang, Texts> = { es, en }
