/**
 * Textos y datos generales del álbum.
 * Todo lo que se lee en la web (salvo capítulos y fotos) se edita aquí.
 */
export const site = {
  couple: 'Ale & Pau',
  names: ['Ale', 'Pau'] as const,
  monogram: ['A', 'P'] as const,
  date: {
    iso: '2026-09-25',
    display: '25 · 09 · 2026',
    long: '25 de septiembre de 2026',
  },
  place: 'Racó del Pastor · Orba, Alicante',

  /** Web oficial de la boda (se abre siempre en una pestaña nueva). */
  weddingUrl: 'https://theweddingaleypau.com/',

  seo: {
    title: 'Ale & Pau — 25.09.2026 | Our Memories',
    description:
      'El álbum de la boda de Ale & Pau. 25 de septiembre de 2026, Racó del Pastor. Un día. Cientos de momentos. Un recuerdo para siempre.',
    /** Imagen para WhatsApp / redes (1200×630). Sustituye public/og-image.jpg. */
    ogImage: '/og-image.jpg',
    ogImageAlt: 'Ale & Pau · 25 · 09 · 2026',
    /**
     * URL pública del álbum, sin barra final. En Netlify se detecta sola (variable URL).
     * Rellénala solo si publicas en otro sitio o con un dominio propio.
     */
    siteUrl: '',
    /** false → se pide a los buscadores que no indexen el álbum (recomendado: es algo personal). */
    indexable: false,
    locale: 'es_ES',
    themeColor: '#fcfaf7',
  },

  hero: {
    kicker: 'Nuestro álbum',
    tagline: 'Un día para recordar toda la vida.',
    cue: 'Desliza para recordar',
  },

  intro: {
    eyebrow: ['Un día', 'Cientos de momentos', 'Un recuerdo para siempre'],
    statement: ['Hay días que pasan.', 'Y otros que se quedan', 'para siempre.'],
    body: 'El 25 de septiembre de 2026 nos dijimos «sí, quiero» en Racó del Pastor, rodeados de las personas que más queremos. Aquí guardamos aquel día tal y como fue: para volver a él siempre que queramos, y para compartirlo con vosotros.',
    signature: 'Ale & Pau',
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

  /** Crédito del fotógrafo (se muestra en el pie si tiene nombre). */
  photographer: {
    name: '',
    url: '',
  },
} as const

export type Site = typeof site
