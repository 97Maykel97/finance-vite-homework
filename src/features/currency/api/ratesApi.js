async function loadRate(currency, targetCurrency, signal) {
  if (currency === targetCurrency) return { currency, rate: 1, date: null }
  const response = await fetch(`/api/rates/${currency}/${targetCurrency}`, { signal })
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error ?? `Не удалось получить курс ${currency}/${targetCurrency}`)
  }
  const data = await response.json()
  if (!Number.isFinite(data.rate) || typeof data.date !== 'string') throw new Error('Сервис курсов вернул некорректные данные')
  return { currency, rate: data.rate, date: data.date }
}

export async function convertTotals(totals, targetCurrency, signal) {
  const entries = Object.entries(totals)
  const rates = await Promise.all(entries.map(([currency]) => loadRate(currency, targetCurrency, signal)))
  const rateByCurrency = new Map(rates.map((item) => [item.currency, item.rate]))
  const total = entries.reduce((sum, [currency, amount]) => sum + amount * rateByCurrency.get(currency), 0)
  return { total, rates }
}
