import { useQuery } from '@tanstack/react-query'
import { convertTotals } from '../api/ratesApi.js'

export function useCurrencyConversion(totals, targetCurrency) {
  const entries = Object.entries(totals).sort(([first], [second]) => first.localeCompare(second))
  const query = useQuery({
    queryKey: ['currency-conversion', targetCurrency, entries],
    queryFn: ({ signal }) => convertTotals(totals, targetCurrency, signal),
    enabled: entries.length > 0,
    staleTime: 5 * 60_000,
  })

  if (!entries.length) return { status: 'idle' }
  if (query.isPending) return { status: 'loading' }
  if (query.isError) return { status: 'error', error: query.error.message }
  return { status: 'success', ...query.data }
}
