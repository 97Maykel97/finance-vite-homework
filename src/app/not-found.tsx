import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './PageState.module.scss'

export const metadata: Metadata = { title: 'Страница не найдена' }

export default function NotFound() {
  return <main className={styles.container}><p className={`${styles.status} ${styles.error}`}>Запрошенная страница не найдена.</p><Link className={styles.button} href="/dashboard">Вернуться к обзору</Link></main>
}
