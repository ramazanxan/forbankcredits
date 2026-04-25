import type { ReactNode } from 'react'
import { GlassCard } from '@/components/common/GlassCard'
import { cx } from '@/utils/format'

export interface DataColumn<Row> {
  key: string
  header: string
  className?: string
  render: (row: Row) => ReactNode
}

interface DataTableProps<Row> {
  columns: Array<DataColumn<Row>>
  rows: Row[]
  getRowKey: (row: Row, index: number) => string
  className?: string
}

export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  className,
}: DataTableProps<Row>) {
  return (
    <GlassCard className={cx('overflow-hidden p-0', className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-0">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="border-b border-[rgba(255,255,255,0.06)] px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                className="table-row-stagger border-b border-[rgba(255,255,255,0.04)]"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cx(
                      'border-b border-[rgba(255,255,255,0.04)] px-5 py-4 text-sm text-[var(--text-primary)]',
                      column.className,
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
