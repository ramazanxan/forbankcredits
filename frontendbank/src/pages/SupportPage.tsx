import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { buttonClasses } from '@/components/common/buttonStyles'
import { GlassCard } from '@/components/common/GlassCard'
import { SectionHeading } from '@/components/common/SectionHeading'
import { PublicHeader } from '@/components/layout/PublicHeader'

const FAQ = [
  {
    question: 'Как подключить Django REST API?',
    answer: 'Переключите VITE_USE_MOCK_API=false и укажите VITE_API_BASE_URL на адрес backend.',
  },
  {
    question: 'Где находится пакетная загрузка?',
    answer: 'Страница находится по адресу /admin/it/batch-test и принимает CSV, JSON и XLSX.',
  },
  {
    question: 'Почему данные сбрасываются после обновления страницы?',
    answer: 'В тестовом режиме данные хранятся в памяти фронтенда и очищаются после перезагрузки.',
  },
]

export function SupportPage() {
  const { t } = useTranslation()

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen px-4 pb-14 pt-28 md:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <GlassCard>
            <SectionHeading title={t('support.title')} description={t('support.text')} />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className={buttonClasses('secondary')}>
                Войти
              </Link>
              <Link to="/" className={buttonClasses('primary')}>
                На главную
              </Link>
            </div>
          </GlassCard>
          <div className="grid gap-5">
            {FAQ.map((item) => (
              <GlassCard key={item.question}>
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">{item.question}</h3>
                <p className="mt-3 text-[var(--text-muted)]">{item.answer}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
