import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/common/Button'
import { GlassCard } from '@/components/common/GlassCard'
import { PageHero } from '@/components/common/PageHero'
import { AppShell } from '@/components/layout/AppShell'
import { generateLiveForumMessage } from '@/data/mockDb'
import { useAppStore } from '@/store/appStore'

export function ForumPage() {
  const { t } = useTranslation()
  const auth = useAppStore((state) => state.auth)
  const forumMessages = useAppStore((state) => state.forumMessages)
  const addForumMessage = useAppStore((state) => state.addForumMessage)
  const [draft, setDraft] = useState('')
  const displayName = auth?.user.name?.split(/\s+/)[0] ?? 'Вы'

  useEffect(() => {
    let counter = 0
    const interval = window.setInterval(() => {
      counter += 1
      addForumMessage(generateLiveForumMessage(counter))
    }, 4500)

    return () => window.clearInterval(interval)
  }, [addForumMessage])

  return (
    <AppShell role="client">
      <PageHero title={t('client.forum.title')} description={t('client.forum.text')} />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.78fr]">
        <GlassCard className="space-y-4">
          {forumMessages.map((message) => (
            <div
              key={message.id}
              className="rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-[var(--text-primary)]">{message.author}</p>
                <span className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                  {message.time}
                </span>
              </div>
              <p className="mt-3 text-[var(--text-muted)]">{message.message}</p>
            </div>
          ))}
        </GlassCard>

        <GlassCard className="space-y-5">
          <h3 className="font-display text-3xl font-bold text-[var(--text-primary)]">Новое сообщение</h3>
          <textarea
            className="field-input min-h-[180px]"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Напишите сообщение"
          />
          <Button
            onClick={() => {
              if (!draft.trim()) {
                return
              }

              addForumMessage({
                id: `user-${Date.now()}`,
                author: displayName,
                role: 'client',
                message: draft,
                time: 'сейчас',
              })
              setDraft('')
            }}
          >
            {t('common.submit')}
          </Button>
        </GlassCard>
      </div>
    </AppShell>
  )
}
