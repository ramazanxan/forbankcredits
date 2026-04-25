import type { HTMLAttributes, PropsWithChildren } from 'react'
import { cx } from '@/utils/format'

type GlassCardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div className={cx('glass-panel rounded-[28px] p-6 md:p-8', className)} {...props}>
      {children}
    </div>
  )
}
