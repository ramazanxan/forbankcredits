import { buildBatchRun } from '@/utils/batch'
import { calculateScore } from '@/utils/scoring'
import { batchTemplateRows, createDemoUser, products } from '@/data/mockDb'
import type {
  BatchInputRow,
  BatchRunResult,
  LoginPayload,
  RegisterPayload,
  Role,
  ScoreResult,
  ScoreFormData,
  AuthUser,
} from '@/types/domain'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'
const MOCK_AUTH_USERS_KEY = 'neurobank_mock_auth_users_v1'

interface AuthResponse {
  token: string
  role: Role
  user: AuthUser
}

interface UpdateProfilePayload {
  fullName: string
  avatar: string
}

interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

interface MockAuthAccount {
  id: string
  fullName: string
  email: string
  phone: string
  password: string
  role: Role
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

function simulateDelay<T>(data: T, duration = 900) {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(data), duration)
  })
}

function inferRole(email: string): Role {
  const normalized = email.toLowerCase()

  if (normalized.includes('moderator')) {
    return 'moderator'
  }
  if (normalized.includes('it') || normalized.includes('mlops')) {
    return 'admin_it'
  }
  if (normalized.includes('bank') || normalized.includes('finance')) {
    return 'admin_bank'
  }
  return 'client'
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function normalizePhone(value: string) {
  const raw = value.replace(/\D/g, '')
  if (raw.startsWith('996')) {
    return `+${raw}`
  }
  return value.startsWith('+') ? `+${raw}` : raw
}

function getSeedAccounts(): MockAuthAccount[] {
  return [
    {
      id: 'seed-client',
      fullName: 'Алия Нурбекова',
      email: 'client@neurobank.ai',
      phone: '+996555000001',
      password: 'demo1234',
      role: 'client',
    },
    {
      id: 'seed-moderator',
      fullName: 'Тимур Аскаров',
      email: 'moderator@neurobank.ai',
      phone: '+996555000002',
      password: 'demo1234',
      role: 'moderator',
    },
    {
      id: 'seed-admin-it',
      fullName: 'Никита Соколов',
      email: 'it@neurobank.ai',
      phone: '+996555000003',
      password: 'demo1234',
      role: 'admin_it',
    },
    {
      id: 'seed-admin-bank',
      fullName: 'Дана Жумабаева',
      email: 'bank@neurobank.ai',
      phone: '+996555000004',
      password: 'demo1234',
      role: 'admin_bank',
    },
  ]
}

function readMockAuthAccounts() {
  try {
    const raw = window.localStorage.getItem(MOCK_AUTH_USERS_KEY)
    if (!raw) {
      const seed = getSeedAccounts()
      window.localStorage.setItem(MOCK_AUTH_USERS_KEY, JSON.stringify(seed))
      return seed
    }

    const parsed = JSON.parse(raw) as MockAuthAccount[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seed = getSeedAccounts()
      window.localStorage.setItem(MOCK_AUTH_USERS_KEY, JSON.stringify(seed))
      return seed
    }

    return parsed
  } catch {
    const seed = getSeedAccounts()
    window.localStorage.setItem(MOCK_AUTH_USERS_KEY, JSON.stringify(seed))
    return seed
  }
}

function saveMockAuthAccounts(accounts: MockAuthAccount[]) {
  window.localStorage.setItem(MOCK_AUTH_USERS_KEY, JSON.stringify(accounts))
}

export const api = {
  auth: {
    async login(payload: LoginPayload): Promise<AuthResponse> {
      if (!USE_MOCK_API) {
        return request<AuthResponse>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      const accounts = readMockAuthAccounts()
      const loginValue = payload.email.trim()
      const loginIsEmail = loginValue.includes('@')
      const normalizedLogin = loginIsEmail ? normalizeEmail(loginValue) : normalizePhone(loginValue)

      const account = accounts.find((item) => {
        if (loginIsEmail) {
          return normalizeEmail(item.email) === normalizedLogin
        }
        return normalizePhone(item.phone) === normalizedLogin
      })

      if (!account) {
        throw new Error('ACCOUNT_NOT_FOUND')
      }

      if (account.password !== payload.password) {
        throw new Error('INVALID_PASSWORD')
      }

      const role = account.role
      const user = createDemoUser(role, account.email)

      return simulateDelay({
        token: `demo-token-${role}`,
        role,
        user: {
          ...user,
          name: account.fullName,
        },
      })
    },
    async register(payload: RegisterPayload): Promise<AuthResponse> {
      if (!USE_MOCK_API) {
        return request<AuthResponse>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      const accounts = readMockAuthAccounts()
      const normalizedEmail = normalizeEmail(payload.email)
      const normalizedPhone = normalizePhone(payload.phone)

      const exists = accounts.some(
        (item) =>
          normalizeEmail(item.email) === normalizedEmail || normalizePhone(item.phone) === normalizedPhone,
      )

      if (exists) {
        throw new Error('ACCOUNT_ALREADY_EXISTS')
      }

      const nextAccount: MockAuthAccount = {
        id: `usr-${Date.now()}`,
        fullName: payload.fullName.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim(),
        password: payload.password,
        role: inferRole(payload.email),
      }

      saveMockAuthAccounts([nextAccount, ...accounts])
      const user = createDemoUser(nextAccount.role, nextAccount.email)

      return simulateDelay({
        token: `demo-token-${nextAccount.role}`,
        role: nextAccount.role,
        user: {
          ...user,
          name: nextAccount.fullName,
        },
      })
    },

    async updateProfile(payload: UpdateProfilePayload): Promise<AuthResponse> {
      if (!USE_MOCK_API) {
        return request<AuthResponse>('/api/auth/profile', {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      }

      const accounts = readMockAuthAccounts()
      const token = window.localStorage.getItem('neurobank_mock_token') ?? ''
      const email = window.localStorage.getItem('neurobank_mock_email') ?? ''

      const normalized = normalizeEmail(email)
      const nextAccounts = accounts.map((item) =>
        normalizeEmail(item.email) === normalized ? { ...item, fullName: payload.fullName } : item,
      )
      saveMockAuthAccounts(nextAccounts)

      const account = nextAccounts.find((item) => normalizeEmail(item.email) === normalized)
      if (!account) {
        throw new Error('ACCOUNT_NOT_FOUND')
      }

      const user = createDemoUser(account.role, account.email)
      return simulateDelay({
        token: token || `demo-token-${account.role}`,
        role: account.role,
        user: {
          ...user,
          name: payload.fullName,
          avatar: payload.avatar || user.avatar,
        },
      })
    },

    async changePassword(payload: ChangePasswordPayload): Promise<void> {
      if (!USE_MOCK_API) {
        await request<void>('/api/auth/change-password', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        return
      }

      const accounts = readMockAuthAccounts()
      const email = window.localStorage.getItem('neurobank_mock_email') ?? ''
      const normalized = normalizeEmail(email)
      const account = accounts.find((item) => normalizeEmail(item.email) === normalized)
      if (!account) {
        throw new Error('ACCOUNT_NOT_FOUND')
      }

      if (account.password !== payload.currentPassword) {
        throw new Error('INVALID_PASSWORD')
      }

      saveMockAuthAccounts(
        accounts.map((item) =>
          normalizeEmail(item.email) === normalized ? { ...item, password: payload.newPassword } : item,
        ),
      )
      await simulateDelay(null, 500)
    },
  },
  score: {
    async predict(payload: ScoreFormData): Promise<ScoreResult> {
      if (!USE_MOCK_API) {
        return request<ScoreResult>('/api/scoring/predict', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      return simulateDelay(calculateScore(payload), 1200)
    },
  },
  batch: {
    async run(rows: BatchInputRow[], threshold: number, model: string): Promise<BatchRunResult> {
      if (!USE_MOCK_API) {
        return request<BatchRunResult>('/api/batch/run', {
          method: 'POST',
          body: JSON.stringify({ rows, threshold, model }),
        })
      }

      return simulateDelay(buildBatchRun(rows, threshold, model), 1600)
    },
    async getTemplate(): Promise<BatchInputRow[]> {
      return simulateDelay(batchTemplateRows, 200)
    },
  },
  reference: {
    async getProducts(): Promise<typeof products> {
      return simulateDelay(products, 300)
    },
  },
}
