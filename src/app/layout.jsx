import '../style.css'
import { Providers } from './providers.jsx'

export const metadata = {
  title: { default: 'Финансовый обзор', template: '%s | Финансовый обзор' },
  description: 'Финансовый обзор операций и актуальных валютных курсов.',
}

export default function RootLayout({ children }) {
  return <html lang="ru"><body><Providers>{children}</Providers></body></html>
}
