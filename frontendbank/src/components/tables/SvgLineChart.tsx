import type { CurvePoint } from '@/types/domain'
import { GlassCard } from '@/components/common/GlassCard'

interface SvgLineChartProps {
  title: string
  points: CurvePoint[]
  xLabel: string
  yLabel: string
}

export function SvgLineChart({ title, points, xLabel, yLabel }: SvgLineChartProps) {
  const width = 320
  const height = 220
  const padding = 24

  const path = points
    .slice()
    .sort((left, right) => left.x - right.x)
    .map((point, index) => {
      const x = padding + point.x * (width - padding * 2)
      const y = height - padding - point.y * (height - padding * 2)
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          SVG chart
        </p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <defs>
          <linearGradient id="line-gradient" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#00E5C3" />
            <stop offset="100%" stopColor="#39FF14" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="24"
          fill="rgba(255,255,255,0.02)"
        />
        {[0, 0.25, 0.5, 0.75, 1].map((grid) => (
          <g key={grid}>
            <line
              x1={padding}
              y1={height - padding - grid * (height - padding * 2)}
              x2={width - padding}
              y2={height - padding - grid * (height - padding * 2)}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 8"
            />
            <line
              x1={padding + grid * (width - padding * 2)}
              y1={padding}
              x2={padding + grid * (width - padding * 2)}
              y2={height - padding}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4 8"
            />
          </g>
        ))}
        <path d={path} stroke="url(#line-gradient)" strokeWidth="4" fill="none" />
      </svg>
      <div className="flex justify-between text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
        <span>{xLabel}</span>
        <span>{yLabel}</span>
      </div>
    </GlassCard>
  )
}
