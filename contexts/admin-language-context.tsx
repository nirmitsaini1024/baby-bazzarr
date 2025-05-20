"use client"

import type React from "react"
import { createContext, useContext } from "react"

type AdminLanguageContextType = {
  language: "en"
  setLanguage: (lang: "en") => void
  t: (key: string) => string
  dir: "ltr"
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined)

export const AdminLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Translation function
  const t = (key: string): string => {
    return key // For admin, we'll just return the key since everything is in English
  }

  return (
    <AdminLanguageContext.Provider 
      value={{ 
        language: "en", 
        setLanguage: () => {}, // No-op since we always use English
        t, 
        dir: "ltr" 
      }}
    >
      {children}
    </AdminLanguageContext.Provider>
  )
}

export const useAdminLanguage = (): AdminLanguageContextType => {
  const context = useContext(AdminLanguageContext)
  if (context === undefined) {
    throw new Error("useAdminLanguage must be used within an AdminLanguageProvider")
  }
  return context
} 