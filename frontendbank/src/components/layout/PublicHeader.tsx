import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BrandMark } from '@/components/common/BrandMark'
import { buttonClasses } from '@/components/common/buttonStyles'

interface NavItem {
  label: string
  href: string
}

export function PublicHeader() {
  const { t } = useTranslation()
  const items = t('nav.public', { returnObjects: true }) as NavItem[]

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-8">
      <div className="glass-panel pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <BrandMark />
          <div>
            <p className="font-display text-lg font-bold text-[var(--text-primary)]">
              {t('common.brand')}
            </p>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              {t('common.tagline')}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {items.map((item) => (
            item.href.startsWith('/') ? (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
              >
                {item.label}
              </a>
            )
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className={buttonClasses('ghost')}>
            {t('landing.hero.secondary')}
          </Link>
          <Link to="/client/score" id="hero-score-cta" className={buttonClasses('primary')}>
            {t('landing.hero.primary')}
          </Link>
        </div>
      </div>
    </header>
  )
}
