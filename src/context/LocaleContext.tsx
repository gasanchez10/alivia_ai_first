import { createContext, useContext, useState, type ReactNode } from 'react'
import { defaultLocale, type Locale } from '@/lib/i18n'

const LocaleContext = createContext<{
  locale: Locale
  setLocale: (l: Locale) => void
}>({ locale: defaultLocale, setLocale: () => {} })

export function LocaleProvider({
  children,
  initial = defaultLocale,
}: {
  children: ReactNode
  initial?: Locale
}) {
  const [locale, setLocale] = useState<Locale>(initial)
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
