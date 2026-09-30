const CURRENCY_PATTERN = /^[A-Z]{3}$/

function normalizeCurrency(value, sourceName) {
  if (typeof value !== 'string') {
    throw new Error(`${sourceName}: валюта не указана`)
  }

  const currency = value.trim().toUpperCase()

  if (!CURRENCY_PATTERN.test(currency)) {
    throw new Error(`${sourceName}: некорректная валюта "${value}"`)
  }

  return currency
}

function parseTextTransaction(value) {
  if (typeof value !== 'string') {
    throw new Error('Источник 2 содержит запись неверного формата')
  }

  const match = value.trim().match(/^([+-]?\d+(?:[.,]\d+)?)\s+([a-z]{3})$/i)

  if (!match) {
    throw new Error(`Не удалось обработать запись: "${value}"`)
  }

  const [, amount, currency] = match

  return {
    amount: Number(amount.replace(',', '.')),
    currency: normalizeCurrency(currency, 'Источник 2'),
    status: 'paid',
    source: 'Источник 2',
  }
}

function parseObjectTransaction(transaction) {
  if (!transaction || typeof transaction !== 'object') {
    throw new Error('Источник 1 содержит некорректную операцию')
  }

  const amountIsInvalid =
    typeof transaction.amount !== 'number' ||
    !Number.isFinite(transaction.amount)

  if (amountIsInvalid) {
    throw new Error('Источник 1: amount должен быть числом')
  }

  if (typeof transaction.type !== 'string' || !transaction.type.trim()) {
    throw new Error('Источник 1: type не указан')
  }

  return {
    amount: transaction.amount,
    status: transaction.type,
    currency: normalizeCurrency(transaction.currency, 'Источник 1'),
    source: 'Источник 1',
  }
}

export function normalizeTransactions(finance1, finance2) {
  const firstTransactions = finance1?.transactions

  if (!Array.isArray(firstTransactions)) {
    throw new Error('Источник 1 вернул данные неверного формата')
  }

  if (!Array.isArray(finance2)) {
    throw new Error('Источник 2 вернул данные неверного формата')
  }

  const firstSource = firstTransactions.map(parseObjectTransaction)
  const secondSource = finance2.map(parseTextTransaction)

  return [...firstSource, ...secondSource]
}

export function calculateTotals(transactions) {
  if (!Array.isArray(transactions)) {
    throw new Error('Список операций отсутствует')
  }

  return transactions.reduce((totals, transaction) => {
    if (!transaction || typeof transaction !== 'object') {
      throw new Error('Обнаружена некорректная операция')
    }

    if (transaction.status !== 'paid') {
      return totals
    }

    const { amount } = transaction
    const currency = normalizeCurrency(transaction.currency, 'Операция')

    if (typeof amount !== 'number' || !Number.isFinite(amount)) {
      throw new Error('Операция: amount должен быть числом')
    }

    totals[currency] = (totals[currency] ?? 0) + amount

    return totals
  }, {})
}

export function formatMoney(amount, currency) {
  return `${amount} ${currency}`
}
