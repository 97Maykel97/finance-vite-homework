import { formatMoney } from '@/features/finance/model/finance'
import type { Totals } from '@/shared/types/finance'
import styles from './SummaryCards.module.scss'

export function SummaryCards({ totals }: { totals: Totals }) {
  const entries = Object.entries(totals)
  return <section className={styles.summary} aria-label="Итоги по валютам">
    {entries.length ? entries.map(([currency, amount]) => <article className={styles.card} key={currency}><span>Итого в {currency}</span><strong>{formatMoney(amount, currency)}</strong><small>Только оплаченные операции</small></article>) : <p className={styles.emptyState}>Нет оплаченных операций для подсчёта.</p>}
  </section>
}
