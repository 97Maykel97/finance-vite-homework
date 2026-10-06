import type { Metadata } from 'next'
import './globals.scss'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: { default: 'Финансовый обзор', template: '%s | Финансовый обзор' },
  description: 'Финансовый обзор операций и актуальных валютных курсов.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body><Providers>{children}</Providers></body></html>
}
