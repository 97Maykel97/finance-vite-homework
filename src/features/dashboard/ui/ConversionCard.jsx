export function ConversionCard({ conversion, targetCurrency }) {
  if (conversion.status === 'idle') return null
  if (conversion.status === 'loading') return <section className="conversion"><p className="rate-status">Получаем актуальные курсы…</p></section>
  if (conversion.status === 'error') {
    return <section className="conversion"><p className="rate-status error">Сумма в {targetCurrency} не рассчитана: {conversion.error}. Итоги по валютам доступны выше.</p></section>
  }

  const formatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: targetCurrency, maximumFractionDigits: 2 })
  const dates = [...new Set(conversion.rates.map(({ date }) => date).filter(Boolean))]
  const dateLabel = dates.length === 1 ? `Курсы на ${dates[0]}` : 'Курсы получены на разные даты'

  return <section className="conversion">
    <article className="conversion-card">
      <div>
        <span className="eyebrow">Общий итог в {targetCurrency}</span>
        <strong>{formatter.format(conversion.total)}</strong>
        <p>{dateLabel} · источник: Frankfurter</p>
      </div>
      <details>
        <summary>Использованные курсы</summary>
        <ul className="rates-list">
          {conversion.rates.map(({ currency, rate }) => <li key={currency}>1 {currency} = {rate} {targetCurrency}</li>)}
        </ul>
      </details>
    </article>
  </section>
}
