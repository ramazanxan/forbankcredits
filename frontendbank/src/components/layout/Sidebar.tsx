import { useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/common/Badge'
import { BrandMark } from '@/components/common/BrandMark'
import { LocaleSwitch } from '@/components/common/LocaleSwitch'
import { NavIcon } from '@/components/common/NavIcon'
import { buttonClasses } from '@/components/common/buttonStyles'
import { GlassCard } from '@/components/common/GlassCard'
import { useAppStore } from '@/store/appStore'
import { cx } from '@/utils/format'
import type { Role } from '@/types/domain'

interface SidebarProps {
  role: Role
  onNavigate?: () => void
}

interface NavItem {
  label: string
  href: string
  icon: string
}

const APPLY_SUBMENU = [
  { label: 'Автокредит', href: '/client/apply?type=auto' },
  { label: 'Ипотека', href: '/client/apply?type=mortgage' },
  { label: 'Потребительский', href: '/client/apply?type=consumer' },
  { label: 'Бизнес-кредит', href: '/client/apply?type=business' },
]

export function Sidebar({ role, onNavigate }: SidebarProps) {
  const { t } = useTranslation()
  const auth = useAppStore((state) => state.auth)
  const theme = useAppStore((state) => state.theme)
  const toggleTheme = useAppStore((state) => state.toggleTheme)
  const logout = useAppStore((state) => state.logout)
  const location = useLocation()
  const [applyOpen, setApplyOpen] = useState(location.pathname.startsWith('/client/apply'))
  const displayName = auth?.user.name?.trim() || 'Пользователь'
  const isLightTheme = theme === 'aurora'

  const items = useMemo(
    () => t(`nav.${role}`, { returnObjects: true }) as NavItem[],
    [role, t],
  )

  return (
    <aside className="flex min-h-full min-w-0 flex-col gap-5">
      <GlassCard className="overflow-hidden p-0">
        <div className="border-b border-[rgba(255,255,255,0.06)] px-5 py-5">
          <Link to="/" className="flex items-center gap-3" onClick={onNavigate}>
            <BrandMark />
            <div className="min-w-0">
              <p className="font-display text-xl font-bold text-[var(--text-primary)]">
                {t('common.brand')}
              </p>
              <p className="truncate text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {t('common.tagline')}
              </p>
            </div>
          </Link>
        </div>

        <div className="px-5 py-5">
          <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-6">
            <div className="flex flex-col items-stretch gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[rgba(0,229,195,0.14)] text-base font-semibold tracking-tight text-[var(--accent-cyan)]">
                {auth?.user.avatar?.startsWith('data:image') ? (
                  <img src={auth.user.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="px-1 text-center leading-tight">{auth?.user.avatar ?? 'NB'}</span>
                )}
              </div>
              <div className="min-w-0 space-y-1.5">
                <p className="break-words text-lg font-semibold leading-snug text-[var(--text-primary)]">
                  {displayName}
                </p>
                <p className="break-words text-sm leading-relaxed text-[var(--text-muted)]">
                  {auth?.user.title ?? t(`roles.${role}`)}
                </p>
              </div>
              <Badge className="w-fit">{t(`roles.${role}`)}</Badge>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-3 pb-4">
          {items.map((item) => (
            <div key={item.href}>
              {role === 'client' && item.href === '/client/apply' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setApplyOpen((value) => !value)}
                    className={cx(
                      'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition',
                      location.pathname.startsWith('/client/apply')
                        ? 'bg-[rgba(0,229,195,0.12)] text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--text-primary)]',
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <NavIcon name={item.icon} />
                      <span className="min-w-0 truncate">{item.label}</span>
                    </span>
                    <span className={cx('transition', applyOpen && 'rotate-45')}>+</span>
                  </button>
                  <div
                    className={cx(
                      'grid overflow-hidden transition-all duration-300',
                      applyOpen ? 'grid-rows-[1fr] py-1' : 'grid-rows-[0fr]',
                    )}
                  >
                    <div className="overflow-hidden pl-7">
                      <div className="space-y-1 rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-2">
                        {APPLY_SUBMENU.map((subItem) => (
                          <NavLink
                            key={subItem.href}
                            to={subItem.href}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                              cx(
                                'block rounded-xl px-3 py-2 text-sm transition',
                                isActive
                                  ? 'bg-[rgba(0,229,195,0.12)] text-[var(--accent-cyan)]'
                                  : 'text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--text-primary)]',
                              )
                            }
                          >
                            {subItem.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <NavLink
                  to={item.href}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cx(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                      isActive
                        ? 'bg-[rgba(0,229,195,0.12)] text-[var(--text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                        : 'text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--text-primary)]',
                    )
                  }
                >
                  <NavIcon name={item.icon} />
                  <span className="min-w-0 truncate">{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </GlassCard>

      <GlassCard className="flex-shrink-0 space-y-4">
        <div className="space-y-3">
          <label className="flex items-center justify-between gap-3 text-sm text-[var(--text-primary)]">
            <span>{isLightTheme ? 'Светлая тема' : 'Тёмная тема'}</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-switch"
              aria-pressed={isLightTheme}
              aria-label={isLightTheme ? 'Светлая тема включена' : 'Тёмная тема включена'}
            >
              <span />
            </button>
          </label>
          <div className="space-y-2">
            <span className="text-sm text-[var(--text-primary)]">{t('common.language')}</span>
            <LocaleSwitch compact />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link to="/support" className={buttonClasses('secondary', true)} onClick={onNavigate}>
            {t('common.support')}
          </Link>
          <button type="button" className={buttonClasses('ghost', true)} onClick={logout}>
            {t('common.logout')}
          </button>
        </div>
      </GlassCard>
    </aside>
  )
}
