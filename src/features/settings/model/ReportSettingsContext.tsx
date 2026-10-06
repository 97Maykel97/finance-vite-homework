'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface ReportSettingsContextValue {
  targetCurrency: string
  setTargetCurrency: (currency: string) => void
}

const ReportSettingsContext = createContext<ReportSettingsContextValue | null>(null)

export function ReportSettingsProvider({ children }: { children: ReactNode }) {
  const [targetCurrency, setTargetCurrency] = useState('USD')
  const value = useMemo(() => ({ targetCurrency, setTargetCurrency }), [targetCurrency])
  return <ReportSettingsContext.Provider value={value}>{children}</ReportSettingsContext.Provider>
}

export function useReportSettings(): ReportSettingsContextValue {
  const context = useContext(ReportSettingsContext)
  if (!context) throw new Error('Настройки отчёта недоступны')
  return context
}
