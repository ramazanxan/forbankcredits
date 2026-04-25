import type { ConfusionMatrix } from '@/types/domain'
import { GlassCard } from '@/components/common/GlassCard'
import { cx } from '@/utils/format'

interface ConfusionMatrixCardProps {
  matrix: ConfusionMatrix
}

const ORDER: Array<keyof ConfusionMatrix> = ['tp', 'fp', 'fn', 'tn']

export function ConfusionMatrixCard({ matrix }: ConfusionMatrixCardProps) {
  const values = ORDER.map((key) => matrix[key].value)
  const max = Math.max(...values, 1)

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Confusion Matrix</h3>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          predicted x actual
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {ORDER.map((key) => {
          const item = matrix[key]
          const intensity = item.value / max
          return (
            <div
              key={key}
              className={cx(
                'rounded-[24px] border p-5',
                key === 'tp' || key === 'tn'
                  ? 'border-[rgba(57,255,20,0.18)]'
                  : 'border-[rgba(255,184,0,0.18)]',
              )}
              style={{
                background:
                  key === 'tp' || key === 'tn'
                    ? `rgba(57,255,20,${0.08 + intensity * 0.16})`
                    : `rgba(255,184,0,${0.06 + intensity * 0.14})`,
              }}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                {item.label}
              </p>
              <p className="mt-4 font-mono text-3xl text-[var(--text-primary)]">{item.value}</p>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
