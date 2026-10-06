'use client'

import { useState } from 'react'
import { useReportSettings } from '../model/ReportSettingsContext.jsx'

const TARGET_CURRENCIES = ['USD', 'EUR', 'ILS']

export function SettingsScreen() {
  const { targetCurrency, setTargetCurrency } = useReportSettings()
  const [value, setValue] = useState(targetCurrency)
  const [saved, setSaved] = useState(false)
  function submit(event) { event.preventDefault(); setTargetCurrency(value); setSaved(true) }

  return <main className="container settings-page">
    <h1>Настройки отчёта</h1><p className="page-description">Выберите валюту, в которой будет рассчитан общий итог.</p>
    <form className="settings-form" onSubmit={submit}>
      <label htmlFor="target-currency">Целевая валюта</label>
      <select id="target-currency" value={value} onChange={(event) => { setValue(event.target.value); setSaved(false) }}>{TARGET_CURRENCIES.map((currency) => <option key={currency} value={currency}>{currency}</option>)}</select>
      <button className="button" type="submit">Сохранить</button>
      {saved && <p className="form-success" role="status">Настройка сохранена. Отчёт будет пересчитан.</p>}
    </form>
  </main>
}
