async function request(source, signal) {
  const response = await fetch(`/api/finance/${source}`, { signal })
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error ?? `Сервер вернул статус ${response.status}`)
  }
  return response.json()
}

export async function loadFinanceData(signal) {
  const [finance1, finance2] = await Promise.all([request('finance1', signal), request('finance2', signal)])
  return { finance1, finance2 }
}
