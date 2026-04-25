import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/appStore'
import type { AppLocale } from '@/types/domain'
import { cx } from '@/utils/format'

const LANGUAGE_OPTIONS: Array<{ value: AppLocale; label: string }> = [
  { value: 'ru', label: 'RU' },
  { value: 'kz', label: 'KZ' },
  { value: 'en', label: 'EN' },
]

interface LocaleSwitchProps {
  compact?: boolean
}

export function LocaleSwitch({ compact = false }: LocaleSwitchProps) {
  const { t } = useTranslation()
  const locale = useAppStore((state) => state.locale)
  const setLocale = useAppStore((state) => state.setLocale)

  return (
    <div
      className={cx('language-switch', compact && 'is-compact')}
      role="group"
      aria-label={t('common.language')}
    >
      {LANGUAGE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cx(locale === option.value && 'is-active')}
          onClick={() => setLocale(option.value)}
          aria-pressed={locale === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
