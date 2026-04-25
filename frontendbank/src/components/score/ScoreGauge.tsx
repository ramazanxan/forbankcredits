import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { formatPercent } from '@/utils/format'

interface ScoreGaugeProps {
  value: number
  score: number
}

export function ScoreGauge({ value, score }: ScoreGaugeProps) {
  const { t } = useTranslation()
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const progress = circumference * (1 - value)

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg viewBox="0 0 140 140" className="h-40 w-40">
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          fill="none"
        />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          stroke="url(#gauge-gradient)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 70 70)"
        />
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#39FF14" />
            <stop offset="100%" stopColor="#00E5C3" />
          </linearGradient>
        </defs>
      </svg>
      <div className="-mt-32 text-center">
        <p className="font-mono text-3xl font-semibold text-[var(--text-primary)]">
          {formatPercent(value, 1)}
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          {t('common.probability')}
        </p>
      </div>
      <div className="text-center">
        <p className="font-mono text-2xl font-semibold text-[var(--text-primary)]">{score}</p>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          Кредитный скор
        </p>
      </div>
    </div>
  )
}
