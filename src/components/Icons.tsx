import type { SVGProps } from 'react'

/** Iconos de trazo fino, dibujados a mano para encajar con la tipografía. */
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const ArrowUpRight = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M7 17 17 7M8.5 7H17v8.5" />
  </Icon>
)

export const ArrowLeft = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M20 12H4.5M10 6.5 4.5 12l5.5 5.5" />
  </Icon>
)

export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M4 12h15.5M14 6.5l5.5 5.5-5.5 5.5" />
  </Icon>
)

export const ArrowUp = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M12 20V4.5M6.5 10 12 4.5l5.5 5.5" />
  </Icon>
)

export const Close = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
  </Icon>
)
