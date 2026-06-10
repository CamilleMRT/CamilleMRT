interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 50 46"
      fill="none"
      aria-hidden="true"
    >
      <g
        transform="rotate(-11 25 28)"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 35.5 H35" />
        <path d="M13 35 a11 10.5 0 0 1 22 0" />
        <path d="M24 21.5 V17.5" />
        <circle cx="24" cy="15" r="2" fill="currentColor" stroke="none" />
        <path d="M30 23 L39 27 L37.4 37 L35.4 34.6 L33.4 37 L31.4 34.6 L30 36 Z" />
        <path d="M32.4 25.2 L31.5 34" />
      </g>
    </svg>
  )
}
