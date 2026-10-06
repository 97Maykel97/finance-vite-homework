export type CurrencyCode = string
export type TransactionStatus = string

export interface Transaction {
  amount: number
  currency: CurrencyCode
  source: string
  status: TransactionStatus
}

export type Totals = Record<CurrencyCode, number>

export interface CurrencyRate {
  currency: CurrencyCode
  rate: number
  date: string | null
}

export interface CurrencyConversion {
  total: number
  rates: CurrencyRate[]
}

export type ConversionState =
  | { status: 'idle'; isFetching: false }
  | { status: 'loading'; isFetching: true }
  | { status: 'error'; error: string; isFetching: false }
  | ({ status: 'success'; isFetching: boolean } & CurrencyConversion)

export interface TransactionFilters {
  currency: CurrencyCode | 'all'
  source: string | 'all'
  status: TransactionStatus | 'all'
}
