import {
  SCORE_EXTENDED_KEYS,
  defaultScoreExtendedParams,
  type ScoreFormData,
  type ScoreResult,
} from '@/types/domain'
import { clamp } from '@/utils/format'

export const SCORE_FIELDS = [
  'age',
  'monthly_income',
  'employment_years',
  'loan_amount',
  'loan_term_months',
  'interest_rate',
  'past_due_30d',
  'inquiries_6m',
] as const

const APPROVAL_THRESHOLD = 0.48

function extendedFieldDemoContribution(raw: unknown): number {
  const text = typeof raw === 'string' ? raw : String(raw ?? '')
  const trimmed = text.trim()
  if (!trimmed) {
    return 0
  }
  return clamp(0.018 + Math.min(trimmed.length, 480) * 0.00009, 0.018, 0.068)
}

/**
 * Produces a deterministic demo score that mirrors a typical risk-model output
 * and stays stable across single-score and batch-score flows.
 */
export function calculateScore(
  input: ScoreFormData,
  threshold = APPROVAL_THRESHOLD,
): ScoreResult {
  const loanToIncome = input.loan_amount / Math.max(input.monthly_income * 12, 1)
  const normalizedIncome = clamp(input.monthly_income / 1_800_000, 0, 1.2)
  const normalizedEmployment = clamp(input.employment_years / 18, 0, 1.1)
  const normalizedRate = clamp((input.interest_rate - 5) / 30, 0, 1.2)
  const normalizedTerm = clamp((input.loan_term_months - 6) / 78, 0, 1.1)

  const extended = input.extended ?? defaultScoreExtendedParams()
  let extendedLogit = 0
  for (const key of SCORE_EXTENDED_KEYS) {
    extendedLogit += extendedFieldDemoContribution(extended[key])
  }

  const contributions = {
    age:
      input.age < 24 ? 0.18 : input.age < 30 ? 0.08 : input.age > 55 ? -0.04 : 0.02,
    income: 0.28 - normalizedIncome * 0.36,
    employment: 0.18 - normalizedEmployment * 0.28,
    amount: loanToIncome > 1.6 ? 0.32 : loanToIncome > 1 ? 0.18 : 0.02,
    term: normalizedTerm * 0.14,
    rate: normalizedRate * 0.18,
    delinquencies: input.past_due_30d * 0.13,
    inquiries: input.inquiries_6m * 0.05,
    extendedProfile: extendedLogit,
  }

  const rawLogit =
    -0.8 +
    contributions.age +
    contributions.income +
    contributions.employment +
    contributions.amount +
    contributions.term +
    contributions.rate +
    contributions.delinquencies +
    contributions.inquiries +
    contributions.extendedProfile

  const probabilityDefault = clamp(1 / (1 + Math.exp(-rawLogit)), 0.02, 0.97)
  const decision = probabilityDefault < threshold ? 'approve' : 'decline'
  const score = Math.round(clamp((1 - probabilityDefault) * 850, 325, 830))
  const monthlyPayment = calculateMonthlyPayment(
    input.loan_amount,
    input.interest_rate,
    input.loan_term_months,
  )
  const totalOverpayment = monthlyPayment * input.loan_term_months - input.loan_amount

  const factorKeys = Object.entries(contributions)
    .sort(([, left], [, right]) => Math.abs(right) - Math.abs(left))
    .slice(0, 3)
    .map(([key]) => key)

  const recommendationKeys = buildRecommendations(input)

  return {
    decision,
    tone:
      decision === 'approve'
        ? 'approved'
        : input.age < 30
          ? 'declined_young'
          : 'declined_adult',
    probabilityDefault,
    score,
    riskLevel:
      probabilityDefault < 0.28
        ? 'low'
        : probabilityDefault < 0.55
          ? 'medium'
          : 'high',
    monthlyPayment,
    totalOverpayment,
    factorKeys,
    recommendationKeys,
  }
}

export function calculateMonthlyPayment(amount: number, annualRate: number, months: number) {
  const monthlyRate = annualRate / 100 / 12

  if (monthlyRate === 0) {
    return amount / Math.max(months, 1)
  }

  const denominator = 1 - (1 + monthlyRate) ** -months
  return amount * (monthlyRate / denominator)
}

function buildRecommendations(input: ScoreFormData) {
  const recommendations: string[] = []
  const extended = input.extended ?? defaultScoreExtendedParams()
  const filledCount = SCORE_EXTENDED_KEYS.filter((key) => extended[key].trim().length > 0).length
  const totalChars = SCORE_EXTENDED_KEYS.reduce((acc, key) => acc + extended[key].trim().length, 0)
  const legalLower = extended.legal.toLowerCase()

  if (input.past_due_30d > 0) {
    recommendations.push('reduce_delinquency')
  }
  if (input.inquiries_6m > 3) {
    recommendations.push('pause_inquiries')
  }
  if (input.loan_amount > input.monthly_income * 10) {
    recommendations.push('reduce_amount')
  }
  if (input.employment_years < 2) {
    recommendations.push('increase_stability')
  }
  if (
    /судим|штраф|пристав|арест|судебн|исполнител|административн|fine|conviction|bailiff|court|arrest/i.test(
      legalLower,
    ) &&
    extended.legal.trim().length > 2
  ) {
    recommendations.push('legal_disclosure')
  }
  if (filledCount >= 5 || totalChars >= 220) {
    recommendations.push('reduce_open_profile_risk')
  }
  if (recommendations.length === 0) {
    recommendations.push('keep_profile')
  }

  return recommendations.slice(0, 4)
}
