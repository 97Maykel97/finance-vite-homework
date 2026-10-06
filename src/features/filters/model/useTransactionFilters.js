import { useMemo, useState } from 'react'

const initialFilters = { currency: 'all', source: 'all', status: 'all' }

export function useTransactionFilters(transactions) {
  const [filters, setFilters] = useState(initialFilters)
  const options = useMemo(() => ({
    currencies: [...new Set(transactions.map(({ currency }) => currency))].sort(),
    sources: [...new Set(transactions.map(({ source }) => source))],
  }), [transactions])

  const filteredTransactions = useMemo(() => transactions.filter((transaction) => (
    (filters.currency === 'all' || transaction.currency === filters.currency)
    && (filters.source === 'all' || transaction.source === filters.source)
    && (filters.status === 'all' || transaction.status === filters.status)
  )), [filters, transactions])

  function setFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  return { filters, options, filteredTransactions, setFilter, resetFilters: () => setFilters(initialFilters) }
}
