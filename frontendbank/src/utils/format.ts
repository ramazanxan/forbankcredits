/**
 * Small formatting helpers shared across dashboards and charts.
 */
export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KGS',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatPercent(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'percent',
    maximumFractionDigits,
  }).format(value)
}

export function formatPlainNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits,
  }).format(value)
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-')
}
