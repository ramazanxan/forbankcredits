import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/common/DataTable'
import { PageHero } from '@/components/common/PageHero'
import { AppShell } from '@/components/layout/AppShell'
import { loans } from '@/data/mockDb'
import { formatCurrency } from '@/utils/format'

export function LoansPage() {
  const { t } = useTranslation()

  return (
    <AppShell role="client">
      <PageHero title={t('client.loans.title')} description={t('client.loans.text')} />
      <DataTable
        columns={[
          { key: 'id', header: 'Кредит', render: (row) => row.id },
          { key: 'product', header: 'Продукт', render: (row) => row.product },
          { key: 'amount', header: 'Сумма', render: (row) => formatCurrency(row.amount) },
          { key: 'balance', header: 'Остаток', render: (row) => formatCurrency(row.balance) },
          {
            key: 'monthly',
            header: 'Платеж в месяц',
            render: (row) => formatCurrency(row.monthlyPayment),
          },
          { key: 'due', header: 'Дата платежа', render: (row) => row.dueDate },
        ]}
        rows={loans}
        getRowKey={(row) => row.id}
      />
    </AppShell>
  )
}
