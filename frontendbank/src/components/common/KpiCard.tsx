import type { KPI } from '@/types/domain'
import { GlassCard } from '@/components/common/GlassCard'

interface KpiCardProps {
  item: KPI
}

export function KpiCard({ item }: KpiCardProps) {
  return (
    <GlassCard className="metric-card min-h-[164px]">
      <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-muted)]">{item.label}</p>
      <p className="mt-6 font-mono text-4xl font-semibold text-[var(--text-primary)]">
        {item.value}
      </p>
      {item.delta ? <p className="mt-3 text-sm text-[var(--text-muted)]">{item.delta}</p> : null}
    </GlassCard>
  )
}
