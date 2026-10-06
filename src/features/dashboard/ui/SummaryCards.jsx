import { formatMoney } from '../../finance/model/finance.js'

export function SummaryCards({ totals }) {
  const entries = Object.entries(totals)
  return <section className="summary" aria-label="Итоги по валютам">
    {entries.length ? entries.map(([currency, amount]) => (
      <article className="card" key={currency}>
        <span>Итого в {currency}</span>
        <strong>{formatMoney(amount, currency)}</strong>
        <small>Только оплаченные операции</small>
      </article>
    )) : <p className="empty-state">Нет оплаченных операций для подсчёта.</p>}
  </section>
}
