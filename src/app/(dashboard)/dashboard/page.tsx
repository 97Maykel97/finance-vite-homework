import type { Metadata } from 'next'
import { DashboardScreen } from '@/features/dashboard/ui/DashboardScreen'

export const metadata: Metadata = { title: 'Обзор', description: 'Операции из финансовых источников, суммы и актуальные валютные курсы.' }

export default function DashboardPage() { return <DashboardScreen /> }
