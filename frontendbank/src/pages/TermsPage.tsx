import { Link } from 'react-router-dom'
import { buttonClasses } from '@/components/common/buttonStyles'
import { GlassCard } from '@/components/common/GlassCard'
import { PublicHeader } from '@/components/layout/PublicHeader'

export function TermsPage() {
  return (
    <>
      <PublicHeader />
      <div className="min-h-screen px-4 pb-14 pt-28 md:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <GlassCard>
            <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">Пользовательское соглашение</h1>
            <p className="mt-4 text-[var(--text-muted)]">
              Настоящее соглашение регулирует использование платформы NeuroBank и порядок взаимодействия пользователя с сервисом.
            </p>
          </GlassCard>

          <GlassCard className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">1. Общие условия</h2>
            <p className="text-[var(--text-muted)]">
              Используя сайт, пользователь подтверждает согласие с правилами использования сервиса и обработки данных.
            </p>
            <h2 className="pt-2 text-xl font-semibold text-[var(--text-primary)]">2. Ответственность сторон</h2>
            <p className="text-[var(--text-muted)]">
              Пользователь обязан указывать достоверные данные. NeuroBank обеспечивает корректную работу интерфейса и защиту данных.
            </p>
            <h2 className="pt-2 text-xl font-semibold text-[var(--text-primary)]">3. Ограничения</h2>
            <p className="text-[var(--text-muted)]">
              Запрещены попытки несанкционированного доступа, автоматизированные атаки и действия, нарушающие безопасность системы.
            </p>
            <h2 className="pt-2 text-xl font-semibold text-[var(--text-primary)]">4. Изменение условий</h2>
            <p className="text-[var(--text-muted)]">
              Мы можем обновлять соглашение. Актуальная версия всегда размещается на этой странице.
            </p>
            <div className="pt-4">
              <Link to="/" className={buttonClasses('secondary')}>
                На главную
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  )
}
