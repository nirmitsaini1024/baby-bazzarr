"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart, type CartItem } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type CartItemProps = {
  item: CartItem
}

export default function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const { t, language } = useLanguage()

  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    } else {
      removeItem(item.id)
    }
  }

  const handleRemove = () => {
    removeItem(item.id)
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-200">
      <div className="flex items-center flex-1 mb-4 sm:mb-0">
        <div className="w-20 h-20 relative mr-4 flex-shrink-0">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded" />
        </div>
        <div>
          <Link href={`/shop/${item.id}`} className="font-medium text-[#112938] hover:text-[#0CC0DF]">
            {item.name}
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-4 sm:gap-8">
        <div className="text-[#112938] font-medium" dir="ltr">
          {item.price.toFixed(2)} {language === "ar" ? "ج.م" : "EGP"}
        </div>

        <div className="flex items-center border rounded">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={handleDecreaseQuantity}>
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-10 text-center">{item.quantity}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={handleIncreaseQuantity}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="text-[#112938] font-bold" dir="ltr">
          {(item.price * item.quantity).toFixed(2)} {language === "ar" ? "ج.م" : "EGP"}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={handleRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
