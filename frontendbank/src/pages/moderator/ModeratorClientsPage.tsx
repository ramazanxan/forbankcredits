import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/common/DataTable'
import { PageHero } from '@/components/common/PageHero'
import { AppShell } from '@/components/layout/AppShell'
import { clients } from '@/data/mockDb'

export function ModeratorClientsPage() {
  const { t } = useTranslation()

  return (
    <AppShell role="moderator">
      <PageHero title={t('moderator.clients.title')} description={t('moderator.clients.text')} />
      <DataTable
        columns={[
          { key: 'id', header: 'ID клиента', render: (row) => row.id },
          { key: 'name', header: 'Имя', render: (row) => row.name },
          { key: 'segment', header: 'Сегмент', render: (row) => row.segment },
          { key: 'score', header: 'Скор', render: (row) => row.score },
          { key: 'loans', header: 'Кредиты', render: (row) => row.activeLoans },
          { key: 'manager', header: 'Менеджер', render: (row) => row.manager },
        ]}
        rows={clients}
        getRowKey={(row) => row.id}
      />
    </AppShell>
  )
}
