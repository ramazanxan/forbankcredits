import type { HistogramBin } from '@/types/domain'
import { GlassCard } from '@/components/common/GlassCard'

interface HistogramChartProps {
  title: string
  bins: HistogramBin[]
}

export function HistogramChart({ title, bins }: HistogramChartProps) {
  const max = Math.max(...bins.map((bin) => bin.count), 1)

  return (
    <GlassCard className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          histogram
        </p>
      </div>
      <div className="flex min-h-[220px] items-end gap-3">
        {bins.map((bin) => (
          <div key={bin.label} className="flex flex-1 flex-col items-center gap-3">
            <div className="w-full rounded-full bg-[rgba(255,255,255,0.04)] p-1">
              <div
                className="rounded-full bg-[linear-gradient(180deg,var(--accent-cyan),var(--accent-green))] shadow-[0_0_24px_var(--accent-glow)]"
                style={{ height: `${32 + (bin.count / max) * 140}px` }}
              />
            </div>
            <div className="text-center">
              <p className="font-mono text-sm text-[var(--text-primary)]">{bin.count}</p>
              <p className="text-xs text-[var(--text-muted)]">{bin.label}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
