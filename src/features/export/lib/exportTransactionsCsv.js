function escapeCsvValue(value) {
  const text = String(value ?? '')
  const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text
  return `"${safeText.replaceAll('"', '""')}"`
}

export function downloadTransactionsCsv(transactions) {
  const rows = [
    ['Источник', 'Статус', 'Сумма', 'Валюта'],
    ...transactions.map(({ source, status, amount, currency }) => [source, status, amount, currency]),
  ]
  const csv = `\uFEFF${rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n')}`
  const file = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = 'finance-report.csv'
  link.click()
  URL.revokeObjectURL(url)
}
