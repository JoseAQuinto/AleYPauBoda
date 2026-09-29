/**
 * El «&» caligráfico (Pinyon Script) convertido a trazado SVG.
 * Evita descargar una tipografía entera para un solo carácter. El trazado se
 * define una vez (<AmpersandDefs />) y cada «&» lo reutiliza con <use>.
 * Se dimensiona en `em`, así que se comporta como una letra más del texto.
 */
const PATH =
  'M681 -18Q666 -21 638.5 -22.5Q611 -24 590 -24Q579 -24 561.5 -23Q544 -22 520 -19Q543 -56 564 -91Q585 -126 604 -159Q527 -221 478.5 -314Q430 -407 430 -513Q430 -627 485 -703Q540 -779 622 -779Q681 -779 730.5 -723.5Q780 -668 780 -564Q780 -507 750 -415Q720 -323 670 -224Q798 -422 910 -562Q1022 -702 1119.5 -803Q1217 -904 1303 -984Q1320 -1000 1331 -1000Q1343 -1000 1343 -991Q1343 -984 1311 -953Q1208 -853 1103 -720Q998 -587 901.5 -434Q805 -281 727 -119Q790 -93 860 -93Q987 -93 1082 -174Q1123 -211 1147.5 -257Q1172 -303 1172 -353Q1172 -356 1170 -368Q1130 -370 1130 -404Q1130 -415 1139 -424Q1148 -433 1161 -433Q1207 -433 1207 -367Q1207 -306 1177.5 -249.5Q1148 -193 1098 -152Q993 -66 854 -66Q785 -66 715 -94ZM619 -188Q687 -313 718.5 -410.5Q750 -508 750 -575Q750 -652 713.5 -695.5Q677 -739 633 -739Q597 -739 563.5 -707Q530 -675 508.5 -623Q487 -571 487 -511Q487 -413 522.5 -329.5Q558 -246 619 -188Z'

const GLYPH_ID = 'ampersand-glyph'
const VIEWBOX = '400 -1060 960 1080'

/** Se renderiza una sola vez en la página (App). */
export function AmpersandDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        <path id={GLYPH_ID} d={PATH} />
      </defs>
    </svg>
  )
}

interface AmpersandProps {
  className?: string
  /** 1 = mismo tamaño que el glifo original a ese cuerpo de letra. */
  scale?: number
}

export function Ampersand({ className, scale = 1 }: AmpersandProps) {
  const unit = scale / 2048
  return (
    <span className={className} style={{ display: 'inline-block', position: 'relative' }}>
      <svg
        viewBox={VIEWBOX}
        aria-hidden="true"
        focusable="false"
        style={{
          display: 'inline-block',
          width: `${960 * unit}em`,
          height: `${1080 * unit}em`,
          verticalAlign: `${-20 * unit}em`,
          overflow: 'visible',
          fill: 'currentColor',
        }}
      >
        <use href={`#${GLYPH_ID}`} />
      </svg>
      <span className="visually-hidden">&amp;</span>
    </span>
  )
}
