import type { PropsWithChildren } from 'react'
import { cx } from '@/utils/format'

interface FieldProps extends PropsWithChildren {
  label: string
  hint?: string
  error?: string
  /** В сетке с разной высотой подписей — инпут остаётся на одной линии с соседним полем */
  pinInputToBottom?: boolean
}

export function Field({ label, hint, error, children, pinInputToBottom }: FieldProps) {
  return (
    <label className={cx('flex flex-col gap-3', pinInputToBottom && 'h-full min-h-0')}>
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-[var(--text-primary)]">
          {label}
        </span>
        {hint ? (
          <span className="shrink-0 pt-0.5 text-right text-xs text-[var(--text-muted)]">{hint}</span>
        ) : null}
      </div>
      <div className={cx(pinInputToBottom && 'mt-auto w-full')}>{children}</div>
      {error ? <span className="text-xs text-[var(--danger)]">{error}</span> : null}
    </label>
  )
}
