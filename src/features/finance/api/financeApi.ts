interface FinanceData {
  finance1: unknown
  finance2: unknown
}

async function request(source: 'finance1' | 'finance2', signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(`/api/finance/${source}`, { signal })
  if (!response.ok) {
    const payload: { error?: string } = await response.json().catch(() => ({}))
    throw new Error(payload.error ?? `Сервер вернул статус ${response.status}`)
  }
  return response.json()
}

export async function loadFinanceData(signal?: AbortSignal): Promise<FinanceData> {
  const [finance1, finance2] = await Promise.all([request('finance1', signal), request('finance2', signal)])
  return { finance1, finance2 }
}
