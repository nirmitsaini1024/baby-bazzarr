"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CartButton() {
  const { totalItems } = useCart()
  const { t } = useLanguage()

  return (
    <Button variant="ghost" size="sm" asChild className="text-white">
      <Link href="/cart" className="flex items-center gap-1 relative">
        <ShoppingCart className="h-5 w-5" />
        <span className="hidden md:inline">
          {t("cart")} ({totalItems})
        </span>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#0CC0DF] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center md:hidden">
            {totalItems}
          </span>
        )}
      </Link>
    </Button>
  )
}
