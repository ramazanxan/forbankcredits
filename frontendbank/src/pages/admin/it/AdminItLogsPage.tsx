import { useTranslation } from 'react-i18next'
import { GlassCard } from '@/components/common/GlassCard'
import { PageHero } from '@/components/common/PageHero'
import { AppShell } from '@/components/layout/AppShell'
import { useAppStore } from '@/store/appStore'

export function AdminItLogsPage() {
  const { t } = useTranslation()
  const logs = useAppStore((state) => state.systemLogs)

  return (
    <AppShell role="admin_it">
      <PageHero title={t('adminIt.logs.title')} description={t('adminIt.logs.text')} />
      <GlassCard className="space-y-3 bg-[rgba(2,7,17,0.95)]">
        {logs.map((log) => (
          <div
            key={log.id}
            className="rounded-[18px] border border-[rgba(255,255,255,0.06)] px-4 py-3 font-mono text-sm text-[var(--text-primary)]"
          >
            <span className="text-[var(--accent-cyan)]">[{log.timestamp}]</span> {log.level.toUpperCase()}{' '}
            {log.message}
          </div>
        ))}
      </GlassCard>
    </AppShell>
  )
}
