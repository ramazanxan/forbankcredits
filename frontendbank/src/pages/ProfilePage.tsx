import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '@/api/api'
import { Button } from '@/components/common/Button'
import { Field } from '@/components/common/Field'
import { GlassCard } from '@/components/common/GlassCard'
import { PageHero } from '@/components/common/PageHero'
import { AppShell } from '@/components/layout/AppShell'
import { useAppStore } from '@/store/appStore'

export function ProfilePage() {
  const { t } = useTranslation()
  const auth = useAppStore((s) => s.auth)
  const setAuth = useAppStore((s) => s.setAuth)

  const [name, setName] = useState(auth?.user.name ?? '')
  const [avatar, setAvatar] = useState(auth?.user.avatar ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const passwordRules = useMemo(
    () => ({
      minLength: newPassword.length >= 8,
      upperCase: /[A-Z]/.test(newPassword),
      lowerCase: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword),
    }),
    [newPassword],
  )
  const isPasswordStrong = Object.values(passwordRules).every(Boolean)

  if (!auth) {
    return <Navigate to="/login" replace />
  }

  async function saveProfile() {
    setError('')
    setSuccess('')

    if (!name.trim()) {
      setError('Заполните имя')
      return
    }

    try {
      setSaving(true)
      const result = await api.auth.updateProfile({
        fullName: name.trim(),
        avatar: avatar,
      })
      setAuth(result)
      setSuccess('Профиль обновлен')
    } catch {
      setError('Не удалось сохранить профиль')
    } finally {
      setSaving(false)
    }
  }

  async function changePassword() {
    setError('')
    setSuccess('')

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('Заполните все поля пароля')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (!isPasswordStrong) {
      setError('Новый пароль не соответствует требованиям безопасности')
      return
    }

    try {
      setSaving(true)
      await api.auth.changePassword({
        currentPassword,
        newPassword,
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess('Пароль изменен')
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      if (message === 'INVALID_PASSWORD') {
        setError('Текущий пароль неверный')
      } else {
        setError('Не удалось изменить пароль')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell role={auth.user.role}>
      <PageHero title="Профиль" description="Управление данными аккаунта и безопасностью." />
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <GlassCard className="space-y-6">
          <p className="eyebrow">{t('common.brand')}</p>
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[26px] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.03)] text-lg font-semibold text-[var(--accent-cyan)]">
              {avatar.startsWith('data:image') ? (
                <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <span>{auth.user.avatar}</span>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-[var(--text-primary)]">{auth.user.email}</p>
              <p className="text-sm text-[var(--text-muted)]">{t(`roles.${auth.user.role}`)}</p>
            </div>
          </div>

          <Field label="Имя">
            <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Аватар</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  const result = typeof reader.result === 'string' ? reader.result : ''
                  if (result) setAvatar(result)
                }
                reader.readAsDataURL(file)
              }}
            />
            <p className="text-sm text-[var(--text-muted)]">PNG/JPG, сохранится локально в браузере.</p>
          </div>

          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          {success ? <p className="text-sm text-[var(--accent-cyan)]">{success}</p> : null}

          <Button onClick={saveProfile} disabled={saving}>
            Сохранить
          </Button>
        </GlassCard>

        <GlassCard className="space-y-6">
          <p className="eyebrow">Безопасность</p>
          <h3 className="font-display text-3xl font-bold text-[var(--text-primary)]">Смена пароля</h3>

          <Field label="Текущий пароль">
            <input
              className="field-input"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="********"
              autoComplete="current-password"
            />
          </Field>
          <Field label="Новый пароль">
            <input
              className="field-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="********"
              autoComplete="new-password"
            />
          </Field>
          <Field label="Повторите новый пароль">
            <input
              className="field-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              autoComplete="new-password"
            />
          </Field>

          <ul className="grid gap-1 text-xs text-[var(--text-muted)]">
            <li className={passwordRules.minLength ? 'text-[var(--accent-cyan)]' : ''}>Минимум 8 символов</li>
            <li className={passwordRules.upperCase ? 'text-[var(--accent-cyan)]' : ''}>Заглавная буква</li>
            <li className={passwordRules.lowerCase ? 'text-[var(--accent-cyan)]' : ''}>Строчная буква</li>
            <li className={passwordRules.number ? 'text-[var(--accent-cyan)]' : ''}>Цифра</li>
            <li className={passwordRules.special ? 'text-[var(--accent-cyan)]' : ''}>Спецсимвол</li>
          </ul>

          <Button onClick={changePassword} disabled={saving}>
            Изменить пароль
          </Button>
        </GlassCard>
      </div>
    </AppShell>
  )
}

