'use client'

import { useState, type FormEvent } from 'react'
import { useReportSettings } from '@/features/settings/model/ReportSettingsContext'
import styles from './SettingsScreen.module.scss'

const TARGET_CURRENCIES = ['USD', 'EUR', 'ILS']

export function SettingsScreen() {
  const { targetCurrency, setTargetCurrency } = useReportSettings()
  const [value, setValue] = useState(targetCurrency)
  const [saved, setSaved] = useState(false)
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setTargetCurrency(value); setSaved(true) }
  return <main className={styles.container}><h1>Настройки отчёта</h1><p className={styles.description}>Выберите валюту, в которой будет рассчитан общий итог.</p><form className={styles.form} onSubmit={submit}><label className={styles.label} htmlFor="target-currency">Целевая валюта</label><select className={styles.select} id="target-currency" value={value} onChange={(event) => { setValue(event.target.value); setSaved(false) }}>{TARGET_CURRENCIES.map((currency) => <option key={currency} value={currency}>{currency}</option>)}</select><button className={styles.button} type="submit">Сохранить</button>{saved && <p className={styles.success} role="status">Настройка сохранена. Отчёт будет пересчитан.</p>}</form></main>
}
