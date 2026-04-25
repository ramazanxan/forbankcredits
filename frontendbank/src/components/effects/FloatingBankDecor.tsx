import type { CSSProperties } from 'react'

const DECOR_ITEMS = [
  { icon: '₸', left: '8%', top: '14%', size: '22px', delay: '0s', duration: '18s' },
  { icon: '💳', left: '84%', top: '22%', size: '20px', delay: '-4s', duration: '22s' },
  { icon: '₽', left: '18%', top: '62%', size: '18px', delay: '-2s', duration: '20s' },
  { icon: '🏦', left: '76%', top: '72%', size: '19px', delay: '-7s', duration: '24s' },
  { icon: '💸', left: '43%', top: '35%', size: '18px', delay: '-11s', duration: '21s' },
  { icon: '₿', left: '56%', top: '80%', size: '17px', delay: '-9s', duration: '19s' },
]

export function FloatingBankDecor() {
  return (
    <div className="floating-bank-decor" aria-hidden="true">
      {DECOR_ITEMS.map((item) => (
        <span
          key={`${item.icon}-${item.left}-${item.top}`}
          className="floating-bank-item"
          style={
            {
              left: item.left,
              top: item.top,
              fontSize: item.size,
              animationDelay: item.delay,
              animationDuration: item.duration,
            } as CSSProperties
          }
        >
          {item.icon}
        </span>
      ))}
    </div>
  )
}
