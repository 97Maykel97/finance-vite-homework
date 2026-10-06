import type { Totals, Transaction } from '@/shared/types/finance'

const CURRENCY_PATTERN = /^[A-Z]{3}$/
const FIRST_SOURCE = 'Источник 1'
const SECOND_SOURCE = 'Источник 2'

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === 'object'
}

function normalizeCurrency(value: unknown, sourceName: string): string {
  if (typeof value !== 'string') throw new Error(`${sourceName}: валюта не указана`)
  const currency = value.trim().toUpperCase()
  if (!CURRENCY_PATTERN.test(currency)) throw new Error(`${sourceName}: некорректная валюта`)
  return currency
}

function parseObjectTransaction(value: unknown): Transaction {
  if (!isRecord(value)) throw new Error(`${FIRST_SOURCE}: некорректная операция`)
  if (typeof value.amount !== 'number' || !Number.isFinite(value.amount)) throw new Error(`${FIRST_SOURCE}: сумма должна быть числом`)
  if (typeof value.type !== 'string' || !value.type.trim()) throw new Error(`${FIRST_SOURCE}: статус не указан`)
  return { amount: value.amount, status: value.type, currency: normalizeCurrency(value.currency, FIRST_SOURCE), source: FIRST_SOURCE }
}

function parseTextTransaction(value: unknown): Transaction {
  if (typeof value !== 'string') throw new Error(`${SECOND_SOURCE}: операция должна быть строкой`)
  const match = value.trim().match(/^([+-]?\d+(?:[.,]\d+)?)\s+([a-z]{3})$/i)
  if (!match) throw new Error(`${SECOND_SOURCE}: некорректный формат операции`)
  const [, amount, currency] = match
  return { amount: Number(amount.replace(',', '.')), status: 'paid', currency: normalizeCurrency(currency, SECOND_SOURCE), source: SECOND_SOURCE }
}

export function normalizeTransactions(finance1: unknown, finance2: unknown): Transaction[] {
  if (!isRecord(finance1) || !Array.isArray(finance1.transactions)) throw new Error(`${FIRST_SOURCE}: неверный формат данных`)
  if (!Array.isArray(finance2)) throw new Error(`${SECOND_SOURCE}: неверный формат данных`)
  return [...finance1.transactions.map(parseObjectTransaction), ...finance2.map(parseTextTransaction)]
}

export function calculateTotals(transactions: Transaction[]): Totals {
  return transactions.reduce<Totals>((totals, transaction) => {
    if (transaction.status !== 'paid') return totals
    totals[transaction.currency] = (totals[transaction.currency] ?? 0) + transaction.amount
    return totals
  }, {})
}

export function formatMoney(amount: number, currency: string): string {
  return `${amount} ${currency}`
}
