import { useMemo, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { api } from '@/api/api'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { DataTable } from '@/components/common/DataTable'
import { GlassCard } from '@/components/common/GlassCard'
import { KpiCard } from '@/components/common/KpiCard'
import { PageHero } from '@/components/common/PageHero'
import { AppShell } from '@/components/layout/AppShell'
import { ConfusionMatrixCard } from '@/components/tables/ConfusionMatrixCard'
import { HistogramChart } from '@/components/tables/HistogramChart'
import { SvgLineChart } from '@/components/tables/SvgLineChart'
import { batchTemplateRows } from '@/data/mockDb'
import { useAppStore } from '@/store/appStore'
import type { BatchFilter, BatchRunResult } from '@/types/domain'
import { normalizeBatchRows, validateBatchColumns } from '@/utils/batch'
import { cx, formatPercent } from '@/utils/format'
import styles from '@/pages/admin/it/BatchTestPage.module.css'

export function BatchTestPage() {
  const { t } = useTranslation()
  const modelVersions = useAppStore((state) => state.modelVersions)
  const appendBatchRun = useAppStore((state) => state.appendBatchRun)
  const [fileName, setFileName] = useState('template.csv')
  const [rawPreview, setRawPreview] = useState<Record<string, unknown>[]>(
    batchTemplateRows.slice(0, 5).map((row) => ({ ...row })) as Record<string, unknown>[],
  )
  const [rows, setRows] = useState(
    normalizeBatchRows(batchTemplateRows.map((row) => ({ ...row })) as Record<string, unknown>[]),
  )
  const [missingColumns, setMissingColumns] = useState<string[]>([])
  const [threshold, setThreshold] = useState(0.5)
  const [limitValue, setLimitValue] = useState('all')
  const [model, setModel] = useState(modelVersions[0]?.name ?? 'NeuroScore')
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processedCount, setProcessedCount] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [result, setResult] = useState<BatchRunResult | null>(null)
  const [filter, setFilter] = useState<BatchFilter>('all')
  const cancelRef = useRef(false)
  const intervalRef = useRef<number | null>(null)

  const limitedRows = useMemo(() => {
    if (limitValue === 'all') {
      return rows
    }

    const parsed = Number(limitValue)
    return rows.slice(0, Number.isFinite(parsed) ? parsed : rows.length)
  }, [limitValue, rows])

  const filteredRows = useMemo(() => {
    if (!result) {
      return []
    }

    return result.rows
      .filter((row) =>
        filter === 'default'
          ? row.prediction === 'default'
          : filter === 'non_default'
            ? row.prediction === 'non_default'
            : true,
      )
      .sort((left, right) => right.probability_default - left.probability_default)
  }, [filter, result])

  const dropzone = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (!file) {
        return
      }

      const parsedRows = await parseInputFile(file)
      const headers = Object.keys(parsedRows[0] ?? {})
      setFileName(file.name)
      setRawPreview(parsedRows.slice(0, 5))
      setMissingColumns(validateBatchColumns(headers))
      setRows(normalizeBatchRows(parsedRows))
      setResult(null)
      setLogs([`[upload] ${file.name} загружен`, `[schema] найдено колонок: ${headers.length}`])
    },
  })

  async function handleRun() {
    if (!limitedRows.length || missingColumns.length > 0) {
      return
    }

    cancelRef.current = false
    setRunning(true)
    setProgress(0)
    setProcessedCount(0)
    setResult(null)
    setLogs([
      `[boot] подготовка записей: ${limitedRows.length}`,
      `[model] выбрана модель: ${model}`,
    ])

    let processed = 0
    intervalRef.current = window.setInterval(() => {
      if (cancelRef.current) {
        return
      }

      processed = Math.min(limitedRows.length, processed + Math.max(1, Math.ceil(limitedRows.length / 9)))
      setProcessedCount(processed)
      setProgress(Math.min(94, Math.round((processed / Math.max(limitedRows.length, 1)) * 100)))
      setLogs((current) =>
        [...current, `[progress] обработано ${processed} из ${limitedRows.length}`].slice(-12),
      )
    }, 260)

    const next = await api.batch.run(limitedRows, threshold, model)

    if (cancelRef.current) {
      return
    }

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
    }

    setProgress(100)
    setProcessedCount(limitedRows.length)
    setLogs((current) => [...current, ...next.logs])
    setResult(next)
    appendBatchRun({
      id: `RUN-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toLocaleString('ru-RU'),
      processed: limitedRows.length,
      threshold,
      model,
    })
    setRunning(false)
  }

  function handleCancel() {
    cancelRef.current = true
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
    }
    setRunning(false)
    setProgress(0)
    setProcessedCount(0)
    setLogs((current) => [...current, '[cancel] запуск отменен оператором'])
  }

  function handleTemplateDownload() {
    const rowsString = batchTemplateRows
      .map((row, index) => {
        const values = [
          row.credit_id,
          row.age,
          row.monthly_income,
          row.employment_years,
          row.loan_amount,
          row.loan_term_months,
          row.interest_rate,
          row.past_due_30d,
          row.inquiries_6m,
          row.actual ?? '',
        ]

        return `${index === 0 ? 'credit_id,age,monthly_income,employment_years,loan_amount,loan_term_months,interest_rate,past_due_30d,inquiries_6m,actual\n' : ''}${values.join(',')}`
      })
      .join('\n')

    const blob = new Blob([rowsString], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'neurobank-batch-template.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleExportResults() {
    if (!result) {
      return
    }

    const header = 'credit_id,age,monthly_income,employment_years,loan_amount,loan_term_months,interest_rate,past_due_30d,inquiries_6m,probability_default,prediction,actual'
    const rowsCsv = result.rows.map((row) =>
      [
        row.credit_id,
        row.age ?? '',
        row.monthly_income ?? '',
        row.employment_years ?? '',
        row.loan_amount ?? '',
        row.loan_term_months ?? '',
        row.interest_rate ?? '',
        row.past_due_30d ?? '',
        row.inquiries_6m ?? '',
        row.probability_default,
        row.prediction,
        row.actual ?? '',
      ].join(','),
    )

    const blob = new Blob([[header, ...rowsCsv].join('\n')], {
      type: 'text/csv;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'neurobank-batch-results.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AppShell role="admin_it">
      <PageHero
        title={t('adminIt.batch.title')}
        description={t('adminIt.batch.text')}
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[1fr_minmax(0,1fr)]">
        <GlassCard className="min-w-0 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">{t('adminIt.batch.uploadTitle')}</p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                CSV / JSON / XLSX
              </h3>
            </div>
            {missingColumns.length ? <Badge tone="red">Ошибка схемы</Badge> : <Badge>Схема проверена</Badge>}
          </div>
          <p className="font-mono text-sm text-[var(--text-muted)]">Файл: {fileName}</p>

          <div
            {...dropzone.getRootProps()}
            className={cx(
              styles.dropzone,
              dropzone.isDragActive && styles.dropzoneActive,
              'rounded-[28px] p-8 text-center',
            )}
          >
            <input {...dropzone.getInputProps()} />
            <p className="font-display text-3xl font-bold text-[var(--text-primary)]">
              Перетащите файл сюда
            </p>
            <p className="mt-3 text-[var(--text-muted)]">
              Проверяем наличие 8 признаков и показываем preview первых 5 строк.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button type="button" onClick={() => dropzone.open()}>
                {t('adminIt.batch.uploadAction')}
              </Button>
              <Button type="button" variant="secondary" onClick={handleTemplateDownload}>
                {t('adminIt.batch.downloadTemplate')}
              </Button>
            </div>
          </div>

          {missingColumns.length ? (
            <div className="rounded-[20px] border border-[rgba(255,59,92,0.18)] bg-[rgba(255,59,92,0.08)] p-4">
              <p className="text-sm text-[var(--text-primary)]">
                Отсутствуют колонки: {missingColumns.join(', ')}
              </p>
            </div>
          ) : null}

          <div className="space-y-3">
            <p className="text-sm font-medium text-[var(--text-primary)]">{t('adminIt.batch.preview')}</p>
            <div className="overflow-x-auto rounded-[22px] border border-[rgba(255,255,255,0.06)]">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr>
                    {Object.keys(rawPreview[0] ?? {}).map((key) => (
                      <th
                        key={key}
                        className="border-b border-[rgba(255,255,255,0.06)] px-4 py-3 text-left text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rawPreview.map((row, index) => (
                    <tr key={`${index}-${row.credit_id ?? 'preview'}`}>
                      {Object.keys(rawPreview[0] ?? {}).map((key) => (
                        <td
                          key={key}
                          className="border-b border-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-primary)]"
                        >
                          {String(row[key] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="min-w-0 space-y-5">
          <p className="eyebrow">{t('adminIt.batch.runTitle')}</p>

          <label className="flex flex-col gap-3">
            <span className="text-sm text-[var(--text-primary)]">{t('adminIt.batch.threshold')}</span>
            <input
              className="w-full accent-[var(--accent-cyan)]"
              type="range"
              min={0.1}
              max={0.9}
              step={0.05}
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
            />
            <span className="font-mono text-sm text-[var(--text-muted)]">{threshold.toFixed(2)}</span>
          </label>

          <label className="flex flex-col gap-3">
            <span className="text-sm text-[var(--text-primary)]">{t('adminIt.batch.limit')}</span>
            <select
              className="field-input"
              value={limitValue}
              onChange={(event) => setLimitValue(event.target.value)}
            >
              <option value="all">Все строки</option>
              <option value="25">Первые 25</option>
              <option value="50">Первые 50</option>
              <option value="100">Первые 100</option>
            </select>
          </label>

          <label className="flex flex-col gap-3">
            <span className="text-sm text-[var(--text-primary)]">{t('adminIt.batch.model')}</span>
            <select className="field-input" value={model} onChange={(event) => setModel(event.target.value)}>
              {modelVersions.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleRun}
              disabled={!rows.length || running || missingColumns.length > 0}
            >
              {t('adminIt.batch.runAction')}
            </Button>
            {running ? (
              <Button type="button" variant="danger" onClick={handleCancel}>
                {t('adminIt.batch.cancelAction')}
              </Button>
            ) : null}
          </div>
        </GlassCard>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <GlassCard className="min-w-0 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">{t('adminIt.batch.progressTitle')}</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {t('adminIt.batch.processed')} {processedCount} / {limitedRows.length}
              </p>
            </div>
            <Badge tone={running ? 'amber' : 'green'}>{running ? 'Выполняется' : 'Ожидание'}</Badge>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-[rgba(255,255,255,0.04)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent-cyan),var(--accent-green))] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className={styles.terminal}>
            <div className="space-y-2 p-4">
              {logs.map((line, index) => (
                <p key={`${line}-${index}`} className="text-sm text-[var(--text-primary)]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </GlassCard>

        {result ? (
          <div className="grid min-w-0 gap-5 md:grid-cols-2">
            <KpiCard item={{ id: 'roc', label: 'ROC-AUC', value: result.metrics.rocAuc.toFixed(3) }} />
            <KpiCard item={{ id: 'pr', label: 'PR-AUC', value: result.metrics.prAuc.toFixed(3) }} />
            <KpiCard
              item={{ id: 'acc', label: 'Точность', value: formatPercent(result.metrics.accuracy) }}
            />
            <KpiCard item={{ id: 'f1', label: 'F1-Score', value: result.metrics.f1.toFixed(3) }} />
          </div>
        ) : (
          <GlassCard className="flex min-w-0 items-center justify-center">
            <p className="text-[var(--text-muted)]">Запустите тест, чтобы увидеть метрики</p>
          </GlassCard>
        )}
      </div>

      {result ? (
        <>
          <div className="grid gap-6 xl:grid-cols-3">
            <ConfusionMatrixCard matrix={result.confusion} />
            <SvgLineChart title="ROC-кривая" points={result.rocCurve} xLabel="FPR" yLabel="TPR" />
            <HistogramChart title="Распределение вероятностей" bins={result.histogram} />
          </div>

          <GlassCard className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={filter === 'all' ? 'primary' : 'secondary'}
                  onClick={() => setFilter('all')}
                >
                  {t('adminIt.batch.allRows')}
                </Button>
                <Button
                  type="button"
                  variant={filter === 'default' ? 'primary' : 'secondary'}
                  onClick={() => setFilter('default')}
                >
                  {t('adminIt.batch.onlyDefault')}
                </Button>
                <Button
                  type="button"
                  variant={filter === 'non_default' ? 'primary' : 'secondary'}
                  onClick={() => setFilter('non_default')}
                >
                  {t('adminIt.batch.onlyNonDefault')}
                </Button>
              </div>

              <Button type="button" variant="secondary" onClick={handleExportResults}>
                {t('adminIt.batch.export')}
              </Button>
            </div>

            <DataTable
              columns={[
                { key: 'credit', header: 'credit_id', render: (row) => row.credit_id },
                { key: 'age', header: 'age', render: (row) => row.age ?? '' },
                { key: 'income', header: 'income', render: (row) => row.monthly_income ?? '' },
                {
                  key: 'pd',
                  header: 'P(default)',
                  render: (row) => formatPercent(row.probability_default),
                },
                { key: 'pred', header: 'Прогноз', render: (row) => row.prediction },
                { key: 'actual', header: 'Факт', render: (row) => row.actual ?? 'n/a' },
              ]}
              rows={filteredRows}
              getRowKey={(row) => row.credit_id}
            />
          </GlassCard>
        </>
      ) : null}
    </AppShell>
  )
}

async function parseInputFile(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (extension === 'json') {
    const text = await file.text()
    return JSON.parse(text) as Record<string, unknown>[]
  }

  const buffer = await file.arrayBuffer()

  if (extension === 'csv') {
    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    return XLSX.utils.sheet_to_json(sheet, { defval: '' }) as Record<string, unknown>[]
  }

  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  return XLSX.utils.sheet_to_json(sheet, { defval: '' }) as Record<string, unknown>[]
}
