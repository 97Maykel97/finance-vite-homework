import styles from '../PageState.module.scss'

export default function Loading() {
  return <main className={styles.container}><p className={styles.status}>Открываем страницу…</p></main>
}
