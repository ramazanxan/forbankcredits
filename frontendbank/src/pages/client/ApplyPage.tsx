import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { buttonClasses } from '@/components/common/buttonStyles'
import { Field } from '@/components/common/Field'
import { GlassCard } from '@/components/common/GlassCard'
import { PageHero } from '@/components/common/PageHero'
import { AppShell } from '@/components/layout/AppShell'
import { products } from '@/data/mockDb'
import { formatCurrency } from '@/utils/format'

export function ApplyPage() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const paramType = params.get('type') ?? 'consumer'
  const [manualSelectedType, setManualSelectedType] = useState<string | null>(null)
  const [purpose, setPurpose] = useState('')
  const [notes, setNotes] = useState('')
  const [requestedAmount, setRequestedAmount] = useState(2_500_000)
  const [submitted, setSubmitted] = useState(false)
  const selectedType = manualSelectedType ?? paramType

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedType) ?? products[2],
    [selectedType],
  )

  return (
    <AppShell role="client">
      <PageHero
        eyebrow={t('common.dashboard')}
        title={t('client.apply.title')}
        description={t('client.apply.text')}
        actions={
          <Link to="/client/score" className={buttonClasses('secondary')}>
            {t('landing.hero.primary')}
          </Link>
        }
        aside={
          <GlassCard className="flex h-full flex-col justify-between">
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-muted)]">
              {selectedProduct.title}
            </p>
            <div>
              <p className="mt-4 font-display text-4xl font-bold text-[var(--text-primary)]">
                {selectedProduct.icon}
              </p>
              <p className="mt-4 text-[var(--text-muted)]">{selectedProduct.description}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[var(--text-primary)]">Ставка: {selectedProduct.rate}%</p>
              <p className="text-sm text-[var(--text-primary)]">
                Максимальная сумма: {formatCurrency(selectedProduct.maxAmount)}
              </p>
            </div>
          </GlassCard>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {submitted ? (
          <GlassCard className="space-y-6 border-[rgba(57,255,20,0.22)] bg-[linear-gradient(165deg,rgba(57,255,20,0.1),rgba(0,229,195,0.05))]">
            <Badge tone="green">{t('client.apply.successBadge')}</Badge>
            <div>
              <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
                {t('client.apply.successTitle')}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-muted)]">
                {t('client.apply.successLead')}
              </p>
            </div>

            <div className="rounded-[22px] border border-[rgba(255,255,255,0.1)] bg-[rgba(5,11,24,0.45)] p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-cyan)]">
                {t('client.apply.successVisit')}
              </p>
              <p className="mt-3 text-lg font-semibold text-[var(--text-primary)]">
                {t('client.apply.successAddress')}
              </p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{t('client.apply.successHours')}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {t('client.apply.successPhonesTitle')}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    className="font-mono text-[var(--accent-cyan)] underline-offset-2 hover:underline"
                    href="tel:+996312610900"
                  >
                    {t('client.apply.successPhoneHotline')}
                  </a>
                </li>
                <li>
                  <a
                    className="font-mono text-[var(--accent-cyan)] underline-offset-2 hover:underline"
                    href="tel:+996555120440"
                  >
                    {t('client.apply.successPhoneCredit')}
                  </a>
                </li>
                <li>
                  <a
                    className="font-mono text-[var(--accent-cyan)] underline-offset-2 hover:underline"
                    href="https://wa.me/996700330120"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('client.apply.successPhoneWhatsapp')}
                  </a>
                </li>
              </ul>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
              {t('client.apply.successCallback')}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSubmitted(false)
                  setPurpose('')
                  setNotes('')
                }}
              >
                {t('client.apply.successAgain')}
              </Button>
              <Link to="/client" className={buttonClasses('primary')}>
                {t('client.apply.successToDashboard')}
              </Link>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="space-y-6">
            <Field label={t('client.apply.selectProduct')}>
              <div className="grid gap-4 md:grid-cols-2">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className={`rounded-[24px] border p-5 text-left transition ${
                      selectedType === product.id
                        ? 'border-[var(--border)] bg-[rgba(0,229,195,0.1)]'
                        : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:border-[var(--border)]'
                    }`}
                    onClick={() => setManualSelectedType(product.id)}
                  >
                    <div className="text-4xl">{product.icon}</div>
                    <h3 className="mt-4 font-display text-2xl font-bold text-[var(--text-primary)]">
                      {product.title}
                    </h3>
                    <p className="mt-3 text-sm text-[var(--text-muted)]">{product.description}</p>
                  </button>
                ))}
              </div>
            </Field>

            <Field label={t('client.apply.purpose')}>
              <input
                className="field-input"
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                placeholder="Например: покупка автомобиля"
              />
            </Field>

            <Field label={t('client.score.loanAmount')}>
              <input
                className="field-input"
                type="number"
                value={requestedAmount}
                onChange={(event) => setRequestedAmount(Number(event.target.value))}
              />
            </Field>

            <Field label={t('client.apply.notes')}>
              <textarea
                className="field-input min-h-[140px]"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Дополнительная информация по заявке"
              />
            </Field>

            <Button type="button" onClick={() => setSubmitted(true)}>
              {t('client.apply.submit')}
            </Button>
          </GlassCard>
        )}

        <GlassCard className="space-y-5">
          <h3 className="font-display text-3xl font-bold text-[var(--text-primary)]">
            Сводка по заявке
          </h3>
          <div className="space-y-4">
            <div className="rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
              <p className="text-sm text-[var(--text-muted)]">Продукт</p>
              <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                {selectedProduct.title}
              </p>
            </div>
            <div className="rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
              <p className="text-sm text-[var(--text-muted)]">Сумма заявки</p>
              <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                {formatCurrency(requestedAmount)}
              </p>
            </div>
            {submitted ? (
              <div className="rounded-[22px] border border-[rgba(57,255,20,0.18)] bg-[rgba(57,255,20,0.08)] p-5">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {t('client.apply.successBadge')}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                  {t('client.apply.successSummaryNote')}
                </p>
              </div>
            ) : null}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  )
}
