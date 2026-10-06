import type { ReactNode } from 'react'
import { DashboardNavigation } from './DashboardNavigation'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <><DashboardNavigation />{children}</>
}
