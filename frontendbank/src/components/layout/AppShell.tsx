import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/common/Badge'
import { BrandMark } from '@/components/common/BrandMark'
import { Sidebar } from '@/components/layout/Sidebar'
import { useAppStore } from '@/store/appStore'
import type { Role } from '@/types/domain'
import { cx } from '@/utils/format'

interface AppShellProps extends PropsWithChildren {
  role: Role
}

export function AppShell({ role, children }: AppShellProps) {
  const { t } = useTranslation()
  const auth = useAppStore((state) => state.auth)
  const mobileMenuOpen = useAppStore((state) => state.mobileMenuOpen)
  const setMobileMenuOpen = useAppStore((state) => state.setMobileMenuOpen)
  const displayName = auth?.user.name?.split(/\s+/)[0] ?? t('common.brand')
  const subtitle = auth?.user.title ?? t(`roles.${role}`)

  return (
    <div className="min-h-screen">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-[340px] lg:overflow-y-auto lg:p-5">
        <Sidebar role={role} />
      </div>

      <div className="min-w-0 lg:pl-[340px]">
        <header className="sticky top-[2px] z-40 px-4 py-4 md:px-8">
          <div className="glass-panel flex items-center justify-between rounded-[28px] px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className={cx('burger-menu lg:hidden', mobileMenuOpen && 'is-open')}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <span />
                <span />
                <span />
              </button>
              <div className="flex items-center gap-3 lg:hidden">
                <BrandMark className="h-9 w-9" />
                <p className="font-display text-lg font-bold text-[var(--text-primary)]">
                  {t('common.brand')}
                </p>
              </div>
              <div className="hidden md:block">
                <p className="eyebrow !mb-1">{subtitle}</p>
                <p className="text-sm text-[var(--text-muted)]">{displayName}</p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3">
              <Badge tone="green">{t(`roles.${role}`)}</Badge>
            </div>
          </div>
        </header>

        <main className="min-w-0 space-y-8 px-4 pb-10 md:px-8 md:pb-14">{children}</main>
      </div>

      <div
        className={cx(
          'fixed inset-0 z-50 bg-[rgba(5,11,24,0.72)] backdrop-blur-xl transition duration-300 lg:hidden',
          mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={cx(
            'h-full w-[86%] max-w-[360px] transform overflow-y-auto p-4 transition duration-300',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <Sidebar role={role} onNavigate={() => setMobileMenuOpen(false)} />
        </div>
      </div>
    </div>
  )
}
