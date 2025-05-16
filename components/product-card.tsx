"use client"

import Image from "next/image"
import { Heart, ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type ProductCardProps = {
  id: string
  name: string
  price: number
  originalPrice?: number
  discountPercentage?: number
  image: string
}

export default function ProductCard({ id, name, price, originalPrice, discountPercentage, image }: ProductCardProps) {
  const { addItem } = useCart()
  const { t, language } = useLanguage()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem({ id, name, price, image })

    // Show toast notification
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>{language === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart"}</span>
        </div>
      ),
      description: name,
    })
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <Link href={`/shop/${id}`} className="block">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105 p-4"
          />
          {discountPercentage && (
            <div className="absolute left-3 top-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{discountPercentage}%
            </div>
          )}
          <button className="absolute right-3 top-3 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart className="h-4 w-4 text-[#112938]" />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/shop/${id}`} className="block">
          <h3 className="font-medium text-[#112938] mb-1">{name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-[#112938] font-bold" dir="ltr">
              {price.toFixed(2)} {language === "ar" ? "ج.م" : "EGP"}
            </p>
            {originalPrice && (
              <p className="text-gray-500 line-through text-sm" dir="ltr">
                {originalPrice.toFixed(2)} {language === "ar" ? "ج.م" : "EGP"}
              </p>
            )}
          </div>
        </Link>
        <Button
          className="mt-3 w-full py-2 bg-[#0CC0DF] hover:bg-[#0CC0DF]/90 text-white rounded"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {t("add_to_cart")}
        </Button>
      </div>
    </div>
  )
}
