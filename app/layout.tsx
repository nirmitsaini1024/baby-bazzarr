import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { LanguageProvider } from "@/contexts/language-context"
import { CartProvider } from "@/contexts/cart-context"
import { OrderProvider } from "@/contexts/order-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Baby Bazaar",
  description: "Premium baby essentials for happy families",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <LanguageProvider>
              <OrderProvider>
                <CartProvider>
                  {children}
                  <Toaster />
                </CartProvider>
              </OrderProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
