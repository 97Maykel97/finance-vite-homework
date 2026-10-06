'use client'

import { createContext, useContext, useMemo, useState } from 'react'

const ReportSettingsContext = createContext(null)

export function ReportSettingsProvider({ children }) {
  const [targetCurrency, setTargetCurrency] = useState('USD')
  const value = useMemo(() => ({ targetCurrency, setTargetCurrency }), [targetCurrency])
  return <ReportSettingsContext.Provider value={value}>{children}</ReportSettingsContext.Provider>
}

export function useReportSettings() {
  const context = useContext(ReportSettingsContext)
  if (!context) throw new Error('Настройки отчёта недоступны')
  return context
}
