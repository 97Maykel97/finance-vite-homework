const CURRENCY_PATTERN = /^[A-Z]{3}$/
const FIRST_SOURCE = 'Источник 1'
const SECOND_SOURCE = 'Источник 2'

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
    throw new Error(`${SECOND_SOURCE}: операция должна быть строкой`)
  }

  const match = value.trim().match(/^([+-]?\d+(?:[.,]\d+)?)\s+([a-z]{3})$/i)
  if (!match) {
    throw new Error(`Не удалось обработать запись: "${value}"`)
  }

  const [, amount, currency] = match
  return {
    amount: Number(amount.replace(',', '.')),
    currency: normalizeCurrency(currency, SECOND_SOURCE),
    status: 'paid',
    source: SECOND_SOURCE,
  }
}

function parseObjectTransaction(transaction) {
  if (!transaction || typeof transaction !== 'object') {
    throw new Error(`${FIRST_SOURCE}: некорректная операция`)
  }
  if (typeof transaction.amount !== 'number' || !Number.isFinite(transaction.amount)) {
    throw new Error(`${FIRST_SOURCE}: amount должен быть числом`)
  }
  if (typeof transaction.type !== 'string' || !transaction.type.trim()) {
    throw new Error(`${FIRST_SOURCE}: type не указан`)
  }

  return {
    amount: transaction.amount,
    status: transaction.type,
    currency: normalizeCurrency(transaction.currency, FIRST_SOURCE),
    source: FIRST_SOURCE,
  }
}

export function normalizeTransactions(finance1, finance2) {
  if (!Array.isArray(finance1?.transactions)) {
    throw new Error(`${FIRST_SOURCE}: неверный формат данных`)
  }
  if (!Array.isArray(finance2)) {
    throw new Error(`${SECOND_SOURCE}: неверный формат данных`)
  }

  return [
    ...finance1.transactions.map(parseObjectTransaction),
    ...finance2.map(parseTextTransaction),
  ]
}

export function calculateTotals(transactions) {
  if (!Array.isArray(transactions)) {
    throw new Error('Список операций отсутствует')
  }

  return transactions.reduce((totals, transaction) => {
    if (!transaction || typeof transaction !== 'object') {
      throw new Error('Обнаружена некорректная операция')
    }
    if (transaction.status !== 'paid') return totals

    const currency = normalizeCurrency(transaction.currency, 'Операция')
    if (typeof transaction.amount !== 'number' || !Number.isFinite(transaction.amount)) {
      throw new Error('Операция: amount должен быть числом')
    }
    totals[currency] = (totals[currency] ?? 0) + transaction.amount
    return totals
  }, {})
}

export function formatMoney(amount, currency) {
  return `${amount} ${currency}`
}
