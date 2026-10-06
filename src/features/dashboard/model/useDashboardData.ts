import { useQuery } from '@tanstack/react-query'
import { loadFinanceData } from '@/features/finance/api/financeApi'
import { normalizeTransactions } from '@/features/finance/model/finance'
import type { Transaction } from '@/shared/types/finance'

async function fetchTransactions({ signal }: { signal: AbortSignal }): Promise<Transaction[]> {
  const { finance1, finance2 } = await loadFinanceData(signal)
  return normalizeTransactions(finance1, finance2)
}

export function useDashboardData() {
  const query = useQuery<Transaction[], Error>({ queryKey: ['finance-transactions'], queryFn: fetchTransactions })
  return {
    transactions: query.data ?? [],
    status: query.isPending ? 'loading' : query.isError ? 'error' : 'success',
    error: query.error?.message ?? null,
    isRefreshing: query.isFetching,
    refresh: query.refetch,
  }
}
