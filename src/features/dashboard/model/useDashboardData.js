import { useQuery } from '@tanstack/react-query'
import { loadFinanceData } from '../../finance/api/financeApi.js'
import { normalizeTransactions } from '../../finance/model/finance.js'

async function fetchTransactions({ signal }) {
  const { finance1, finance2 } = await loadFinanceData(signal)
  return normalizeTransactions(finance1, finance2)
}

export function useDashboardData() {
  const query = useQuery({ queryKey: ['finance-transactions'], queryFn: fetchTransactions })
  return {
    transactions: query.data ?? [],
    status: query.isPending ? 'loading' : query.isError ? 'error' : 'success',
    error: query.error?.message ?? null,
    isRefreshing: query.isFetching,
    refresh: query.refetch,
  }
}
