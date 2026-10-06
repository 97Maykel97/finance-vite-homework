'use client'

export default function Error({ reset }) {
  return <main className="container"><p className="status error">Не удалось открыть страницу.</p><button className="button" type="button" onClick={reset}>Повторить</button></main>
}
