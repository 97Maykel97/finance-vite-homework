import { NextResponse } from 'next/server'

const URLS = {
  finance1: 'https://cpa-server-vtel.onrender.com/api/finance1',
  finance2: 'https://cpa-server-vtel.onrender.com/api/finance2',
}

export async function GET(_request, { params }) {
  const { source } = await params
  const url = URLS[source]
  if (!url) return NextResponse.json({ error: 'Неизвестный источник' }, { status: 404 })
  if (!process.env.FINANCE_API_KEY) return NextResponse.json({ error: 'Финансовый API не настроен' }, { status: 500 })

  try {
    const response = await fetch(url, {
      headers: { 'x-api-key': process.env.FINANCE_API_KEY },
      cache: 'no-store',
    })
    if (!response.ok) return NextResponse.json({ error: 'Финансовый сервис временно недоступен' }, { status: 502 })
    return NextResponse.json(await response.json())
  } catch {
    return NextResponse.json({ error: 'Не удалось связаться с финансовым сервисом' }, { status: 502 })
  }
}
