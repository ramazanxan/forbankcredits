import { useTranslation } from 'react-i18next'
import { GlassCard } from '@/components/common/GlassCard'
import { LocaleSwitch } from '@/components/common/LocaleSwitch'
import { PageHero } from '@/components/common/PageHero'
import { AppShell } from '@/components/layout/AppShell'
import { useAppStore } from '@/store/appStore'

export function SettingsPage() {
  const { t } = useTranslation()
  const theme = useAppStore((state) => state.theme)
  const soundEnabled = useAppStore((state) => state.soundEnabled)
  const toggleTheme = useAppStore((state) => state.toggleTheme)
  const toggleSound = useAppStore((state) => state.toggleSound)
  const isLightTheme = theme === 'aurora'

  return (
    <AppShell role="client">
      <PageHero title={t('client.settings.title')} description={t('client.settings.text')} />
      <div className="grid gap-6 md:grid-cols-3">
        <GlassCard>
          <p className="eyebrow">{t('common.theme')}</p>
          <h3 className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">Оформление</h3>
          <p className="mt-3 text-[var(--text-muted)]">
            Переключает цветовые акценты и фон интерфейса.
          </p>
          <button
            type="button"
            className="theme-switch mt-6"
            onClick={toggleTheme}
            aria-pressed={isLightTheme}
            aria-label={isLightTheme ? 'Светлая тема включена' : 'Тёмная тема включена'}
          >
            <span />
          </button>
          <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">
            Сейчас: {isLightTheme ? 'Светлая' : 'Тёмная'}
          </p>
        </GlassCard>

        <GlassCard>
          <p className="eyebrow">{t('common.language')}</p>
          <h3 className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">Язык интерфейса</h3>
          <div className="mt-6">
            <LocaleSwitch />
          </div>
        </GlassCard>

        <GlassCard>
          <p className="eyebrow">Звук</p>
          <h3 className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">Звуковой отклик</h3>
          <p className="mt-3 text-[var(--text-muted)]">
            Короткий сигнал при нажатии на основные кнопки.
          </p>
          <button
            type="button"
            className="mt-6 rounded-full border border-[rgba(255,255,255,0.08)] px-4 py-3 text-sm text-[var(--text-primary)]"
            onClick={toggleSound}
          >
            {soundEnabled ? 'Включен' : 'Выключен'}
          </button>
        </GlassCard>
      </div>
    </AppShell>
  )
}
