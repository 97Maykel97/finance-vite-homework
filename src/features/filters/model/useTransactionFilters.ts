import { useMemo, useState } from 'react'
import type { Transaction, TransactionFilters as Filters } from '@/shared/types/finance'

const initialFilters: Filters = { currency: 'all', source: 'all', status: 'all' }

export function useTransactionFilters(transactions: Transaction[]) {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const options = useMemo(() => ({
    currencies: [...new Set(transactions.map(({ currency }) => currency))].sort(),
    sources: [...new Set(transactions.map(({ source }) => source))],
    statuses: [...new Set(transactions.map(({ status }) => status))],
  }), [transactions])
  const filteredTransactions = useMemo(() => transactions.filter((transaction) => (
    (filters.currency === 'all' || transaction.currency === filters.currency)
    && (filters.source === 'all' || transaction.source === filters.source)
    && (filters.status === 'all' || transaction.status === filters.status)
  )), [filters, transactions])

  function setFilter(name: keyof Filters, value: string) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  return { filters, options, filteredTransactions, setFilter, resetFilters: () => setFilters(initialFilters) }
}
