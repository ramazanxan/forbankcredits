import { useTranslation } from 'react-i18next'
import { GlassCard } from '@/components/common/GlassCard'
import { PageHero } from '@/components/common/PageHero'
import { AppShell } from '@/components/layout/AppShell'

const RULES = [
  'Если P(default) выше 0.62, заявка отправляется на ручную проверку.',
  'Если доход стабилен, а сумма умеренная, можно включать предодобрение.',
  'Для бизнес-кредитов при большом числе недавних запросов подключается менеджер.',
]

export function AdminBankFormulasPage() {
  const { t } = useTranslation()

  return (
    <AppShell role="admin_bank">
      <PageHero title={t('adminBank.formulas.title')} description={t('adminBank.formulas.text')} />
      <div className="grid gap-6">
        {RULES.map((rule) => (
          <GlassCard key={rule}>
            <p className="font-mono text-[var(--text-primary)]">{rule}</p>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  )
}
