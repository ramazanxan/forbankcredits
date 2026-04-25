import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const COOKIE_KEY = 'neurobank_cookie_consent_v1'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(COOKIE_KEY)
    setVisible(saved === null)
  }, [])

  function accept(value: 'accepted' | 'necessary') {
    window.localStorage.setItem(COOKIE_KEY, value)
    setVisible(false)
  }

  if (!visible) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] px-4">
      <div className="glass-panel pointer-events-auto mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-4 rounded-2xl p-4 md:p-5">
        <div className="min-w-[240px] flex-1">
          <p className="text-sm font-semibold text-[var(--text-primary)]">🍪 Мы используем cookie</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Cookie помогают работе сайта и улучшают сервис. Продолжая, вы соглашаетесь с условиями
            обработки данных.
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            <Link to="/privacy-policy" className="text-[var(--accent-cyan)] hover:underline">
              Политика конфиденциальности
            </Link>
            <Link to="/terms" className="text-[var(--accent-cyan)] hover:underline">
              Пользовательское соглашение
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-[rgba(255,255,255,0.12)] px-4 py-2 text-sm text-[var(--text-primary)] hover:border-[var(--border)]"
            onClick={() => accept('necessary')}
          >
            Только необходимые
          </button>
          <button
            type="button"
            className="rounded-full bg-[linear-gradient(135deg,var(--accent-cyan),var(--accent-green))] px-4 py-2 text-sm font-semibold text-[var(--bg-primary)] shadow-[0_0_20px_var(--accent-glow)]"
            onClick={() => accept('accepted')}
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  )
}
