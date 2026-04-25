import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/common/Badge'
import { buttonClasses } from '@/components/common/buttonStyles'
import { DataTable } from '@/components/common/DataTable'
import { GlassCard } from '@/components/common/GlassCard'
import { KpiCard } from '@/components/common/KpiCard'
import { PageHero } from '@/components/common/PageHero'
import { CreditCard3D } from '@/components/effects/CreditCard3D'
import { AppShell } from '@/components/layout/AppShell'
import { applications, clientOverviewKpis, loans, products } from '@/data/mockDb'
import { formatCurrency, formatPercent } from '@/utils/format'

export function ClientDashboardPage() {
  const { t } = useTranslation()

  return (
    <AppShell role="client">
      <PageHero
        eyebrow={t('common.dashboard')}
        title={t('client.dashboard.title')}
        description={t('client.dashboard.text')}
        actions={
          <>
            <Link to="/client/score" className={buttonClasses('primary')}>
              {t('client.dashboard.quickActions.0')}
            </Link>
            <Link to="/client/apply" className={buttonClasses('secondary')}>
              {t('client.dashboard.quickActions.1')}
            </Link>
            <Link to="/client/forum" className={buttonClasses('ghost')}>
              {t('client.dashboard.quickActions.2')}
            </Link>
          </>
        }
        aside={<CreditCard3D />}
      />

      <section className="grid gap-5 md:grid-cols-3">
        {clientOverviewKpis.map((item) => (
          <KpiCard key={item.id} item={item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <DataTable
          columns={[
            { key: 'id', header: 'Заявка', render: (row) => row.id },
            { key: 'product', header: 'Продукт', render: (row) => row.product },
            {
              key: 'amount',
              header: 'Сумма',
              render: (row) => formatCurrency(row.amount),
            },
            {
              key: 'risk',
              header: 'P(default)',
              render: (row) => formatPercent(row.probabilityDefault),
            },
          ]}
          rows={applications}
          getRowKey={(row) => row.id}
        />

        <GlassCard>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display font-bold text-[var(--text-primary)]">
              Подходящие предложения
            </h3>
            <Badge>По вашему профилю</Badge>
          </div>
          <div className="mt-6 space-y-4">
            {products.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      {product.icon} {product.title}
                    </p>
                    <p className="mt-2 text-sm text-[var(--text-primary)]">{product.description}</p>
                  </div>
                  <Link to={`/client/apply?type=${product.id}`} className={buttonClasses('secondary')}>
                    Открыть
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section>
        <DataTable
          columns={[
            { key: 'loan', header: 'Кредит', render: (row) => row.id },
            { key: 'product', header: 'Продукт', render: (row) => row.product },
            { key: 'balance', header: 'Остаток', render: (row) => formatCurrency(row.balance) },
            {
              key: 'payment',
              header: 'Платеж в месяц',
              render: (row) => formatCurrency(row.monthlyPayment),
            },
            { key: 'date', header: 'Дата платежа', render: (row) => row.dueDate },
          ]}
          rows={loans}
          getRowKey={(row) => row.id}
        />
      </section>
    </AppShell>
  )
}
