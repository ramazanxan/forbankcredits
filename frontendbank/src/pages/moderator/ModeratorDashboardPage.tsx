import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/common/DataTable'
import { KpiCard } from '@/components/common/KpiCard'
import { PageHero } from '@/components/common/PageHero'
import { AppShell } from '@/components/layout/AppShell'
import { applications, moderatorOverviewKpis } from '@/data/mockDb'
import { formatCurrency, formatPercent } from '@/utils/format'

export function ModeratorDashboardPage() {
  const { t } = useTranslation()

  return (
    <AppShell role="moderator">
      <PageHero title={t('moderator.dashboard.title')} description={t('moderator.dashboard.text')} />
      <section className="grid gap-5 md:grid-cols-3">
        {moderatorOverviewKpis.map((item) => (
          <KpiCard key={item.id} item={item} />
        ))}
      </section>
      <DataTable
        columns={[
          { key: 'id', header: 'Заявка', render: (row) => row.id },
          { key: 'customer', header: 'Клиент', render: (row) => row.customer },
          { key: 'product', header: 'Продукт', render: (row) => row.product },
          { key: 'amount', header: 'Сумма', render: (row) => formatCurrency(row.amount) },
          { key: 'pd', header: 'P(default)', render: (row) => formatPercent(row.probabilityDefault) },
          { key: 'assignee', header: 'Ответственный', render: (row) => row.assignee },
        ]}
        rows={applications}
        getRowKey={(row) => row.id}
      />
    </AppShell>
  )
}
