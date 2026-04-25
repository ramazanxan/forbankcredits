import type { PropsWithChildren } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface RevealProps extends PropsWithChildren {
  delay?: number
  className?: string
  from?: 'up' | 'left' | 'right'
}

export function Reveal({
  children,
  delay = 0,
  className,
  from = 'up',
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const translate =
    from === 'left' ? { x: -48, y: 0 } : from === 'right' ? { x: 48, y: 0 } : { x: 0, y: 40 }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...translate }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
