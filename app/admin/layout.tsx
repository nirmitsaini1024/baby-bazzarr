"use client"

import { AdminLanguageProvider } from "@/contexts/admin-language-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLanguageProvider>
      {children}
    </AdminLanguageProvider>
  )
} 