# Ale & Pau — 25 · 09 · 2026 · Our Memories

Álbum digital de la boda de Ale & Pau. Continuación de
[theweddingaleypau.com](https://theweddingaleypau.com/): la web de la boda contaba lo
que iba a pasar; esta guarda lo que pasó.

React + TypeScript + Vite. Sin librerías de animación ni de galería: todo el
movimiento es CSS + `IntersectionObserver` y un único bucle de scroll.

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # genera /dist (listo para Netlify)
npm run preview   # sirve /dist en local para probar el build
npm run photos    # optimiza las fotos de /fotos (ver abajo)
```

---

## 📸 Cómo poner las fotos de la boda

Mientras `src/data/photos.ts` esté vacío, la web muestra **fotos temporales** de
Unsplash (`src/data/placeholders.ts`). En cuanto añadas la primera foto real,
desaparecen todas.

### Forma recomendada (3 pasos)

1. **Copia los originales** en `/fotos`, en una carpeta por capítulo:

   ```
   fotos/antes/            01 · Antes del sí
   fotos/ceremonia/        02 · La ceremonia
   fotos/just-married/     03 · Just married
   fotos/nosotros/         04 · Nosotros
   fotos/celebracion/      05 · La celebración
   fotos/fiesta/           06 · La fiesta
   fotos/vosotros/         07 · Los que estuvieron allí
   ```

   Se admite un número delante para ordenarlas (`fotos/02-ceremonia/`). Dentro de cada
   carpeta, el orden alfabético de los archivos es el orden del álbum (los nombres de
   cámara tipo `IMG_0412.jpg` ya van en orden cronológico).

2. **Ejecuta** `npm run photos`. El script:
   - crea versiones **AVIF + WebP** en 480, 960, 1600 y 2400 px en `public/images/wedding/`,
   - corrige la orientación, convierte a sRGB y **elimina los metadatos** (GPS incluido),
   - guarda dimensiones y color medio en `src/data/photos.manifest.json` (así no hay
     saltos de maquetación mientras cargan),
   - **añade cada foto nueva a `src/data/photos.ts`** con su capítulo,
   - es incremental: solo procesa lo nuevo o lo que ha cambiado, y borra las variantes
     de las fotos que ya no están.

3. **Sube los cambios** (`git add . && git commit && git push`). Netlify publica solo.

> `/fotos` no se sube a GitHub (pesa mucho y lleva metadatos). Solo se suben las
> versiones optimizadas de `public/images/wedding/`.

### Afinar el álbum en `src/data/photos.ts`

Tras el paso 2 verás líneas como esta, que puedes retocar:

```ts
{ src: 'ceremonia/IMG_0412.jpg', chapter: 'ceremonia' },
```

Y así queda una foto afinada, con sus textos en los dos idiomas:

```ts
{
  src: 'ceremonia/IMG_0412.jpg', chapter: 'ceremonia', featured: true,
  alt: { es: 'Ale y Pau se dan el sí', en: 'Ale and Pau say “I do”' },
  caption: { es: 'El sí.', en: 'I do.' },
},
```

| Campo      | Para qué sirve                                                                  |
| ---------- | ------------------------------------------------------------------------------- |
| `alt`      | Descripción para lectores de pantalla. Merece la pena escribir una de verdad. Sin `alt` se usa «Ale y Pau · capítulo», traducido. |
| `featured` | `true` → foto protagonista a pantalla completa (una pausa en la historia).      |
| `caption`  | Pie de foto (se ve en las destacadas, en las aisladas y en el visor).           |
| `role`     | `'hero'` portada · `'intro'` foto vertical de la introducción · `'closing'` final |
| `story`    | `false` → solo aparece en «Todos los recuerdos», no en la narración.            |
| `focus`    | Encuadre cuando la foto se recorta, p. ej. `'50% 30%'` (subir si corta cabezas). |
| `chapter`  | Capítulo. Sin capítulo, la foto va solo a la galería completa.                  |

- **Textos de las fotos en dos idiomas:** `alt` y `caption` aceptan un texto (vale para
  los dos idiomas) o `{ es: '…', en: '…' }`.
- **El orden de las líneas** es el orden dentro de cada capítulo: para mover una foto,
  mueve su línea.
- **Portada, introducción y final:** marca una foto con `role: 'hero'`, otra (vertical)
  con `role: 'intro'` y otra con `role: 'closing'`. Si no marcas ninguna, se eligen
  solas (la primera destacada horizontal, la primera vertical y la última horizontal).
- **La maquetación es automática:** parejas, tríos, fotos aisladas, horizontales
  cinematográficas… se calculan según la orientación y el orden. Añadir o quitar fotos
  nunca obliga a tocar componentes. Las `featured` rompen el ritmo con una pausa;
  una cada 6–10 fotos queda muy bien.
- **Quitar una foto:** borra su archivo de `/fotos`, su línea de `photos.ts` y vuelve a
  ejecutar `npm run photos`.

### Imagen para WhatsApp

Guarda una foto como `fotos/_og.jpg` y ejecuta `npm run photos`: se genera
`public/og-image.jpg` (1200×630, recortada por la zona más interesante). También puedes
sustituir `public/og-image.jpg` a mano. WhatsApp guarda en caché las vistas previas:
si ya habíais compartido el enlace, puede tardar en actualizarse.

### Forma manual (sin script)

Copia una foto ya reducida para web (máx. ~2400 px) en `public/images/wedding/` y
declárala en `photos.ts` con su orientación:

```ts
{ src: 'mi-foto.jpg', chapter: 'fiesta', orientation: 'landscape', alt: '…' },
```

Funciona, pero sin AVIF/WebP ni tamaños responsive: mejor usar `npm run photos`.

### Formatos

JPG, PNG, WebP, AVIF y TIFF. Las fotos **HEIC** del iPhone hay que convertirlas antes a
JPG (el script las ignora y avisa).

---

## ✍️ Textos, capítulos y colores

| Qué                                              | Dónde                    |
| ------------------------------------------------ | ------------------------ |
| Textos en español e inglés (`texts.es`, `texts.en`) | `src/data/site.ts`    |
| Fecha, lugar, enlaces, SEO, fotógrafo            | `src/data/site.ts` (`site`) |
| Capítulos (título y frase en los dos idiomas, orden, tono noche) | `src/data/chapters.ts` |
| Fotos                                            | `src/data/photos.ts`     |
| Colores, tipografías, espaciados                  | `src/styles/global.css`  |

- Un capítulo sin fotos no se muestra. Para añadir uno (p. ej. «El día después»),
  añádelo a `chapters.ts` y crea `fotos/<id>/`.
- `tone: 'dark'` hace que la página «anochezca» suavemente al llegar a ese capítulo.
- El crédito del fotógrafo aparece en el pie al rellenar `photographer` en `site.ts`.
- Por defecto el álbum pide a los buscadores **no indexarlo** (`seo.indexable: false`):
  es algo personal. El enlace funciona y se ve bonito al compartirlo igualmente.

---

## 🌐 Idiomas (español · inglés)

- **Dos páginas:** el español vive en `/` y el inglés en `/en/`. Las dos se generan en
  el build, así que cada una se ve al instante y tiene su propia vista previa en
  WhatsApp: a los invitados que hablen inglés, mandadles el enlace terminado en `/en/`.
- **El selector**, como en la web de la boda, es el código del otro idioma al final de
  la cabecera (**EN** / **ES**); en el pie aparece también «English» / «Español». El
  cambio es instantáneo, con un fundido, y la página se queda donde estaba.
- **Se recuerda la elección:** quien elige un idioma lo verá así en sus próximas visitas.
  La primera vez que alguien entra en `/`, si su navegador no usa español (ni catalán,
  gallego o euskera), pasa directamente a `/en/`. Un enlace a `/en/` siempre se respeta.
- **Traducir un texto:** cada texto tiene su versión en `texts.es` y `texts.en`
  (`site.ts`), y los capítulos llevan `title` y `lede` con `{ es, en }`. Si a la versión
  inglesa le falta una clave, `npm run build` avisa.

---

## 🚀 Despliegue (GitHub → Netlify)

1. En Netlify: **Add new site → Import an existing project → GitHub** y elige este repo.
2. La configuración se lee de `netlify.toml` (comando `npm run build`, carpeta `dist`,
   Node 22). No hay que tocar nada más.
3. Cada `git push` a `main` publica una versión nueva.

Las etiquetas Open Graph necesitan la URL absoluta del sitio: en Netlify se toma sola
de la variable `URL`. Si publicas en otro sitio, rellena `seo.siteUrl` en `site.ts`
(o la variable de entorno `SITE_URL`).

---

## 🧭 Cómo está hecho

```
src/
├─ data/          ← lo único que hay que editar: site, chapters, photos (+ placeholders)
├─ lib/           album.ts (modelo del álbum) · compose.ts (maquetación automática)
│                 images.ts (srcset/AVIF/WebP) · motion.ts (scroll e IntersectionObserver)
│                 i18n.tsx (idioma, rutas / y /en/, cambio de idioma)
├─ hooks/         apariciones, parallax, estado del header, progreso y «luz» de la página
├─ context/       visor de fotos
├─ components/    Header, LangSwitch, Picture, PhotoFrame, Lightbox, MemoryCounter, Ampersand…
├─ sections/      Hero · Intro · Story (capítulos y pliegos) · Gallery · Finale · Closing
└─ styles/        sistema visual (tokens, tipografía, apariciones)
scripts/
├─ photos.mjs     optimización de fotos y sincronización con photos.ts
└─ prerender.mjs  genera el HTML estático y el <head> de cada idioma en el build
```

**El recorrido:** portada a pantalla completa → introducción e índice → siete capítulos
del día maquetados como una revista → «Todos los recuerdos» (hoja de contactos
justificada) → la frase final y la última foto, que se abre al hacer scroll → despedida
y vuelta a la web de la boda.

**Detalles:**

- **Contador de recuerdos.** Mientras recorres la historia, un pequeño contador en la
  esquina cuenta los recuerdos (01, 02, 03…) con dígitos que ruedan como un
  cuentafotogramas, y dice en qué capítulo estás.
- **La luz cambia.** Al llegar a «La fiesta» la página anochece poco a poco (fondo y
  texto se funden a tonos oscuros) y vuelve a amanecer después.
- **Visor:** anterior/siguiente, teclado (← → Inicio Fin Esc), deslizar a los lados en
  móvil, deslizar hacia abajo para cerrar, tocar la foto para ocultar los controles,
  contador «12 / 57» y precarga de las fotos vecinas.

**Rendimiento:**

- El HTML se genera en el build (prerender): la portada se ve antes de que cargue el JS.
- Solo se precargan la foto de portada y las dos tipografías que se ven al abrir.
- Todas las demás fotos usan `loading="lazy"`, `srcset` y `sizes` ajustados a lo que
  ocupan en pantalla, con `width`/`height` reales (sin saltos de maquetación).
- Tipografías autoalojadas (sin peticiones a Google). El «&» caligráfico es un trazado
  SVG: no se descarga una fuente entera por un carácter.

**Accesibilidad:** HTML semántico, `alt` en todas las fotos, botones reales, foco
visible, visor sobre `<dialog>` nativo (foco atrapado y devuelto al cerrar), enlace
«Saltar al álbum», contraste AA y `prefers-reduced-motion` respetado. Sin JavaScript,
todo el contenido sigue visible.

**Tipografía:** Bodoni Moda (con eje óptico: fina y contrastada en grande, legible en
pequeño) y Montserrat espaciada para las etiquetas, las mismas familias que la web de la
boda. Paleta: crema `#fcfaf7`, oliva `#2c2e25`, dorado `#b59f77`.
