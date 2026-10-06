'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './DashboardNavigation.module.scss'

const items = [{ href: '/dashboard', label: 'Обзор' }, { href: '/settings', label: 'Настройки' }]

export function DashboardNavigation() {
  const pathname = usePathname()
  return <nav className={styles.navigation} aria-label="Основная навигация">{items.map(({ href, label }) => { const isActive = pathname === href; return <Link className={`${styles.link} ${isActive ? styles.active : ''}`} href={href} key={href} aria-current={isActive ? 'page' : undefined}>{label}</Link> })}</nav>
}
