import type { Metadata } from 'next'
import { SettingsScreen } from '@/features/settings/ui/SettingsScreen'

export const metadata: Metadata = { title: 'Настройки отчёта', description: 'Настройка целевой валюты финансового отчёта.' }

export default function SettingsPage() { return <SettingsScreen /> }
