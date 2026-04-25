import type { PropsWithChildren } from 'react'
import { cx } from '@/utils/format'

interface BadgeProps extends PropsWithChildren {
  tone?: 'cyan' | 'green' | 'red' | 'amber'
  className?: string
}

export function Badge({ children, tone = 'cyan', className }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]',
        tone === 'cyan' && 'border-[var(--border)] bg-[rgba(0,229,195,0.08)] text-[var(--accent-cyan)]',
        tone === 'green' && 'border-[rgba(57,255,20,0.3)] bg-[rgba(57,255,20,0.08)] text-[var(--accent-green)]',
        tone === 'red' && 'border-[rgba(255,59,92,0.3)] bg-[rgba(255,59,92,0.08)] text-[var(--danger)]',
        tone === 'amber' && 'border-[rgba(255,184,0,0.3)] bg-[rgba(255,184,0,0.08)] text-[var(--warning)]',
        className,
      )}
    >
      {children}
    </span>
  )
}
