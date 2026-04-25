import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/common/Badge'
import { GlassCard } from '@/components/common/GlassCard'
import { PageHero } from '@/components/common/PageHero'
import { AppShell } from '@/components/layout/AppShell'
import { modelVersions } from '@/data/mockDb'
import type { ModelVersion } from '@/types/domain'

const STAGE_LABEL: Record<ModelVersion['stage'], string> = {
  production: 'Рабочая версия',
  shadow: 'Теневая версия',
  candidate: 'Кандидат',
}

const CONTOUR_LABEL: Record<ModelVersion['stage'], string> = {
  production: 'Продакшен',
  shadow: 'Shadow / наблюдение',
  candidate: 'Песочница',
}

function stageBadgeTone(stage: ModelVersion['stage']): 'green' | 'cyan' | 'amber' {
  if (stage === 'production') return 'green'
  if (stage === 'shadow') return 'cyan'
  return 'amber'
}

export function AdminItFormulasPage() {
  const { t } = useTranslation()

  return (
    <AppShell role="admin_it">
      <PageHero title={t('adminIt.formulas.title')} description={t('adminIt.formulas.text')} />
      <div className="grid gap-6">
        {modelVersions.map((model) => (
          <GlassCard key={model.id} className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <p className="eyebrow">{STAGE_LABEL[model.stage]}</p>
                <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
                  {model.name}
                </h3>
              </div>
              <Badge tone={stageBadgeTone(model.stage)}>{CONTOUR_LABEL[model.stage]}</Badge>
            </div>
            <div className="grid gap-4 border-t border-[rgba(255,255,255,0.06)] pt-5 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">ROC-AUC</p>
                <p className="mt-2 font-mono text-lg text-[var(--text-primary)]">{model.rocAuc.toFixed(3)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Дрифт</p>
                <p className="mt-2 text-lg text-[var(--text-primary)]">{model.drift}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Обновлено</p>
                <p className="mt-2 font-mono text-sm text-[var(--text-primary)]">{model.updatedAt}</p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Сводка по развёрнутой версии: качество на hold-out и оценка сдвига распределений признаков.
            </p>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  )
}
