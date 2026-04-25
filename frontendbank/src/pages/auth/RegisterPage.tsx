import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '@/api/api'
import { Button } from '@/components/common/Button'
import { buttonClasses } from '@/components/common/buttonStyles'
import { Field } from '@/components/common/Field'
import { GlassCard } from '@/components/common/GlassCard'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { getDefaultRoute, useAppStore } from '@/store/appStore'
import { cx } from '@/utils/format'

export function RegisterPage() {
  const { t } = useTranslation()
  const auth = useAppStore((state) => state.auth)
  const setAuth = useAppStore((state) => state.setAuth)
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '+996',
    incomeBand: '',
    password: '',
  })
  const passwordRules = {
    minLength: form.password.length >= 8,
    upperCase: /[A-Z]/.test(form.password),
    lowerCase: /[a-z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
  }
  const isPasswordStrong = Object.values(passwordRules).every(Boolean)
  const isFullNameValid = /^[A-Za-zА-Яа-яЁё\s-]+$/.test(form.fullName.trim()) && form.fullName.trim().length >= 3
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  const isPhoneValid = /^\+996\d{9}$/.test(form.phone)
  const isIncomeValid = /^\d+$/.test(form.incomeBand.trim()) && Number(form.incomeBand) > 0

  const steps = useMemo(
    () => t('auth.register.steps', { returnObjects: true }) as string[],
    [t],
  )

  if (auth) {
    return <Navigate to={getDefaultRoute(auth.user.role)} replace />
  }

  async function submit() {
    setError('')

    if (!isPasswordStrong) {
      setError('Ошибка: пароль не соответствует строгим требованиям безопасности')
      return
    }

    try {
      setLoading(true)
      const result = await api.auth.register(form)
      setAuth({
        token: result.token,
        user: result.user,
      })
      navigate(getDefaultRoute(result.role), { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      if (message === 'ACCOUNT_ALREADY_EXISTS') {
        setError('Аккаунт с такой почтой или номером уже существует')
      } else {
        setError('Ошибка: регистрация отклонена. Проверьте данные и требования к паролю')
      }
    } finally {
      setLoading(false)
    }
  }

  function handleNextStep() {
    setError('')

    if (step === 0) {
      if (!form.fullName.trim() && !form.email.trim()) {
        setError('Заполните поле ФИО и почту')
        return
      }
      if (!form.fullName.trim()) {
        setError('Заполните поле ФИО')
        return
      }
      if (!form.email.trim()) {
        setError('Заполните поле электронной почты')
        return
      }
      if (!isFullNameValid) {
        setError('ФИО должно содержать только буквы')
        return
      }
      if (!isEmailValid) {
        setError('Введите корректную электронную почту')
        return
      }
    }

    if (step === 1) {
      if (!form.phone.trim() || form.phone === '+996') {
        setError('Заполните поле телефона')
        return
      }
      if (!form.incomeBand.trim()) {
        setError('Заполните поле дохода')
        return
      }
      if (!isPhoneValid) {
        setError('Телефон должен быть в формате +996 и содержать 9 цифр')
        return
      }
      if (!isIncomeValid) {
        setError('Введите корректный доход (только цифры)')
        return
      }
    }

    setStep((current) => current + 1)
  }

  return (
    <>
      <PublicHeader />
      <div className="auth-layout min-h-screen px-4 pb-12 pt-28 md:px-8">
        {loading ? <LoadingScreen /> : null}
        <div className="mx-auto max-w-4xl">
          <GlassCard className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <p className="eyebrow">{t('auth.register.title')}</p>
                <h1 className="mt-3 font-display text-4xl font-extrabold text-[var(--text-primary)]">
                  {t('auth.register.subtitle')}
                </h1>
              </div>
              <Link to="/login" className={buttonClasses('ghost')}>
                {t('auth.login.action')}
              </Link>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {steps.map((item, index) => (
                <div
                  key={item}
                  className={cx(
                    'rounded-[22px] border p-4',
                    index === step
                      ? 'border-[var(--border)] bg-[rgba(0,229,195,0.1)]'
                      : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]',
                  )}
                >
                  <p className="font-mono text-sm text-[var(--accent-cyan)]">0{index + 1}</p>
                  <p className="mt-2 font-medium text-[var(--text-primary)]">{item}</p>
                </div>
              ))}
            </div>

            {step === 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                <Field label={t('auth.register.fullName')}>
                  <input
                    className="field-input"
                    value={form.fullName}
                    onChange={(event) => {
                      const nextValue = event.target.value.replace(/[^A-Za-zА-Яа-яЁё\s-]/g, '')
                      setForm((current) => ({ ...current, fullName: nextValue }))
                    }}
                    placeholder="Иванов Иван Иванович"
                  />
                </Field>
                <Field label={t('auth.register.email')}>
                  <input
                    className="field-input"
                    type="email"
                    value={form.email}
                    placeholder="example@gmail.com"
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  />
                </Field>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="grid gap-5 md:grid-cols-2">
                <Field label={t('auth.register.phone')}>
                  <input
                    className="field-input"
                    value={form.phone}
                    placeholder="+996..."
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, '')
                      const localDigits = digits.startsWith('996') ? digits.slice(3, 12) : digits.slice(0, 9)
                      setForm((current) => ({ ...current, phone: `+996${localDigits}` }))
                    }}
                  />
                </Field>
                <Field label={t('auth.register.incomeBand')}>
                  <input
                    className="field-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="Например: 500000"
                    value={form.incomeBand}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, incomeBand: event.target.value }))
                    }
                  />
                </Field>
              </div>
            ) : null}

            {step === 2 ? (
              <Field label={t('auth.login.password')}>
                <div className="relative">
                  <input
                    className="field-input pr-14 placeholder:text-[var(--text-muted)] placeholder:opacity-60"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    placeholder="********"
                    autoComplete="new-password"
                    name="auth_register_password"
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
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
                <ul className="mt-3 grid gap-1 text-xs text-[var(--text-muted)]">
                  <li className={passwordRules.minLength ? 'text-[var(--accent-cyan)]' : ''}>
                    Минимум 8 символов
                  </li>
                  <li className={passwordRules.upperCase ? 'text-[var(--accent-cyan)]' : ''}>
                    Хотя бы одна заглавная буква
                  </li>
                  <li className={passwordRules.lowerCase ? 'text-[var(--accent-cyan)]' : ''}>
                    Хотя бы одна строчная буква
                  </li>
                  <li className={passwordRules.number ? 'text-[var(--accent-cyan)]' : ''}>
                    Хотя бы одна цифра
                  </li>
                  <li className={passwordRules.special ? 'text-[var(--accent-cyan)]' : ''}>
                    Хотя бы один спецсимвол
                  </li>
                </ul>
              </Field>
            ) : null}

            {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

            <div className="flex flex-wrap gap-3">
              {step > 0 ? (
                <Button variant="secondary" onClick={() => setStep((current) => current - 1)}>
                  Назад
                </Button>
              ) : null}
              {step < steps.length - 1 ? (
                <Button onClick={handleNextStep}>
                  {t('common.continue')}
                </Button>
              ) : (
                <Button onClick={submit}>
                  {t('auth.register.action')}
                </Button>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  )
}
