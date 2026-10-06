import { formatMoney } from '../../finance/model/finance.js'

export function TransactionsTable({ transactions }) {
  const sources = [...new Set(transactions.map(({ source }) => source))]
  return <section aria-labelledby="operations-title">
    <h2 id="operations-title">Все операции</h2>
    {sources.map((source) => {
      const sourceTransactions = transactions.filter((transaction) => transaction.source === source)
      return <article className="source" key={source}>
        <div className="source-title"><h3>{source}</h3><span>{sourceTransactions.length} операций</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Статус</th><th>Сумма</th><th>Валюта</th><th>В итоге</th></tr></thead>
            <tbody>{sourceTransactions.map((transaction, index) => {
              const isPaid = transaction.status === 'paid'
              return <tr className={isPaid ? '' : 'excluded'} key={`${transaction.source}-${index}`}>
                <td>{transaction.status}</td><td>{formatMoney(transaction.amount, transaction.currency)}</td>
                <td><span className="currency">{transaction.currency}</span></td>
                <td>{isPaid ? 'Учтена в итоге' : 'Не учтена в итоге'}</td>
              </tr>
            })}</tbody>
          </table>
        </div>
      </article>
    })}
  </section>
}
