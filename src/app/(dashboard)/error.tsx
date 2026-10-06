'use client'

import styles from '../PageState.module.scss'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className={styles.container}><p className={`${styles.status} ${styles.error}`}>Не удалось открыть страницу.</p><button className={styles.button} type="button" onClick={reset}>Повторить</button></main>
}
