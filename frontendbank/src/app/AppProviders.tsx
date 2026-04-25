import { type PropsWithChildren, useEffect } from 'react'
import { CookieConsent } from '@/components/common/CookieConsent'
import { FloatingBankDecor } from '@/components/effects/FloatingBankDecor'
import i18n from '@/i18n'
import { useAppStore } from '@/store/appStore'

export function AppProviders({ children }: PropsWithChildren) {
  const locale = useAppStore((state) => state.locale)
  const theme = useAppStore((state) => state.theme)
  const easterEggVisible = useAppStore((state) => state.easterEggVisible)
  const triggerEasterEgg = useAppStore((state) => state.triggerEasterEgg)

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dataset.theme = theme
    void i18n.changeLanguage(locale)
  }, [locale, theme])

  useEffect(() => {
    let buffer = ''

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.length !== 1) {
        return
      }

      buffer = `${buffer}${event.key.toUpperCase()}`.slice(-5)
      if (buffer.includes('NEURO')) {
        triggerEasterEgg()
        buffer = ''
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [triggerEasterEgg])

  return (
    <>
      {children}
      <FloatingBankDecor />
      <CookieConsent />
      {easterEggVisible ? (
        <div className="pointer-events-none fixed bottom-6 right-6 z-[80]">
          <div className="glass-panel flex items-center gap-3 rounded-full px-4 py-3 shadow-[0_0_40px_rgba(0,229,195,0.35)]">
            <div className="neural-pulse" />
            <p className="text-sm font-medium text-[var(--text-primary)]">
              NEURO sequence unlocked
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}
