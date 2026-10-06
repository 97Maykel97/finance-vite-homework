export function TransactionFilters({ filters, options, onChange, onReset }) {
  return <form className="filters" aria-label="Фильтры операций" onSubmit={(event) => event.preventDefault()}>
    <div><label htmlFor="filter-source">Источник</label><select id="filter-source" value={filters.source} onChange={(event) => onChange('source', event.target.value)}><option value="all">Все</option>{options.sources.map((source) => <option key={source} value={source}>{source}</option>)}</select></div>
    <div><label htmlFor="filter-status">Статус</label><select id="filter-status" value={filters.status} onChange={(event) => onChange('status', event.target.value)}><option value="all">Все</option><option value="paid">Оплачено</option><option value="pending">В ожидании</option></select></div>
    <div><label htmlFor="filter-currency">Валюта</label><select id="filter-currency" value={filters.currency} onChange={(event) => onChange('currency', event.target.value)}><option value="all">Все</option>{options.currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}</select></div>
    <button className="secondary-button" type="button" onClick={onReset}>Сбросить</button>
  </form>
}
