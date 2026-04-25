import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/api/api'
import { Button } from '@/components/common/Button'
import { Field } from '@/components/common/Field'
import { GlassCard } from '@/components/common/GlassCard'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { PageHero } from '@/components/common/PageHero'
import { ScoreResponsePanel } from '@/components/score/ScoreResponsePanel'
import { AppShell } from '@/components/layout/AppShell'
import { useAppStore } from '@/store/appStore'
import {
  SCORE_EXTENDED_KEYS,
  defaultScoreExtendedParams,
  type ScoreExtendedKey,
  type ScoreFormData,
} from '@/types/domain'
import { calculateScore } from '@/utils/scoring'
import { cx, formatCurrency } from '@/utils/format'

type AdditionalParamItem = { title: string; text: string; placeholder: string }

const EXTENDED_VALUE_MAX = 2000

const TERM_OPTIONS = [6, 12, 24, 36, 60, 84]
const AMOUNT_CHIPS = [100_000, 500_000, 1_000_000, 5_000_000]

const DEFAULT_FORM: ScoreFormData = {
  age: 28,
  monthly_income: 0,
  employment_years: 2,
  loan_amount: 0,
  loan_term_months: 24,
  interest_rate: 16,
  past_due_30d: 0,
  inquiries_6m: 0,
  extended: defaultScoreExtendedParams(),
}

export function ScorePage() {
  const { t } = useTranslation()
  const setLastScoreResult = useAppStore((state) => state.setLastScoreResult)
  const [form, setForm] = useState<ScoreFormData>(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReturnType<typeof calculateScore> | null>(null)
  const [additionalOpen, setAdditionalOpen] = useState(false)

  const additionalItems = t('client.score.additionalParamsItems', {
    returnObjects: true,
  }) as AdditionalParamItem[]

  const preview = useMemo(() => calculateScore(form), [form])
  const isComplete =
    form.monthly_income > 0 &&
    form.employment_years >= 0 &&
    form.loan_amount > 0 &&
    form.loan_term_months > 0 &&
    form.interest_rate > 0

  const riskDots = preview.riskLevel === 'low' ? 2 : preview.riskLevel === 'medium' ? 3 : 5

  function updateField<Key extends keyof ScoreFormData>(key: Key, value: ScoreFormData[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function updateExtended(key: ScoreExtendedKey, value: string) {
    const next = value.slice(0, EXTENDED_VALUE_MAX)
    setForm((current) => ({
      ...current,
      extended: { ...current.extended, [key]: next },
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isComplete) {
      return
    }

    setLoading(true)
    const next = await api.score.predict(form)
    setResult(next)
    setLastScoreResult(next)
    setLoading(false)
  }

  return (
    <AppShell role="client">
      {loading ? <LoadingScreen /> : null}
      <PageHero
        eyebrow={t('common.dashboard')}
        title={t('client.score.title')}
        description={t('client.score.text')}
        aside={
          <GlassCard className="flex h-full flex-col justify-between">
            <p className="eyebrow">{t('common.probability')}</p>
            <div>
              <p className="font-mono text-4xl font-semibold text-[var(--text-primary)]">
                {Math.round(preview.probabilityDefault * 100)}%
              </p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Предварительный расчет до отправки запроса
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">
                  {t('client.score.previewPayment')}
                </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {formatCurrency(preview.monthlyPayment)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">
                  {t('client.score.previewOverpayment')}
                </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {formatCurrency(preview.totalOverpayment)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">
                  {t('client.score.previewRisk')}
                </span>
                <span className="flex gap-2">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background:
                          index < riskDots ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)',
                      }}
                    />
                  ))}
                </span>
              </div>
            </div>
          </GlassCard>
        }
      />

      <form className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]" onSubmit={handleSubmit}>
        <GlassCard className="space-y-7">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label={t('client.score.age')} hint={`${form.age} лет`}>
              <div className="space-y-3">
                <input
                  className="w-full accent-[var(--accent-cyan)]"
                  type="range"
                  min={18}
                  max={80}
                  value={form.age}
                  onChange={(event) => updateField('age', Number(event.target.value))}
                />
                <input
                  className="field-input"
                  type="number"
                  value={form.age}
                  onChange={(event) => updateField('age', Number(event.target.value))}
                />
              </div>
            </Field>

            <Field label={t('client.score.monthlyIncome')}>
              <input
                className="field-input"
                type="number"
                min={0}
                value={form.monthly_income || ''}
                onChange={(event) => updateField('monthly_income', Number(event.target.value))}
                placeholder="1 500 000 сом"
              />
            </Field>

            <Field label={t('client.score.employmentYears')} hint={`${form.employment_years} лет`}>
              <div className="space-y-3">
                <input
                  className="w-full accent-[var(--accent-cyan)]"
                  type="range"
                  min={0}
                  max={40}
                  value={form.employment_years}
                  onChange={(event) => updateField('employment_years', Number(event.target.value))}
                />
                <input
                  className="field-input"
                  type="number"
                  min={0}
                  value={form.employment_years}
                  onChange={(event) => updateField('employment_years', Number(event.target.value))}
                />
              </div>
            </Field>

            <Field label={t('client.score.loanAmount')}>
              <input
                className="field-input"
                type="number"
                min={0}
                value={form.loan_amount || ''}
                onChange={(event) => updateField('loan_amount', Number(event.target.value))}
                placeholder="3 500 000 сом"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {AMOUNT_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-2 text-xs text-[var(--text-primary)] transition hover:border-[var(--border)]"
                    onClick={() => updateField('loan_amount', chip)}
                  >
                    {formatCurrency(chip)}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field label={t('client.score.loanTerm')}>
            <div className="segmented-control">
              {TERM_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={form.loan_term_months === option ? 'is-active' : ''}
                  onClick={() => updateField('loan_term_months', option)}
                >
                  {option} мес.
                </button>
              ))}
            </div>
          </Field>

          <Field label={t('client.score.interestRate')} hint={`${form.interest_rate}%`}>
            <div className="space-y-3">
              <input
                className="w-full accent-[var(--accent-cyan)]"
                type="range"
                min={5}
                max={35}
                value={form.interest_rate}
                onChange={(event) => updateField('interest_rate', Number(event.target.value))}
              />
              <p className="text-sm text-[var(--text-muted)]">
                Ежемесячный платеж: {formatCurrency(preview.monthlyPayment)}
              </p>
            </div>
          </Field>

          <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
            <Field
              label={t('client.score.pastDue')}
              hint={form.past_due_30d > 2 ? 'Повышенный риск' : undefined}
              pinInputToBottom
            >
              <input
                className="field-input"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={form.past_due_30d}
                onChange={(event) => {
                  const n = Number(event.target.value)
                  updateField('past_due_30d', Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0)
                }}
              />
            </Field>

            <Field
              label={t('client.score.inquiries')}
              hint={form.inquiries_6m > 4 ? 'Повышенный риск' : undefined}
              pinInputToBottom
            >
              <input
                className="field-input"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={form.inquiries_6m}
                onChange={(event) => {
                  const n = Number(event.target.value)
                  updateField('inquiries_6m', Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0)
                }}
              />
            </Field>
          </div>

          <div className="space-y-4 border-t border-[rgba(255,255,255,0.06)] pt-6">
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setAdditionalOpen((open) => !open)}
              aria-expanded={additionalOpen}
            >
              {additionalOpen ? t('client.score.additionalParamsHide') : t('client.score.additionalParams')}
            </Button>

            <div
              className={cx(
                'grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out',
                additionalOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="min-h-0">
                <div className="space-y-5 rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 md:p-6">
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                    {t('client.score.additionalParamsIntro')}
                  </p>
                  <div className="grid gap-5 md:grid-cols-2">
                    {SCORE_EXTENDED_KEYS.map((key, index) => {
                      const item = additionalItems[index] ?? {
                        title: key,
                        text: '',
                        placeholder: '',
                      }
                      return (
                        <Field key={key} label={item.title} hint={item.text}>
                          <textarea
                            className="field-input min-h-[88px] resize-y"
                            value={form.extended[key]}
                            onChange={(event) => updateExtended(key, event.target.value)}
                            placeholder={item.placeholder}
                            rows={3}
                            maxLength={EXTENDED_VALUE_MAX}
                          />
                        </Field>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={!isComplete}>
            {t('common.calculate')}
          </Button>
        </GlassCard>

        <GlassCard className="space-y-5">
          <p className="eyebrow">{t('common.brand')}</p>
          <h3 className="font-display text-3xl font-bold text-[var(--text-primary)]">
            Предварительный расчет
          </h3>
          <div className="space-y-4 rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">
                {t('client.score.previewPayment')}
              </span>
              <span className="font-medium text-[var(--text-primary)]">
                {formatCurrency(preview.monthlyPayment)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">
                {t('client.score.previewOverpayment')}
              </span>
              <span className="font-medium text-[var(--text-primary)]">
                {formatCurrency(preview.totalOverpayment)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">P(default)</span>
              <span className="font-mono text-[var(--accent-cyan)]">
                {Math.round(preview.probabilityDefault * 100)}%
              </span>
            </div>
          </div>
        </GlassCard>
      </form>

      {result ? <ScoreResponsePanel result={result} onRetry={() => setResult(null)} /> : null}
    </AppShell>
  )
}
