import { downloadTransactionsCsv } from '../lib/exportTransactionsCsv.js'

export function ExportTransactionsButton({ transactions }) {
  return <button className="secondary-button" type="button" onClick={() => downloadTransactionsCsv(transactions)} disabled={!transactions.length}>
    Экспорт CSV
  </button>
}
