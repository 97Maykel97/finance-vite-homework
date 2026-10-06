import { formatMoney } from '@/features/finance/model/finance'
import type { Transaction } from '@/shared/types/finance'
import styles from './TransactionsTable.module.scss'

export function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const transactionsBySource = transactions.reduce<Record<string, Transaction[]>>((groups, transaction) => { (groups[transaction.source] ??= []).push(transaction); return groups }, {})
  const sources = Object.entries(transactionsBySource)
  return <section className={styles.section} aria-labelledby="operations-title"><h2 id="operations-title">Все операции</h2>{!sources.length && <p className={styles.emptyState}>По выбранным фильтрам операций не найдено.</p>}{sources.map(([source, sourceTransactions]) => <article className={styles.source} key={source}><div className={styles.sourceTitle}><h3>{source}</h3><span>{sourceTransactions.length} операций</span></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Статус</th><th>Сумма</th><th>Валюта</th><th>В итоге</th></tr></thead><tbody>{sourceTransactions.map((transaction, index) => { const isPaid = transaction.status === 'paid'; return <tr className={isPaid ? undefined : styles.excluded} key={`${transaction.source}-${index}`}><td>{transaction.status}</td><td className={styles.amount}>{formatMoney(transaction.amount, transaction.currency)}</td><td><span className={styles.currency}>{transaction.currency}</span></td><td>{isPaid ? 'Учтена в итоге' : 'Не учтена в итоге'}</td></tr> })}</tbody></table></div></article>)}</section>
}
