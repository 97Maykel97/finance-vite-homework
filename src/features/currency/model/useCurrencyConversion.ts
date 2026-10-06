import { useQuery } from '@tanstack/react-query'
import { convertTotals } from '@/features/currency/api/ratesApi'
import type { ConversionState, CurrencyConversion, Totals } from '@/shared/types/finance'

export function useCurrencyConversion(totals: Totals, targetCurrency: string): ConversionState {
  const entries = Object.entries(totals).sort(([first], [second]) => first.localeCompare(second))
  const query = useQuery<CurrencyConversion, Error>({
    queryKey: ['currency-conversion', targetCurrency, entries],
    queryFn: ({ signal }) => convertTotals(totals, targetCurrency, signal),
    enabled: entries.length > 0,
    staleTime: 5 * 60_000,
  })

  if (!entries.length) return { status: 'idle', isFetching: false }
  if (query.isPending) return { status: 'loading', isFetching: true }
  if (query.isError) return { status: 'error', error: query.error.message, isFetching: false }
  return { status: 'success', ...query.data, isFetching: query.isFetching }
}
