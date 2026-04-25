import { cx } from '@/utils/format'

interface BrandMarkProps {
  className?: string
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cx('h-10 w-10 drop-shadow-[0_0_24px_rgba(0,229,195,0.55)]', className)}
      fill="none"
    >
      <defs>
        <linearGradient id="neuro-gradient" x1="6" x2="58" y1="8" y2="56">
          <stop offset="0%" stopColor="#00E5C3" />
          <stop offset="100%" stopColor="#39FF14" />
        </linearGradient>
      </defs>
      <rect
        x="14"
        y="18"
        width="38"
        height="28"
        rx="8"
        stroke="url(#neuro-gradient)"
        strokeWidth="2.5"
        fill="rgba(255,255,255,0.04)"
      />
      <path d="M24 32h18" stroke="url(#neuro-gradient)" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M16 18 10 12m0 0v10m0-10h10M48 18l6-6m0 0v10m0-10H44M24 18 16 8M40 46l8 10"
        stroke="url(#neuro-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="12" r="3.5" fill="#00E5C3" />
      <circle cx="54" cy="12" r="3.5" fill="#39FF14" />
      <circle cx="16" cy="8" r="3.5" fill="#00E5C3" />
      <circle cx="48" cy="56" r="3.5" fill="#39FF14" />
    </svg>
  )
}
