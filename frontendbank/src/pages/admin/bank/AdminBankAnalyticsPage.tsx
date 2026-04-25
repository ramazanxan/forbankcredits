import { useTranslation } from 'react-i18next'
import { PageHero } from '@/components/common/PageHero'
import { AppShell } from '@/components/layout/AppShell'
import { HistogramChart } from '@/components/tables/HistogramChart'
import { SvgLineChart } from '@/components/tables/SvgLineChart'

const CURVE = [
  { x: 0, y: 0.1 },
  { x: 0.18, y: 0.42 },
  { x: 0.36, y: 0.66 },
  { x: 0.58, y: 0.86 },
  { x: 1, y: 1 },
]

const BINS = [
  { label: '0.0-0.2', count: 19 },
  { label: '0.2-0.4', count: 34 },
  { label: '0.4-0.6', count: 29 },
  { label: '0.6-0.8', count: 17 },
  { label: '0.8-1.0', count: 8 },
]

export function AdminBankAnalyticsPage() {
  const { t } = useTranslation()

  return (
    <AppShell role="admin_bank">
      <PageHero title={t('adminBank.analytics.title')} description={t('adminBank.analytics.text')} />
      <div className="grid gap-6 xl:grid-cols-2">
        <SvgLineChart title="Кривая доходности" points={CURVE} xLabel="Нагрузка" yLabel="Доход" />
        <HistogramChart title="Распределение риска" bins={BINS} />
      </div>
    </AppShell>
  )
}
