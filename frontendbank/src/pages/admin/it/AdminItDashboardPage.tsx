import { useTranslation } from 'react-i18next'
import { KpiCard } from '@/components/common/KpiCard'
import { PageHero } from '@/components/common/PageHero'
import { GlassCard } from '@/components/common/GlassCard'
import { AppShell } from '@/components/layout/AppShell'
import { adminItOverviewKpis, modelVersions } from '@/data/mockDb'
import type { ModelVersion } from '@/types/domain'

const MODEL_STAGE_LABELS: Record<ModelVersion['stage'], string> = {
  production: 'Рабочая версия',
  shadow: 'Теневая версия',
  candidate: 'Кандидат',
}

export function AdminItDashboardPage() {
  const { t } = useTranslation()

  return (
    <AppShell role="admin_it">
      <PageHero title={t('adminIt.dashboard.title')} description={t('adminIt.dashboard.text')} />
      <section className="grid gap-5 md:grid-cols-3">
        {adminItOverviewKpis.map((item) => (
          <KpiCard key={item.id} item={item} />
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        {modelVersions.map((model) => (
          <GlassCard key={model.id}>
            <p className="eyebrow">{MODEL_STAGE_LABELS[model.stage]}</p>
            <h3 className="mt-4 font-display text-3xl font-bold text-[var(--text-primary)]">
              {model.name}
            </h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[20px] border border-[rgba(255,255,255,0.06)] p-4">
                <p className="text-sm text-[var(--text-muted)]">ROC-AUC</p>
                <p className="mt-2 font-mono text-2xl text-[var(--text-primary)]">{model.rocAuc}</p>
              </div>
              <div className="rounded-[20px] border border-[rgba(255,255,255,0.06)] p-4">
                <p className="text-sm text-[var(--text-muted)]">Дрейф</p>
                <p className="mt-2 font-mono text-2xl text-[var(--text-primary)]">{model.drift}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </section>
    </AppShell>
  )
}
