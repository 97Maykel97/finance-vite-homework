import { NextResponse } from 'next/server'

const CURRENCY_PATTERN = /^[A-Z]{3}$/

export async function GET(_request, { params }) {
  const { from, to } = await params
  const base = from.toUpperCase()
  const quote = to.toUpperCase()
  if (!CURRENCY_PATTERN.test(base) || !CURRENCY_PATTERN.test(quote)) {
    return NextResponse.json({ error: 'Некорректная валюта' }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.frankfurter.dev/v2/rate/${base}/${quote}`, {
      next: { revalidate: 300 },
    })
    if (!response.ok) return NextResponse.json({ error: 'Сервис курсов временно недоступен' }, { status: 502 })
    return NextResponse.json(await response.json())
  } catch {
    return NextResponse.json({ error: 'Не удалось связаться с сервисом курсов' }, { status: 502 })
  }
}
