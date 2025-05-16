"use client"

import { Star, StarHalf } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

type CustomerReviewProps = {
  name: string
  rating: number
  date: string
  comment: string
  nameAr?: string
  commentAr?: string
}

export default function CustomerReview({ name, rating, date, comment, nameAr, commentAr }: CustomerReviewProps) {
  const { language } = useLanguage()

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-[#112938]">{language === "ar" && nameAr ? nameAr : name}</h4>
          <div className="flex items-center mt-1">
            {renderStars(rating)}
            <span className="ml-2 text-sm text-gray-500">{date}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 mt-2">{language === "ar" && commentAr ? commentAr : comment}</p>
    </div>
  )
}
