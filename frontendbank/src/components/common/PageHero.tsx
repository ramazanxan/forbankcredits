import type { PropsWithChildren, ReactNode } from 'react'
import { GlassCard } from '@/components/common/GlassCard'
import { SectionHeading } from '@/components/common/SectionHeading'
import { cx } from '@/utils/format'

interface PageHeroProps extends PropsWithChildren {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  aside?: ReactNode
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
  children,
}: PageHeroProps) {
  return (
    <GlassCard
      className={cx('grid gap-8', aside ? 'lg:grid-cols-[1.1fr_0.9fr]' : 'lg:grid-cols-1')}
    >
      <div>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
      {aside ? <div className="flex items-stretch justify-stretch">{aside}</div> : null}
    </GlassCard>
  )
}
