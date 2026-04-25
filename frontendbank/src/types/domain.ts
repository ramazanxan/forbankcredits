export type Role = 'client' | 'moderator' | 'admin_it' | 'admin_bank'

export type AppLocale = 'ru' | 'kz' | 'en'

export type ThemeMode = 'midnight' | 'aurora'

export type RiskLevel = 'low' | 'medium' | 'high'

export type BatchFilter = 'all' | 'default' | 'non_default'

export type BatchPrediction = 'default' | 'non_default'

export type ScoreDecision = 'approve' | 'decline'

export type ScoreTone = 'approved' | 'declined_young' | 'declined_adult'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  title: string
  avatar: string
}

export interface AuthSession {
  token: string
  user: AuthUser
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  phone: string
  incomeBand: string
  password: string
}

export interface CreditProduct {
  id: string
  type: 'auto' | 'mortgage' | 'consumer' | 'business'
  icon: string
  rate: number
  termMonths: number
  maxAmount: number
  title: string
  description: string
  perks: string[]
}

/** Ключи расширенного профиля (свободный текст по каждому фактору). */
export const SCORE_EXTENDED_KEYS = [
  'socio_demographic',
  'country_birth_work',
  'workplace_profession',
  'education',
  'marital',
  'political_views',
  'country_macro',
  'legal',
  'capital_residence',
] as const

export type ScoreExtendedKey = (typeof SCORE_EXTENDED_KEYS)[number]

export type ScoreExtendedParams = Record<ScoreExtendedKey, string>

const EXTENDED_TEXT_MAX = 2000

export function defaultScoreExtendedParams(): ScoreExtendedParams {
  return Object.fromEntries(SCORE_EXTENDED_KEYS.map((key) => [key, ''])) as ScoreExtendedParams
}

/** Нормализация из API/CSV (старые числа 0–3 превращаем в строку). */
export function normalizeExtendedParams(raw: unknown): ScoreExtendedParams {
  const defaults = defaultScoreExtendedParams()
  if (!raw || typeof raw !== 'object') {
    return defaults
  }

  const obj = raw as Partial<Record<ScoreExtendedKey, unknown>>
  const next = { ...defaults }
  for (const key of SCORE_EXTENDED_KEYS) {
    const v = obj[key]
    if (typeof v === 'string') {
      next[key] = v.slice(0, EXTENDED_TEXT_MAX)
    } else if (typeof v === 'number' && Number.isFinite(v)) {
      next[key] = v === 0 ? '' : String(Math.trunc(v))
    }
  }
  return next
}

export interface ScoreFormData {
  age: number
  monthly_income: number
  employment_years: number
  loan_amount: number
  loan_term_months: number
  interest_rate: number
  past_due_30d: number
  inquiries_6m: number
  extended: ScoreExtendedParams
}

export interface ScoreResult {
  decision: ScoreDecision
  tone: ScoreTone
  probabilityDefault: number
  score: number
  riskLevel: RiskLevel
  monthlyPayment: number
  totalOverpayment: number
  factorKeys: string[]
  recommendationKeys: string[]
}

export interface KPI {
  id: string
  label: string
  value: string
  delta?: string
}

export interface LoanRecord {
  id: string
  product: string
  amount: number
  balance: number
  monthlyPayment: number
  dueDate: string
  status: 'active' | 'review' | 'closed'
}

export interface ApplicationRecord {
  id: string
  customer: string
  product: string
  amount: number
  status: 'new' | 'scored' | 'approved' | 'declined'
  probabilityDefault: number
  assignee: string
  createdAt: string
}

export interface ClientRecord {
  id: string
  name: string
  segment: string
  score: number
  activeLoans: number
  risk: RiskLevel
  manager: string
}

export interface ForumMessage {
  id: string
  author: string
  role: Role | 'guest'
  message: string
  time: string
}

export interface ModelVersion {
  id: string
  name: string
  stage: 'production' | 'shadow' | 'candidate'
  updatedAt: string
  rocAuc: number
  drift: string
}

export interface SystemLog {
  id: string
  level: 'info' | 'warning' | 'error'
  message: string
  timestamp: string
}

export interface BatchInputRow extends Partial<ScoreFormData> {
  credit_id: string
  actual?: 0 | 1 | null
}

export interface BatchProcessedRow extends BatchInputRow {
  probability_default: number
  prediction: BatchPrediction
}

export interface CurvePoint {
  x: number
  y: number
}

export interface ConfusionMatrixValue {
  label: string
  value: number
}

export interface ConfusionMatrix {
  tp: ConfusionMatrixValue
  tn: ConfusionMatrixValue
  fp: ConfusionMatrixValue
  fn: ConfusionMatrixValue
}

export interface BatchMetrics {
  rocAuc: number
  prAuc: number
  accuracy: number
  f1: number
}

export interface HistogramBin {
  label: string
  count: number
}

export interface BatchRunResult {
  metrics: BatchMetrics
  confusion: ConfusionMatrix
  rocCurve: CurvePoint[]
  histogram: HistogramBin[]
  rows: BatchProcessedRow[]
  logs: string[]
}

export interface BatchRunEntry {
  id: string
  createdAt: string
  processed: number
  threshold: number
  model: string
}
