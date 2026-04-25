import { useTranslation } from 'react-i18next'
import { KpiCard } from '@/components/common/KpiCard'
import { PageHero } from '@/components/common/PageHero'
import { GlassCard } from '@/components/common/GlassCard'
import { AppShell } from '@/components/layout/AppShell'
import { adminBankOverviewKpis } from '@/data/mockDb'

const PANELS = [
  'Структура портфеля',
  'Воронка одобрений',
  'Контроль потерь',
]

export function AdminBankDashboardPage() {
  const { t } = useTranslation()

  return (
    <AppShell role="admin_bank">
      <PageHero title={t('adminBank.dashboard.title')} description={t('adminBank.dashboard.text')} />
      <section className="grid gap-5 md:grid-cols-3">
        {adminBankOverviewKpis.map((item) => (
          <KpiCard key={item.id} item={item} />
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        {PANELS.map((title) => (
          <GlassCard key={title}>
            <p className="eyebrow">{title}</p>
            <p className="mt-4 text-[var(--text-muted)]">
              Блок подготовлен для подключения данных из backend и отображения бизнес-метрик.
            </p>
          </GlassCard>
        ))}
      </section>
    </AppShell>
  )
}
