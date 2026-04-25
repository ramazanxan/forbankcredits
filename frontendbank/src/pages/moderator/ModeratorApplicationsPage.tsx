import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/common/DataTable'
import { PageHero } from '@/components/common/PageHero'
import { AppShell } from '@/components/layout/AppShell'
import { applications } from '@/data/mockDb'
import { formatCurrency, formatPercent } from '@/utils/format'

export function ModeratorApplicationsPage() {
  const { t } = useTranslation()

  return (
    <AppShell role="moderator">
      <PageHero
        title={t('moderator.applications.title')}
        description={t('moderator.applications.text')}
      />
      <DataTable
        columns={[
          { key: 'id', header: 'ID', render: (row) => row.id },
          { key: 'customer', header: 'Клиент', render: (row) => row.customer },
          { key: 'product', header: 'Продукт', render: (row) => row.product },
          { key: 'amount', header: 'Сумма', render: (row) => formatCurrency(row.amount) },
          { key: 'risk', header: 'P(default)', render: (row) => formatPercent(row.probabilityDefault) },
          { key: 'status', header: 'Статус', render: (row) => row.status },
          { key: 'time', header: 'Создана', render: (row) => row.createdAt },
        ]}
        rows={applications}
        getRowKey={(row) => row.id}
      />
    </AppShell>
  )
}
