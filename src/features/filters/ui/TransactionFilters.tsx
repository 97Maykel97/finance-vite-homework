import type { TransactionFilters as Filters } from '@/shared/types/finance'
import styles from './TransactionFilters.module.scss'

interface Props {
  filters: Filters
  options: { currencies: string[]; sources: string[]; statuses: string[] }
  onChange: (name: keyof Filters, value: string) => void
  onReset: () => void
}

export function TransactionFilters({ filters, options, onChange, onReset }: Props) {
  return <form className={styles.filters} aria-label="Фильтры операций" onSubmit={(event) => event.preventDefault()}>
    <div className={styles.field}><label className={styles.label} htmlFor="filter-source">Источник</label><select className={styles.select} id="filter-source" value={filters.source} onChange={(event) => onChange('source', event.target.value)}><option value="all">Все</option>{options.sources.map((source) => <option key={source} value={source}>{source}</option>)}</select></div>
    <div className={styles.field}><label className={styles.label} htmlFor="filter-status">Статус</label><select className={styles.select} id="filter-status" value={filters.status} onChange={(event) => onChange('status', event.target.value)}><option value="all">Все</option>{options.statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></div>
    <div className={styles.field}><label className={styles.label} htmlFor="filter-currency">Валюта</label><select className={styles.select} id="filter-currency" value={filters.currency} onChange={(event) => onChange('currency', event.target.value)}><option value="all">Все</option>{options.currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}</select></div>
    <button className={styles.resetButton} type="button" onClick={onReset}>Сбросить</button>
  </form>
}
