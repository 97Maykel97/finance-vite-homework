import type { ConversionState } from '@/shared/types/finance'
import styles from './ConversionCard.module.scss'

interface Props { conversion: ConversionState; targetCurrency: string }

export function ConversionCard({ conversion, targetCurrency }: Props) {
  if (conversion.status === 'idle') return null
  if (conversion.status === 'loading') return <section className={styles.conversion}><p className={styles.rateStatus}>Получаем актуальные курсы…</p></section>
  if (conversion.status === 'error') return <section className={styles.conversion}><p className={`${styles.rateStatus} ${styles.error}`}>Сумма в {targetCurrency} не рассчитана: {conversion.error}. Итоги по валютам доступны выше.</p></section>
  const formatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: targetCurrency, maximumFractionDigits: 2 })
  const dates = [...new Set(conversion.rates.map(({ date }) => date).filter(Boolean))]
  const dateLabel = dates.length === 1 ? `Курсы на ${dates[0]}` : 'Курсы получены на разные даты'
  return <section className={styles.conversion}><article className={styles.card}><div><span className={styles.eyebrow}>Общий итог в {targetCurrency}</span><strong>{formatter.format(conversion.total)}</strong><p>{dateLabel} · источник: Frankfurter</p></div><details className={styles.details}><summary>Использованные курсы</summary><ul className={styles.ratesList}>{conversion.rates.map(({ currency, rate }) => <li key={currency}>1 {currency} = {rate} {targetCurrency}</li>)}</ul></details></article></section>
}
