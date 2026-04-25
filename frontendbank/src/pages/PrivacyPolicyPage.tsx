import { Link } from 'react-router-dom'
import { buttonClasses } from '@/components/common/buttonStyles'
import { GlassCard } from '@/components/common/GlassCard'
import { PublicHeader } from '@/components/layout/PublicHeader'

export function PrivacyPolicyPage() {
  return (
    <>
      <PublicHeader />
      <div className="min-h-screen px-4 pb-14 pt-28 md:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <GlassCard>
            <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">Политика конфиденциальности</h1>
            <p className="mt-4 text-[var(--text-muted)]">
              Настоящая политика описывает, какие данные собирает NeuroBank, как они используются и как защищаются.
            </p>
          </GlassCard>

          <GlassCard className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">1. Какие данные мы обрабатываем</h2>
            <p className="text-[var(--text-muted)]">
              Контактные данные, технические данные устройства, действия в интерфейсе и сведения, введенные в формы заявки.
            </p>
            <h2 className="pt-2 text-xl font-semibold text-[var(--text-primary)]">2. Цели обработки</h2>
            <p className="text-[var(--text-muted)]">
              Аутентификация, работа личного кабинета, расчет скоринга, защита от мошенничества и улучшение качества сервиса.
            </p>
            <h2 className="pt-2 text-xl font-semibold text-[var(--text-primary)]">3. Cookie и аналитика</h2>
            <p className="text-[var(--text-muted)]">
              Мы используем обязательные cookie для работы сайта и дополнительные cookie для аналитики только после согласия пользователя.
            </p>
            <h2 className="pt-2 text-xl font-semibold text-[var(--text-primary)]">4. Права пользователя</h2>
            <p className="text-[var(--text-muted)]">
              Вы можете запросить доступ к данным, их исправление или удаление, отправив обращение на support@neurobank.kg.
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
