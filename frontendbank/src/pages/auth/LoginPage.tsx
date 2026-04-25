import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '@/api/api'
import { Badge } from '@/components/common/Badge'
import { BrandMark } from '@/components/common/BrandMark'
import { Button } from '@/components/common/Button'
import { buttonClasses } from '@/components/common/buttonStyles'
import { Field } from '@/components/common/Field'
import { GlassCard } from '@/components/common/GlassCard'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { getDefaultRoute, useAppStore } from '@/store/appStore'

export function LoginPage() {
  const { t } = useTranslation()
  const auth = useAppStore((state) => state.auth)
  const setAuth = useAppStore((state) => state.setAuth)
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (auth) {
    return <Navigate to={getDefaultRoute(auth.user.role)} replace />
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await api.auth.login({ email, password })
      setAuth({
        token: result.token,
        user: result.user,
      })
      window.localStorage.setItem('neurobank_mock_email', result.user.email)
      window.localStorage.setItem('neurobank_mock_token', result.token)

      const target = (location.state as { from?: string } | null)?.from
      navigate(target ?? getDefaultRoute(result.role), { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      if (message === 'ACCOUNT_NOT_FOUND') {
        setError('Аккаунт не найден. Сначала зарегистрируйтесь.')
      } else if (message === 'INVALID_PASSWORD') {
        setError('Неверный пароль')
      } else {
        setError('Не удалось выполнить вход')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PublicHeader />
      <div className="auth-layout min-h-screen px-4 pb-12 pt-28 md:px-8">
        {loading ? <LoadingScreen /> : null}
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <GlassCard className="flex flex-col justify-between p-8 md:p-10">
            <div>
              <Badge>{t('common.demoMode')}</Badge>
              <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.96] text-[var(--text-primary)] md:text-6xl">
                {t('auth.login.title')}
              </h1>
              <p className="mt-6 max-w-2xl text-xl text-[var(--text-muted)]">{t('auth.login.text')}</p>
            </div>

            <div className="mt-10 grid gap-4">
              <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="neural-pulse h-2.5 w-2.5 !animate-none bg-[var(--accent-cyan)] shadow-[0_0_0_6px_rgba(0,229,195,0.2)]" />
                  <p className="text-base font-semibold text-[var(--text-primary)]">Сервис активен 24/7</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Безопасность</p>
                  <p className="mt-3 text-lg leading-snug text-[var(--text-primary)]">Защищенное подключение и контроль доступа</p>
                </div>
                <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Скоринг</p>
                  <p className="mt-3 text-lg leading-snug text-[var(--text-primary)]">Решение по заявке за несколько минут</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="mb-8 flex items-center gap-4">
              <BrandMark className="h-12 w-12" />
              <div>
                <p className="font-display text-2xl font-bold text-[var(--text-primary)]">
                  {t('common.brand')}
                </p>
                <p className="text-sm text-[var(--text-muted)]">{t('common.tagline')}</p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Field label={t('auth.login.email')}>
                <input
                  className="field-input"
                  type="text"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="example@gmail.com или +996..."
                  autoComplete="new-password"
                  name="auth_login_identifier"
                  required
                />
              </Field>
              <Field label={t('auth.login.password')}>
                <div className="relative">
                  <input
                    className="field-input pr-14 placeholder:text-[var(--text-muted)] placeholder:opacity-60"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="********"
                    autoComplete="new-password"
                    name="auth_login_password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M3 3L21 21M10.58 10.58C10.21 10.95 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.05 13.79 13.42 13.42M16.24 16.24C14.91 16.86 13.47 17.2 12 17.2C7.5 17.2 3.73 14.3 2 12C2.84 10.88 3.95 9.8 5.25 8.93M9.88 6.28C10.58 6.1 11.29 6 12 6C16.5 6 20.27 8.9 22 11.2C21.31 12.12 20.5 13 19.59 13.8"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M2 12C3.73 9.7 7.5 6.8 12 6.8C16.5 6.8 20.27 9.7 22 12C20.27 14.3 16.5 17.2 12 17.2C7.5 17.2 3.73 14.3 2 12Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    )}
                  </button>
                </div>
              </Field>

              {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

              <div className="flex flex-wrap gap-3 pt-3">
                <Button type="submit">
                  {t('auth.login.action')}
                </Button>
                <Link to="/register" className={buttonClasses('secondary')}>
                  {t('auth.login.register')}
                </Link>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </>
  )
}
