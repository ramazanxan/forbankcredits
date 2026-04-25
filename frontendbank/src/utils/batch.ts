import {
  normalizeExtendedParams,
  type BatchInputRow,
  type BatchProcessedRow,
  type BatchRunResult,
  type CurvePoint,
  type HistogramBin,
  type ScoreFormData,
} from '@/types/domain'
import { clamp } from '@/utils/format'
import { calculateScore, SCORE_FIELDS } from '@/utils/scoring'

export const REQUIRED_BATCH_COLUMNS = ['credit_id', ...SCORE_FIELDS] as const

export function validateBatchColumns(headers: string[]) {
  const normalized = new Set(headers.map((header) => header.trim().toLowerCase()))

  return REQUIRED_BATCH_COLUMNS.filter((column) => !normalized.has(column))
}

export function normalizeBatchRows(rows: Record<string, unknown>[]) {
  return rows
    .map<BatchInputRow | null>((row, index) => {
      const creditId = String(row.credit_id ?? row.creditId ?? `CR-${index + 1}`).trim()
      if (!creditId) {
        return null
      }

      return {
        credit_id: creditId,
        age: Number(row.age ?? 0),
        monthly_income: Number(row.monthly_income ?? row.monthlyIncome ?? 0),
        employment_years: Number(row.employment_years ?? row.employmentYears ?? 0),
        loan_amount: Number(row.loan_amount ?? row.loanAmount ?? 0),
        loan_term_months: Number(row.loan_term_months ?? row.loanTermMonths ?? 0),
        interest_rate: Number(row.interest_rate ?? row.interestRate ?? 0),
        past_due_30d: Number(row.past_due_30d ?? row.pastDue30d ?? 0),
        inquiries_6m: Number(row.inquiries_6m ?? row.inquiries6m ?? 0),
        actual:
          row.actual === undefined || row.actual === null || row.actual === ''
            ? null
            : Number(row.actual) === 1
              ? 1
              : 0,
      }
    })
    .filter((row): row is BatchInputRow => row !== null)
}

export function buildBatchRun(
  rows: BatchInputRow[],
  threshold: number,
  modelName: string,
): BatchRunResult {
  const processedRows = rows.map<BatchProcessedRow>((row) => {
    const input = toScoreInput(row)
    const result = calculateScore(input, threshold)

    return {
      ...row,
      probability_default: Number(result.probabilityDefault.toFixed(4)),
      prediction: result.decision === 'approve' ? 'non_default' : 'default',
    }
  })

  const confusion = buildConfusionMatrix(processedRows)
  const rocCurve = buildRocCurve(processedRows)
  const prCurve = buildPrecisionRecall(processedRows)
  const accuracy =
    processedRows.length === 0
      ? 0
      : (confusion.tp.value + confusion.tn.value) / processedRows.length

  const precision =
    confusion.tp.value + confusion.fp.value === 0
      ? 0
      : confusion.tp.value / (confusion.tp.value + confusion.fp.value)
  const recall =
    confusion.tp.value + confusion.fn.value === 0
      ? 0
      : confusion.tp.value / (confusion.tp.value + confusion.fn.value)
  const f1 =
    precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall)

  return {
    metrics: {
      rocAuc: computeArea(rocCurve),
      prAuc: computeArea(prCurve),
      accuracy,
      f1,
    },
    confusion,
    rocCurve,
    histogram: buildHistogram(processedRows),
    rows: processedRows,
    logs: [
      `[boot] Model ${modelName} loaded`,
      `[boot] Threshold set to ${threshold.toFixed(2)}`,
      `[data] Received ${processedRows.length} rows`,
      '[score] Probability vectors generated',
      '[eval] Metrics refreshed',
    ],
  }
}

function buildConfusionMatrix(rows: BatchProcessedRow[]) {
  let tp = 0
  let tn = 0
  let fp = 0
  let fn = 0

  rows.forEach((row) => {
    if (row.actual === null || row.actual === undefined) {
      return
    }

    const predictedDefault = row.prediction === 'default'
    const actualDefault = row.actual === 1

    if (predictedDefault && actualDefault) {
      tp += 1
    } else if (!predictedDefault && !actualDefault) {
      tn += 1
    } else if (predictedDefault && !actualDefault) {
      fp += 1
    } else {
      fn += 1
    }
  })

  return {
    tp: { label: 'TP', value: tp },
    tn: { label: 'TN', value: tn },
    fp: { label: 'FP', value: fp },
    fn: { label: 'FN', value: fn },
  }
}

function buildRocCurve(rows: BatchProcessedRow[]) {
  const thresholds = Array.from({ length: 11 }, (_, index) => index / 10)

  return thresholds.map((threshold) => {
    let tp = 0
    let fp = 0
    let tn = 0
    let fn = 0

    rows.forEach((row) => {
      if (row.actual === null || row.actual === undefined) {
        return
      }

      const predictedDefault = row.probability_default >= threshold
      const actualDefault = row.actual === 1

      if (predictedDefault && actualDefault) {
        tp += 1
      } else if (!predictedDefault && !actualDefault) {
        tn += 1
      } else if (predictedDefault) {
        fp += 1
      } else {
        fn += 1
      }
    })

    const tpr = tp + fn === 0 ? 0 : tp / (tp + fn)
    const fpr = fp + tn === 0 ? 0 : fp / (fp + tn)

    return {
      x: clamp(fpr, 0, 1),
      y: clamp(tpr, 0, 1),
    }
  })
}

function buildPrecisionRecall(rows: BatchProcessedRow[]) {
  const thresholds = Array.from({ length: 11 }, (_, index) => index / 10)

  return thresholds.map((threshold) => {
    let tp = 0
    let fp = 0
    let fn = 0

    rows.forEach((row) => {
      if (row.actual === null || row.actual === undefined) {
        return
      }

      const predictedDefault = row.probability_default >= threshold
      const actualDefault = row.actual === 1

      if (predictedDefault && actualDefault) {
        tp += 1
      } else if (predictedDefault && !actualDefault) {
        fp += 1
      } else if (!predictedDefault && actualDefault) {
        fn += 1
      }
    })

    const precision = tp + fp === 0 ? 1 : tp / (tp + fp)
    const recall = tp + fn === 0 ? 0 : tp / (tp + fn)

    return {
      x: clamp(recall, 0, 1),
      y: clamp(precision, 0, 1),
    }
  })
}

function computeArea(points: CurvePoint[]) {
  return Number(
    points
      .slice()
      .sort((left, right) => left.x - right.x)
      .reduce((area, point, index, array) => {
        if (index === 0) {
          return 0
        }

        const previous = array[index - 1]
        return area + (point.x - previous.x) * ((point.y + previous.y) / 2)
      }, 0)
      .toFixed(3),
  )
}

function buildHistogram(rows: BatchProcessedRow[]): HistogramBin[] {
  return Array.from({ length: 5 }, (_, index) => {
    const min = index * 0.2
    const max = min + 0.2
    const count = rows.filter((row) =>
      index === 4
        ? row.probability_default >= min && row.probability_default <= max
        : row.probability_default >= min && row.probability_default < max,
    ).length

    return {
      label: `${min.toFixed(1)}-${max.toFixed(1)}`,
      count,
    }
  })
}

function toScoreInput(row: BatchInputRow): ScoreFormData {
  return {
    age: Number(row.age ?? 0),
    monthly_income: Number(row.monthly_income ?? 0),
    employment_years: Number(row.employment_years ?? 0),
    loan_amount: Number(row.loan_amount ?? 0),
    loan_term_months: Number(row.loan_term_months ?? 0),
    interest_rate: Number(row.interest_rate ?? 0),
    past_due_30d: Number(row.past_due_30d ?? 0),
    inquiries_6m: Number(row.inquiries_6m ?? 0),
    extended: normalizeExtendedParams(row.extended),
  }
}
