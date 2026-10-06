import Link from 'next/link'

export default function DashboardLayout({ children }) {
  return <>
    <nav className="navigation" aria-label="Основная навигация">
      <Link href="/dashboard">Обзор</Link>
      <Link href="/settings">Настройки</Link>
    </nav>
    {children}
  </>
}
