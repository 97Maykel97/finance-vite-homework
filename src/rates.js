const RATES_URL = 'https://api.frankfurter.dev/v2/rate'
const TARGET_CURRENCY = 'USD'

async function loadRate(currency) {
  if (currency === TARGET_CURRENCY) return { currency, rate: 1, date: null }

  const response = await fetch(`${RATES_URL}/${currency}/${TARGET_CURRENCY}`)
  if (!response.ok) throw new Error(`Could not load rate ${currency}/${TARGET_CURRENCY}`)
  const data = await response.json()
  if (!Number.isFinite(data.rate) || typeof data.date !== 'string') {
    throw new Error(`Invalid rate ${currency}/${TARGET_CURRENCY}`)
  }
  return { currency, rate: data.rate, date: data.date }
}

export async function convertTotalsToUsd(totals) {
  const entries = Object.entries(totals)
  const rates = await Promise.all(entries.map(([currency]) => loadRate(currency)))
  const rateByCurrency = new Map(rates.map((item) => [item.currency, item]))
  const total = entries.reduce(
    (sum, [currency, amount]) => sum + amount * rateByCurrency.get(currency).rate,
    0,
  )
  return { total, rates }
}
