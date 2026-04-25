import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import { DataTable } from '@/components/common/DataTable'
import { GlassCard } from '@/components/common/GlassCard'
import { PageHero } from '@/components/common/PageHero'
import { AppShell } from '@/components/layout/AppShell'

type UserRow = { id: string; name: string; role: string; state: string }

const STORAGE_KEY = 'neurobank_admin_it_users_v1'

const DEFAULT_USERS: UserRow[] = [
  { id: 'USR-01', name: 'Алия Н.', role: 'Клиент', state: 'Активен' },
  { id: 'USR-02', name: 'Тимур А.', role: 'Модератор', state: 'Активен' },
  { id: 'USR-03', name: 'Никита С.', role: 'IT-админ', state: 'Активен' },
  { id: 'USR-04', name: 'Дана Ж.', role: 'Администратор банка', state: 'Приглашен' },
]

export function AdminItUsersPage() {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<UserRow>({ id: '', name: '', role: 'Клиент', state: 'Активен' })

  const [rows, setRows] = useState<UserRow[]>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS))
        return DEFAULT_USERS
      }
      const parsed = JSON.parse(raw) as UserRow[]
      return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_USERS
    } catch {
      return DEFAULT_USERS
    }
  })

  function persist(next: UserRow[]) {
    setRows(next)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  function resetDraft() {
    setDraft({ id: '', name: '', role: 'Клиент', state: 'Активен' })
    setEditingId(null)
  }

  const roleCounts = useMemo(() => {
    const map = new Map<string, number>()
    for (const row of rows) {
      map.set(row.role, (map.get(row.role) ?? 0) + 1)
    }
    return Array.from(map.entries()).map(([label, count]) => ({ label, count }))
  }, [rows])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
    onDrop: async (files) => {
      setError('')
      const file = files[0]
      if (!file) return

      try {
        const data = await file.arrayBuffer()
        const workbook = XLSX.read(data)
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
        const parsed = json
          .map((item, index) => ({
            id: String(item.id ?? item.ID ?? `USR-${Date.now()}-${index}`),
            name: String(item.name ?? item.Name ?? item.Имя ?? ''),
            role: String(item.role ?? item.Role ?? item.Роль ?? 'Клиент'),
            state: String(item.state ?? item.State ?? item.Состояние ?? 'Активен'),
          }))
          .filter((item) => item.name.trim().length > 0)

        if (!parsed.length) {
          setError('Файл не содержит строк с пользователями')
          return
        }

        persist(parsed)
      } catch {
        setError('Не удалось прочитать файл. Используйте CSV/XLSX.')
      }
    },
  })

  function exportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')
    XLSX.writeFile(workbook, 'users.xlsx')
  }

  function startEdit(row: UserRow) {
    setDraft(row)
    setEditingId(row.id)
  }

  function saveDraft() {
    setError('')
    if (!draft.name.trim()) {
      setError('Заполните имя пользователя')
      return
    }

    if (editingId) {
      persist(rows.map((row) => (row.id === editingId ? { ...draft } : row)))
      resetDraft()
      return
    }

    const id = draft.id.trim() || `USR-${String(Date.now()).slice(-6)}`
    persist([{ ...draft, id }, ...rows])
    resetDraft()
  }

  function removeRow(id: string) {
    persist(rows.filter((row) => row.id !== id))
    if (editingId === id) {
      resetDraft()
    }
  }

  return (
    <AppShell role="admin_it">
      <PageHero title={t('adminIt.users.title')} description={t('adminIt.users.text')} />
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <p className="eyebrow">Управление</p>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Имя</label>
                <input
                  className="field-input mt-2"
                  value={draft.name}
                  onChange={(e) => setDraft((c) => ({ ...c, name: e.target.value }))}
                  placeholder="Иванов Иван"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Роль</label>
                <select
                  className="field-input mt-2"
                  value={draft.role}
                  onChange={(e) => setDraft((c) => ({ ...c, role: e.target.value }))}
                >
                  <option value="Клиент">Клиент</option>
                  <option value="Модератор">Модератор</option>
                  <option value="IT-админ">IT-админ</option>
                  <option value="Администратор банка">Администратор банка</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Состояние</label>
                <select
                  className="field-input mt-2"
                  value={draft.state}
                  onChange={(e) => setDraft((c) => ({ ...c, state: e.target.value }))}
                >
                  <option value="Активен">Активен</option>
                  <option value="Заблокирован">Заблокирован</option>
                  <option value="Приглашен">Приглашен</option>
                </select>
              </div>
            </div>

            {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full bg-[linear-gradient(135deg,var(--accent-cyan),var(--accent-green))] px-5 py-3 text-sm font-semibold text-[var(--bg-primary)] shadow-[0_0_20px_var(--accent-glow)]"
                onClick={saveDraft}
              >
                {editingId ? 'Сохранить' : 'Добавить'}
              </button>
              {editingId ? (
                <button
                  type="button"
                  className="rounded-full border border-[rgba(255,255,255,0.12)] px-5 py-3 text-sm text-[var(--text-primary)] hover:border-[var(--border)]"
                  onClick={resetDraft}
                >
                  Отмена
                </button>
              ) : null}
              <button
                type="button"
                className="rounded-full border border-[rgba(255,255,255,0.12)] px-5 py-3 text-sm text-[var(--text-primary)] hover:border-[var(--border)]"
                onClick={exportExcel}
              >
                Экспорт Excel
              </button>
            </div>
          </GlassCard>

          <div
            {...getRootProps()}
            className="rounded-[26px] border border-dashed border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.02)] p-6 text-center text-sm text-[var(--text-muted)] transition hover:border-[var(--border)]"
          >
            <input {...getInputProps()} />
            {isDragActive ? 'Отпустите файл для загрузки…' : 'Перетащите CSV/XLSX сюда или кликните для выбора'}
          </div>

          <DataTable
            columns={[
              { key: 'id', header: 'ID', render: (row) => row.id },
              { key: 'name', header: 'Имя', render: (row) => row.name },
              { key: 'role', header: 'Роль', render: (row) => row.role },
              { key: 'state', header: 'Состояние', render: (row) => row.state },
              {
                key: 'actions',
                header: 'Действия',
                render: (row) => (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-[rgba(255,255,255,0.12)] px-3 py-2 text-xs text-[var(--text-primary)] hover:border-[var(--border)]"
                      onClick={() => startEdit(row)}
                    >
                      Редактировать
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-[rgba(255,255,255,0.12)] px-3 py-2 text-xs text-[var(--danger)] hover:border-[rgba(255,59,92,0.45)]"
                      onClick={() => removeRow(row.id)}
                    >
                      Удалить
                    </button>
                  </div>
                ),
              },
            ]}
            rows={rows}
            getRowKey={(row) => row.id}
          />
        </div>

        <div className="space-y-6">
          <GlassCard className="space-y-5">
            <p className="eyebrow">Отчет</p>
            <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              Распределение ролей
            </h3>
            <div className="space-y-3">
              {roleCounts.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                    <span>{item.label}</span>
                    <span className="font-mono text-[var(--text-primary)]">{item.count}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent-cyan),var(--accent-green))]"
                      style={{ width: `${(item.count / Math.max(rows.length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  )
}
