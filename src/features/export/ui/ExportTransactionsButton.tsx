import { downloadTransactionsCsv } from '@/features/export/lib/exportTransactionsCsv'
import type { Transaction } from '@/shared/types/finance'
import styles from './ExportTransactionsButton.module.scss'

export function ExportTransactionsButton({ transactions }: { transactions: Transaction[] }) {
  return <button className={styles.button} type="button" onClick={() => downloadTransactionsCsv(transactions)} disabled={!transactions.length}>Экспорт CSV</button>
}
