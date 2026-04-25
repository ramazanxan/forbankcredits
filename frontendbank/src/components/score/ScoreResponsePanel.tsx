import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { buttonClasses } from '@/components/common/buttonStyles'
import { GlassCard } from '@/components/common/GlassCard'
import { ScoreGauge } from '@/components/score/ScoreGauge'
import type { ScoreResult } from '@/types/domain'
import { formatPercent } from '@/utils/format'

interface ScoreResponsePanelProps {
  result: ScoreResult
  onRetry: () => void
}

export function ScoreResponsePanel({ result, onRetry }: ScoreResponsePanelProps) {
  const { t } = useTranslation()

  useEffect(() => {
    if (result.tone !== 'approved') {
      return
    }

    void confetti({
      particleCount: 240,
      spread: 120,
      origin: { y: 0.6 },
      colors: ['#00E5C3', '#39FF14', '#F0F6FF'],
    })
  }, [result.tone])

  if (result.tone === 'approved') {
    return (
      <GlassCard className="relative overflow-hidden border-[rgba(57,255,20,0.24)] bg-[linear-gradient(180deg,rgba(57,255,20,0.12),rgba(0,229,195,0.06))]">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(circle_at_bottom,rgba(57,255,20,0.22),transparent_62%)]" />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Badge tone="green">Одобрено</Badge>
            <div className="mt-5 flex items-center gap-4">
              <svg viewBox="0 0 64 64" className="h-16 w-16">
                <circle
                  cx="32"
                  cy="32"
                  r="24"
                  stroke="rgba(57,255,20,0.24)"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M20 33.5 28 41l16-19"
                  stroke="#39FF14"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="draw-check"
                />
              </svg>
              <div>
                <h3 className="font-display text-5xl font-extrabold text-[var(--text-primary)] glow-text">
                  {t('client.score.approvedTitle')}
                </h3>
                <p className="mt-3 max-w-xl text-[var(--text-muted)]">
                  Профиль выглядит устойчиво. Можно переходить к оформлению кредита без
                  дополнительной ручной проверки.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/client/apply" className={buttonClasses('primary')}>
                {t('client.score.approvedAction')}
              </Link>
              <Button variant="secondary" onClick={onRetry}>
                {t('common.retry')}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ScoreGauge value={result.probabilityDefault} score={result.score} />
          </div>
        </div>
      </GlassCard>
    )
  }

  if (result.tone === 'declined_young') {
    return (
      <GlassCard className="relative overflow-hidden border-[rgba(255,59,92,0.24)]">
        <div className="pointer-events-none absolute inset-0 animate-[flashDecline_0.3s_ease-out] bg-[rgba(255,59,92,0.15)]" />
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <Badge tone="red">Отказ</Badge>
            <h3 className="mt-5 font-display text-5xl font-extrabold text-[var(--danger)] shake-text">
              {t('client.score.youngDeclineTitle')}
            </h3>
            <p className="mt-3 text-lg text-[var(--text-primary)]">
              {t('client.score.youngDeclineSubtitle')}
            </p>
            <p className="mt-6 text-[var(--text-muted)]">{t('client.score.youngDeclineBody')}</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {result.recommendationKeys.map((key) => (
                <div
                  key={key}
                  className="rounded-[22px] border border-[rgba(255,59,92,0.18)] bg-[rgba(255,255,255,0.03)] p-4"
                >
                  <p className="text-sm text-[var(--text-primary)]">{t(`recommendations.${key}`)}</p>
                </div>
              ))}
            </div>
            <Button className="mt-8" variant="danger" onClick={onRetry}>
              {t('common.retry')}
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border border-[rgba(255,59,92,0.18)] bg-[rgba(255,255,255,0.03)] text-6xl">
              🙁
            </div>
            <ScoreGauge value={result.probabilityDefault} score={result.score} />
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="border-[rgba(255,59,92,0.24)]">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Badge tone="red">{formatPercent(result.probabilityDefault, 1)}</Badge>
          <h3 className="mt-5 font-display text-4xl font-extrabold text-[var(--text-primary)]">
            {t('client.score.adultDeclineTitle')}
          </h3>
          <p className="mt-4 text-[var(--text-muted)]">{t('client.score.adultDeclineSubtitle')}</p>

          <div className="mt-8 space-y-3">
            {result.factorKeys.map((key, index) => (
              <div
                key={key}
                className="flex items-start gap-4 rounded-[20px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4"
              >
                <span className="font-mono text-[var(--danger)]">0{index + 1}</span>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{t(`factors.${key}`)}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {t(`recommendations.${result.recommendationKeys[index] ?? result.recommendationKeys[0]}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onRetry}>
              {t('common.retry')}
            </Button>
            <Link to="/support" className={buttonClasses('ghost')}>
              {t('client.score.managerAction')}
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <ScoreGauge value={result.probabilityDefault} score={result.score} />
        </div>
      </div>
    </GlassCard>
  )
}
