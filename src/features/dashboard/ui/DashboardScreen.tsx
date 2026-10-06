'use client'

import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useReportSettings } from '@/features/settings/model/ReportSettingsContext'
import { useCurrencyConversion } from '@/features/currency/model/useCurrencyConversion'
import { useDashboardData } from '@/features/dashboard/model/useDashboardData'
import { ConversionCard } from '@/features/dashboard/ui/ConversionCard'
import { SummaryCards } from '@/features/dashboard/ui/SummaryCards'
import { TransactionsTable } from '@/features/dashboard/ui/TransactionsTable'
import { ExportTransactionsButton } from '@/features/export/ui/ExportTransactionsButton'
import { useTransactionFilters } from '@/features/filters/model/useTransactionFilters'
import { TransactionFilters } from '@/features/filters/ui/TransactionFilters'
import { calculateTotals } from '@/features/finance/model/finance'
import styles from './DashboardScreen.module.scss'

export function DashboardScreen() {
  const { targetCurrency } = useReportSettings()
  const queryClient = useQueryClient()
  const { transactions, status, error, isRefreshing, refresh } = useDashboardData()
  const { filters, options, filteredTransactions, setFilter, resetFilters } = useTransactionFilters(transactions)
  const totals = useMemo(() => calculateTotals(filteredTransactions), [filteredTransactions])
  const conversion = useCurrencyConversion(totals, targetCurrency)
  const isUpdating = isRefreshing || conversion.isFetching

  async function refreshReport(): Promise<void> {
    await Promise.all([refresh(), queryClient.invalidateQueries({ queryKey: ['currency-conversion'] })])
  }

  return <main className={styles.container}>
    <header className={styles.header}><div><h1>Финансовый обзор</h1><p>Операции из двух источников и их общий эквивалент.</p></div><button className={styles.primaryButton} type="button" onClick={refreshReport} disabled={isUpdating}>{isUpdating ? 'Обновляем…' : 'Обновить данные'}</button></header>
    {status === 'loading' && <p className={styles.status} role="status">Загружаем данные…</p>}
    {status === 'error' && <p className={`${styles.status} ${styles.error}`} role="alert">Не удалось загрузить данные: {error}</p>}
    {status === 'success' && <p className={`${styles.status} ${styles.success}`} role="status">Показано операций: {filteredTransactions.length} из {transactions.length}</p>}
    {status === 'success' && <><section className={styles.reportTools}><TransactionFilters filters={filters} options={options} onChange={setFilter} onReset={resetFilters} /><ExportTransactionsButton transactions={filteredTransactions} /></section><SummaryCards totals={totals} /><ConversionCard conversion={conversion} targetCurrency={targetCurrency} /><TransactionsTable transactions={filteredTransactions} /></>}
  </main>
}
