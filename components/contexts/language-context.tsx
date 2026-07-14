'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'EN' | 'BN'

interface LanguageContextType {
  lang: Lang
  setLang: (l: Lang) => void
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('EN')

  useEffect(() => {
    const saved = window.localStorage.getItem('origin-agro-lang')
    if (saved === 'EN' || saved === 'BN') {
      setLangState(saved)
    }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    window.localStorage.setItem('origin-agro-lang', l)
  }

  const toggleLang = () => {
    setLang(lang === 'EN' ? 'BN' : 'EN')
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
