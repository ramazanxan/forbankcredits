import { cx } from '@/utils/format'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  fullWidth?: boolean,
  disabled?: boolean,
) {
  return cx(
    'magnetic-button inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-[0.14em] uppercase transition duration-300',
    fullWidth && 'w-full',
    variant === 'primary' &&
      'bg-[linear-gradient(135deg,var(--accent-cyan),#23f0aa)] text-[var(--bg-primary)] shadow-[0_0_30px_var(--accent-glow)] hover:shadow-[0_0_40px_var(--accent-glow)]',
    variant === 'secondary' &&
      'border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] text-[var(--text-primary)] hover:border-[var(--border)] hover:bg-[rgba(255,255,255,0.08)]',
    variant === 'ghost' &&
      'text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--accent-cyan)]',
    variant === 'danger' &&
      'border border-[rgba(255,59,92,0.28)] bg-[rgba(255,59,92,0.08)] text-[var(--danger)] hover:shadow-[0_0_28px_rgba(255,59,92,0.22)]',
    disabled && 'cursor-not-allowed opacity-50',
  )
}
