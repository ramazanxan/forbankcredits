import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { buttonClasses } from '@/components/common/buttonStyles'
import { GlassCard } from '@/components/common/GlassCard'
import { SectionHeading } from '@/components/common/SectionHeading'
import { CreditCard3D } from '@/components/effects/CreditCard3D'
import { NeuralFieldCanvas } from '@/components/effects/NeuralFieldCanvas'
import { Reveal } from '@/components/effects/Reveal'
import { TextScramble } from '@/components/effects/TextScramble'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { forumSeedMessages, partnerNames, products } from '@/data/mockDb'
import { formatCurrency } from '@/utils/format'

interface StepItem {
  title: string
  text: string
}

const TRUST_METRICS = [
  { label: 'Одобрение заявок', value: 72 },
  { label: 'Точность модели', value: 98 },
  { label: 'Скорость ответа', value: 55 },
]

export function LandingPage() {
  const { t } = useTranslation()
  const [feed, setFeed] = useState(forumSeedMessages)
  const steps = t('landing.how.steps', { returnObjects: true }) as StepItem[]
  const trustStats = t('landing.trust.stats', { returnObjects: true }) as Array<{
    label: string
    value: string
  }>

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFeed((current) => {
        const next = forumSeedMessages[(current.length + 1) % forumSeedMessages.length]
        return [{ ...next, id: `${next.id}-${Date.now()}` }, ...current].slice(0, 5)
      })
    }, 4200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <PublicHeader />
      <div className="landing-scroll">
        <section className="snap-section relative overflow-hidden pt-28" id="hero">
          <div className="absolute inset-0 opacity-80">
            <NeuralFieldCanvas magnetQuery="#hero-score-cta" />
          </div>
          <div className="hero-orb hero-orb-left" />
          <div className="hero-orb hero-orb-right" />
          <div className="relative z-10 mx-auto grid min-h-[88svh] max-w-7xl items-center gap-10 px-4 pb-16 pt-10 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Reveal>
                <p className="eyebrow mb-6">{t('landing.hero.eyebrow')}</p>
              </Reveal>
              <div className="space-y-2">
                {(t('landing.hero.lines', { returnObjects: true }) as string[]).map((line, index) => (
                  <Reveal key={line} delay={index * 0.08}>
                    <h1 className="font-display text-[clamp(3.4rem,9vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-[var(--text-primary)]">
                      <TextScramble text={line} />
                    </h1>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.28}>
                <p className="mt-6 max-w-2xl text-lg text-[var(--text-muted)]">
                  {t('landing.hero.subtitle')}
                </p>
              </Reveal>
              <Reveal delay={0.36}>
                <div className="mt-9 flex flex-wrap gap-4">
                  <Link to="/client/score" className={buttonClasses('primary')} id="hero-score-cta">
                    {t('landing.hero.primary')}
                  </Link>
                  <Link to="/login" className={buttonClasses('secondary')}>
                    {t('landing.hero.secondary')}
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal from="right" delay={0.18}>
              <div className="relative mx-auto w-full max-w-[500px]">
                <CreditCard3D />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="snap-section" id="how">
          <div className="mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-center px-4 py-16 md:px-8">
            <SectionHeading
              eyebrow={t('landing.how.eyebrow')}
              title={t('landing.how.title')}
              description={t('landing.how.description')}
            />
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {steps.map((step, index) => (
                <Reveal key={step.title} delay={index * 0.08} from={index % 2 === 0 ? 'left' : 'right'}>
                  <GlassCard className="step-card h-full">
                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.03)] font-mono text-lg text-[var(--accent-cyan)]">
                      0{index + 1}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-[var(--text-muted)]">{step.text}</p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="snap-section" id="products">
          <div className="mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-center px-4 py-16 md:px-8">
            <SectionHeading
              eyebrow={t('landing.products.eyebrow')}
              title={t('landing.products.title')}
            />
            <div className="mt-14 grid gap-6 lg:grid-cols-4">
              {products.map((product, index) => (
                <Reveal key={product.id} delay={index * 0.08}>
                  <article className="loan-card">
                    <div className="loan-card-inner">
                      <div className="loan-card-face">
                        <div className="text-4xl">{product.icon}</div>
                        <h3 className="mt-6 font-display text-2xl font-bold text-[var(--text-primary)]">
                          {product.title}
                        </h3>
                        <p className="mt-3 text-sm text-[var(--text-muted)]">{product.description}</p>
                      </div>
                      <div className="loan-card-face loan-card-back">
                        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                          Условия
                        </p>
                        <div className="mt-5 space-y-3">
                          <p className="text-sm text-[var(--text-primary)]">Ставка: {product.rate}%</p>
                          <p className="text-sm text-[var(--text-primary)]">
                            Срок: {product.termMonths} мес.
                          </p>
                          <p className="text-sm text-[var(--text-primary)]">
                            Максимум: {formatCurrency(product.maxAmount)}
                          </p>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                          {product.perks.map((perk) => (
                            <span
                              key={perk}
                              className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--accent-cyan)]"
                            >
                              {perk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="snap-section">
          <div className="mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-center px-4 py-16 md:px-8">
            <SectionHeading
              eyebrow={t('landing.trust.eyebrow')}
              title={t('landing.trust.title')}
            />
            <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
              <div className="grid gap-6 sm:grid-cols-3">
                {trustStats.map((stat, index) => (
                  <Reveal key={stat.label} delay={index * 0.08}>
                    <GlassCard className="metric-card min-h-[180px]">
                      <p className="font-mono text-4xl font-semibold text-[var(--text-primary)]">
                        {stat.value}
                      </p>
                      <p className="mt-4 text-sm uppercase tracking-[0.24em] text-[var(--text-muted)]">
                        {stat.label}
                      </p>
                    </GlassCard>
                  </Reveal>
                ))}
              </div>
              <Reveal from="right">
                <GlassCard className="mx-auto w-full max-w-[620px] space-y-5 p-5 md:p-6">
                  <div className="grid gap-4">
                    {TRUST_METRICS.map((metric) => (
                      <div key={metric.label} className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                          <span>{metric.label}</span>
                          <span>{metric.value}%</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent-cyan),var(--accent-green))]"
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      Проведите, чтобы посмотреть партнеров
                    </p>
                    <div className="partners-scroll mt-3">
                      <div className="partners-scroll-track">
                      {[...partnerNames, ...partnerNames].map((name, index) => (
                        <span key={`${name}-${index}`}>{name}</span>
                      ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="snap-section" id="community">
          <div className="mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-center px-4 py-16 md:px-8">
            <SectionHeading
              eyebrow={t('landing.forum.eyebrow')}
              title={t('landing.forum.title')}
            />
            <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
              <GlassCard className="space-y-4">
                {feed.map((message, index) => (
                  <Reveal key={message.id} delay={index * 0.08}>
                    <div className="rounded-[20px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-[var(--text-primary)]">{message.author}</p>
                        <span className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                          {message.time}
                        </span>
                      </div>
                      <p className="mt-3 text-[var(--text-muted)]">{message.message}</p>
                    </div>
                  </Reveal>
                ))}
              </GlassCard>

              <Reveal from="right">
                <GlassCard className="flex flex-col justify-between">
                  <div>
                    <p className="eyebrow">{t('landing.forum.eyebrow')}</p>
                    <h3 className="mt-4 font-display text-4xl font-bold text-[var(--text-primary)]">
                      Общение в сервисе
                    </h3>
                    <p className="mt-4 text-[var(--text-muted)]">
                      Отзывы клиентов, вопросы по заявкам и сообщения от команды собраны в одном месте.
                    </p>
                  </div>
                  <Link to="/client/forum" className={`${buttonClasses('primary')} mt-8 self-start`}>
                    {t('landing.forum.cta')}
                  </Link>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="snap-section">
          <div className="mx-auto flex min-h-[86svh] max-w-7xl flex-col justify-center px-4 py-16 md:px-8">
            <GlassCard className="relative overflow-hidden py-16 text-center">
              <div className="hero-orb hero-orb-bottom" />
              <p className="eyebrow justify-center">{t('common.brand')}</p>
              <h2 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-extrabold text-[var(--text-primary)] md:text-6xl">
                {t('landing.finalCta.title')}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--text-muted)]">
                {t('landing.finalCta.text')}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link to="/register" className={buttonClasses('secondary')}>
                  {t('auth.login.register')}
                </Link>
                <Link to="/client/score" className={`${buttonClasses('primary')} animate-pulse-glow`}>
                  {t('landing.finalCta.action')}
                </Link>
              </div>
              <div className="mt-10 grid gap-6 border-t border-[rgba(255,255,255,0.07)] pt-6 text-left md:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Контакты</p>
                  <p className="mt-3 text-sm text-[var(--text-primary)]">+996555280907</p>
                  <p className="mt-1 text-sm text-[var(--text-primary)]">support@neurobank.kg</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Адрес</p>
                  <p className="mt-3 text-sm text-[var(--text-primary)]">
                    проспект Чынгыз Айтматова 66
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">Пн-Пт: 09:00 - 18:00</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Информация</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    <Link to="/support" className="text-[var(--text-primary)] hover:text-[var(--accent-cyan)]">
                      Поддержка
                    </Link>
                    <Link to="/privacy-policy" className="text-[var(--text-primary)] hover:text-[var(--accent-cyan)]">
                      Политика конфиденциальности
                    </Link>
                    <Link to="/terms" className="text-[var(--text-primary)] hover:text-[var(--accent-cyan)]">
                      Пользовательское соглашение
                    </Link>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {t('landing.footer')}
              </p>
            </GlassCard>
          </div>
        </section>
      </div>
    </div>
  )
}
