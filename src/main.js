import './style.css'
import { loadFinanceData } from './api.js'
import {
  calculateTotals,
  formatMoney,
  normalizeTransactions,
} from './finance.js'

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="container">
    <header class="header">
      <div>
        <h1>Финансовый обзор</h1>
        <p>В итог входят оплаченные операции. Валюты считаются отдельно.</p>
      </div>

      <button id="refresh" class="button" type="button">
        Обновить данные
      </button>
    </header>

    <p id="status" class="status" aria-live="polite">
      Загрузка данных…
    </p>

    <section id="summary" class="summary"></section>

    <section>
      <h2>Все операции</h2>
      <div id="tables"></div>
    </section>
  </main>
`

const statusElement = document.querySelector('#status')
const summaryElement = document.querySelector('#summary')
const tablesElement = document.querySelector('#tables')
const refreshButton = document.querySelector('#refresh')

function renderTotals(totals) {
  summaryElement.innerHTML = Object.entries(totals)
    .map(([currency, amount]) => `
      <article class="card">
        <span>Итого в ${currency}</span>
        <strong>${formatMoney(amount, currency)}</strong>
      </article>
    `)
    .join('')
}

function renderTransactions(transactions) {
  const sources = ['Источник 1', 'Источник 2']

  tablesElement.innerHTML = sources
    .map((source) => {
      const sourceTransactions = transactions.filter(
        (transaction) => transaction.source === source,
      )

      const rows = sourceTransactions
        .map((transaction) => {
          const isPaid = transaction.status === 'paid'

          return `
            <tr class="${isPaid ? '' : 'excluded'}">
              <td>${transaction.status}</td>
              <td>${formatMoney(transaction.amount, transaction.currency)}</td>
              <td><span class="currency">${transaction.currency}</span></td>
              <td>${isPaid ? 'учтена' : 'не учтена'}</td>
            </tr>
          `
        })
        .join('')

      return `
        <article class="source">
          <div class="source-title">
            <h3>${source}</h3>
            <span>${sourceTransactions.length} операций</span>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Статус</th>
                  <th>Сумма</th>
                  <th>Валюта</th>
                  <th>В итоге</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </article>
      `
    })
    .join('')
}

async function showFinanceData() {
  refreshButton.disabled = true
  statusElement.className = 'status'
  statusElement.textContent = 'Загрузка данных…'

  try {
    const { finance1, finance2 } = await loadFinanceData()
    const transactions = normalizeTransactions(finance1, finance2)
    const totals = calculateTotals(transactions)

    renderTotals(totals)
    renderTransactions(transactions)

    statusElement.className = 'status success'
    statusElement.textContent = `Загружено операций: ${transactions.length}`
  } catch (error) {
    statusElement.className = 'status error'
    statusElement.textContent = `Не удалось загрузить данные: ${error.message}`
    summaryElement.innerHTML = ''
    tablesElement.innerHTML = ''
  } finally {
    refreshButton.disabled = false
  }
}

refreshButton.addEventListener('click', showFinanceData)

showFinanceData()
