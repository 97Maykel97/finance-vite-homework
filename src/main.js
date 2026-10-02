import './style.css'
import { loadFinanceData } from './api.js'
import { calculateTotals, formatMoney, normalizeTransactions } from './finance.js'
import { convertTotalsToUsd } from './rates.js'

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="container">
    <header class="header">
      <div>
        <h1>Финансовый обзор</h1>
        <p>Данные из двух источников, объединённые в одном отчёте.</p>
      </div>
      <button id="refresh" class="button" type="button">Обновить данные</button>
    </header>
    <p id="status" class="status" aria-live="polite">Загружаем данные…</p>
    <section id="summary" class="summary" aria-label="Итоги по валютам"></section>
    <section id="conversion" class="conversion" aria-live="polite"></section>
    <section aria-labelledby="operations-title">
      <h2 id="operations-title">Все операции</h2>
      <div id="tables"></div>
    </section>
  </main>
`

const statusElement = document.querySelector('#status')
const summaryElement = document.querySelector('#summary')
const conversionElement = document.querySelector('#conversion')
const tablesElement = document.querySelector('#tables')
const refreshButton = document.querySelector('#refresh')
const usdFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function renderTotals(totals) {
  const entries = Object.entries(totals)
  summaryElement.innerHTML = entries.length
    ? entries.map(([currency, amount]) => `
        <article class="card">
          <span>Итого в ${escapeHtml(currency)}</span>
          <strong>${escapeHtml(formatMoney(amount, currency))}</strong>
          <small>Только оплаченные операции</small>
        </article>`).join('')
    : '<p class="empty-state">Нет оплаченных операций для подсчёта.</p>'
}

function renderConversionLoading() {
  conversionElement.innerHTML = '<p class="rate-status">Получаем актуальные курсы и считаем общий итог в USD…</p>'
}

function renderConversion({ total, rates }) {
  const datedRates = rates.filter(({ date }) => date)
  const dates = [...new Set(datedRates.map(({ date }) => date))]
  const dateLabel = dates.length === 1 ? `Курсы на ${dates[0]}` : 'Курсы получены на разные даты'
  const ratesList = rates.map(({ currency, rate }) => `
    <li>1 ${escapeHtml(currency)} = ${escapeHtml(rate)} USD</li>`).join('')

  conversionElement.innerHTML = `
    <article class="conversion-card">
      <div>
        <span class="eyebrow">Общий итог</span>
        <strong>${usdFormatter.format(total)}</strong>
        <p>${escapeHtml(dateLabel)} · источник курсов: Frankfurter</p>
      </div>
      <details>
        <summary>Использованные курсы</summary>
        <ul class="rates-list">${ratesList}</ul>
      </details>
    </article>`
}

function renderConversionError(error) {
  conversionElement.innerHTML = `
    <p class="rate-status error">Сумма в USD не рассчитана: ${escapeHtml(error.message)}. Итоги по валютам выше доступны без конвертации.</p>`
}

function renderTransactions(transactions) {
  const sources = [...new Set(transactions.map(({ source }) => source))]
  tablesElement.innerHTML = sources.map((source) => {
    const sourceTransactions = transactions.filter((transaction) => transaction.source === source)
    const rows = sourceTransactions.map((transaction) => {
      const isPaid = transaction.status === 'paid'
      return `
        <tr class="${isPaid ? '' : 'excluded'}">
          <td>${escapeHtml(transaction.status)}</td>
          <td>${escapeHtml(formatMoney(transaction.amount, transaction.currency))}</td>
          <td><span class="currency">${escapeHtml(transaction.currency)}</span></td>
          <td>${isPaid ? 'Учтена в итоге' : 'Не учтена в итоге'}</td>
        </tr>`
    }).join('')
    return `
      <article class="source">
        <div class="source-title">
          <h3>${escapeHtml(source)}</h3>
          <span>${sourceTransactions.length} операций</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Статус</th><th>Сумма</th><th>Валюта</th><th>В итоге</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </article>`
  }).join('')
}

async function showFinanceData() {
  refreshButton.disabled = true
  statusElement.className = 'status'
  statusElement.textContent = 'Загружаем данные…'

  try {
    const { finance1, finance2 } = await loadFinanceData()
    const transactions = normalizeTransactions(finance1, finance2)
    const totals = calculateTotals(transactions)
    renderTotals(totals)
    renderTransactions(transactions)
    statusElement.className = 'status success'
    statusElement.textContent = `Загружено операций: ${transactions.length}`

    renderConversionLoading()
    try {
      renderConversion(await convertTotalsToUsd(totals))
    } catch (error) {
      renderConversionError(error)
    }
  } catch (error) {
    statusElement.className = 'status error'
    statusElement.textContent = `Не удалось загрузить данные: ${error.message}`
    summaryElement.innerHTML = ''
    conversionElement.innerHTML = ''
    tablesElement.innerHTML = ''
  } finally {
    refreshButton.disabled = false
  }
}

refreshButton.addEventListener('click', showFinanceData)
showFinanceData()
