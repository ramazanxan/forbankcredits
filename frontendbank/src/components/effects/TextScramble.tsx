import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { cx } from '@/utils/format'

const GLYPHS = '01#%&/NEUROBANK'

interface TextScrambleProps {
  text: string
  className?: string
}

export function TextScramble({ text, className }: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (!inView) {
      return
    }

    let frame = 0
    let animationId = 0

    const tick = () => {
      frame += 1
      const progress = frame / 14

      const next = text
        .split('')
        .map((character, index) => {
          if (character === ' ') {
            return ' '
          }
          if (index < progress * text.length) {
            return character
          }
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        })
        .join('')

      setDisplay(next)

      if (progress < 1) {
        animationId = window.requestAnimationFrame(tick)
      } else {
        setDisplay(text)
      }
    }

    animationId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(animationId)
  }, [inView, text])

  return (
    <span ref={ref} className={cx('inline-block', className)}>
      {display}
    </span>
  )
}
