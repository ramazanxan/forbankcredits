import { create } from 'zustand'
import { createInitialDemoState } from '@/data/mockDb'
import type {
  AppLocale,
  AuthSession,
  BatchRunEntry,
  ForumMessage,
  Role,
  ScoreResult,
  ThemeMode,
} from '@/types/domain'

interface AppState {
  locale: AppLocale
  theme: ThemeMode
  soundEnabled: boolean
  mobileMenuOpen: boolean
  auth: AuthSession | null
  lastScoreResult: ScoreResult | null
  easterEggVisible: boolean
  applications: ReturnType<typeof createInitialDemoState>['applications']
  clients: ReturnType<typeof createInitialDemoState>['clients']
  loans: ReturnType<typeof createInitialDemoState>['loans']
  forumMessages: ForumMessage[]
  modelVersions: ReturnType<typeof createInitialDemoState>['modelVersions']
  systemLogs: ReturnType<typeof createInitialDemoState>['systemLogs']
  batchRuns: BatchRunEntry[]
  setLocale: (locale: AppLocale) => void
  toggleTheme: () => void
  toggleSound: () => void
  setMobileMenuOpen: (value: boolean) => void
  setAuth: (auth: AuthSession | null) => void
  logout: () => void
  setLastScoreResult: (result: ScoreResult | null) => void
  addForumMessage: (message: ForumMessage) => void
  triggerEasterEgg: () => void
  appendBatchRun: (run: BatchRunEntry) => void
}

const initialState = createInitialDemoState()

export const useAppStore = create<AppState>((set) => ({
  locale: 'ru',
  theme: 'midnight',
  soundEnabled: true,
  mobileMenuOpen: false,
  auth: null,
  lastScoreResult: null,
  easterEggVisible: false,
  ...initialState,
  setLocale: (locale) => set({ locale }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'midnight' ? 'aurora' : 'midnight',
    })),
  toggleSound: () =>
    set((state) => ({
      soundEnabled: !state.soundEnabled,
    })),
  setMobileMenuOpen: (value) => set({ mobileMenuOpen: value }),
  setAuth: (auth) => set({ auth }),
  logout: () =>
    set({
      auth: null,
      mobileMenuOpen: false,
    }),
  setLastScoreResult: (result) => set({ lastScoreResult: result }),
  addForumMessage: (message) =>
    set((state) => ({
      forumMessages: [message, ...state.forumMessages].slice(0, 12),
    })),
  triggerEasterEgg: () => {
    set({ easterEggVisible: true })
    window.setTimeout(() => {
      useAppStore.setState({ easterEggVisible: false })
    }, 2200)
  },
  appendBatchRun: (run) =>
    set((state) => ({
      batchRuns: [run, ...state.batchRuns].slice(0, 10),
      systemLogs: [
        {
          id: `batch-${run.id}`,
          level: 'info' as const,
          message: `Пакетный тест ${run.id} добавлен в очередь обновления`,
          timestamp: new Date().toLocaleTimeString('ru-RU'),
        },
        ...state.systemLogs,
      ].slice(0, 18),
    })),
}))

export function getDefaultRoute(role: Role) {
  switch (role) {
    case 'client':
      return '/client'
    case 'moderator':
      return '/moderator'
    case 'admin_it':
      return '/admin/it'
    case 'admin_bank':
      return '/admin/bank'
  }
}
