const API_KEY = import.meta.env.VITE_FINANCE_API_KEY

const URLS = {
  finance1: 'https://cpa-server-vtel.onrender.com/api/finance1',
  finance2: 'https://cpa-server-vtel.onrender.com/api/finance2',
}

async function request(name, url) {
  const response = await fetch(url, { headers: { 'x-api-key': API_KEY } })
  if (!response.ok) {
    throw new Error(`${name}: сервер вернул статус ${response.status}`)
  }

  try {
    return await response.json()
  } catch {
    throw new Error(`${name}: сервер вернул некорректный JSON`)
  }
}

export async function loadFinanceData() {
  if (!API_KEY) {
    throw new Error(
      'Не задан ключ API. Добавьте VITE_FINANCE_API_KEY в локальный файл .env.local',
    )
  }

  const [finance1, finance2] = await Promise.all([
    request('Источник 1', URLS.finance1),
    request('Источник 2', URLS.finance2),
  ])
  return { finance1, finance2 }
}
