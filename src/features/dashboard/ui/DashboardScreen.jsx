'use client'

import { useMemo } from 'react'
import { useReportSettings } from '../../settings/model/ReportSettingsContext.jsx'
import { useCurrencyConversion } from '../../currency/model/useCurrencyConversion.js'
import { useDashboardData } from '../model/useDashboardData.js'
import { ConversionCard } from './ConversionCard.jsx'
import { SummaryCards } from './SummaryCards.jsx'
import { TransactionsTable } from './TransactionsTable.jsx'
import { ExportTransactionsButton } from '../../export/ui/ExportTransactionsButton.jsx'
import { useTransactionFilters } from '../../filters/model/useTransactionFilters.js'
import { TransactionFilters } from '../../filters/ui/TransactionFilters.jsx'
import { calculateTotals } from '../../finance/model/finance.js'

export function DashboardScreen() {
  const { targetCurrency } = useReportSettings()
  const { transactions, status, error, isRefreshing, refresh } = useDashboardData()
  const { filters, options, filteredTransactions, setFilter, resetFilters } = useTransactionFilters(transactions)
  const totals = useMemo(() => calculateTotals(filteredTransactions), [filteredTransactions])
  const conversion = useCurrencyConversion(totals, targetCurrency)

  return <main className="container">
    <header className="header"><div><h1>Финансовый обзор</h1><p>Операции из двух источников и их общий эквивалент.</p></div><button className="button" type="button" onClick={refresh} disabled={isRefreshing}>{isRefreshing ? 'Обновляем…' : 'Обновить данные'}</button></header>
    {status === 'loading' && <p className="status">Загружаем данные…</p>}
    {status === 'error' && <p className="status error">Не удалось загрузить данные: {error}</p>}
    {status === 'success' && <p className="status success">Показано операций: {filteredTransactions.length} из {transactions.length}</p>}
    {status === 'success' && <>
      <section className="report-tools"><TransactionFilters filters={filters} options={options} onChange={setFilter} onReset={resetFilters} /><ExportTransactionsButton transactions={filteredTransactions} /></section>
      <SummaryCards totals={totals} /><ConversionCard conversion={conversion} targetCurrency={targetCurrency} /><TransactionsTable transactions={filteredTransactions} />
    </>}
  </main>
}
