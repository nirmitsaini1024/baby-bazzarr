"use client"

import { useEffect, useState } from "react"
import { Star, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

interface Review {
  _id: string
  userId: string
  productId: string
  rating: number
  comment: string
  createdAt: string
  userName?: string
  userImage?: string
}

interface ReviewListProps {
  productId: string
}

export default function ReviewList({ productId }: ReviewListProps) {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Add timestamp to bust cache
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/reviews?productId=${productId}&t=${timestamp}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        })

        if (!response.ok) {
          // For debugging only
          console.error('Response status:', response.status)
          
          let errorMessage = language === "ar" ? "فشل في تحميل التقييمات" : "Failed to fetch reviews"
          try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
          } catch (e) {
            console.error('Error parsing error response:', e)
          }
          
          throw new Error(errorMessage)
        }

        const data = await response.json()
        setReviews(data)
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError(language === "ar" ? "فشل في تحميل التقييمات" : "Failed to load reviews")
        
        toast({
          variant: "destructive",
          title: language === "ar" ? "خطأ" : "Error",
          description: language === "ar" ? "فشل في تحميل التقييمات. يرجى تحديث الصفحة." : "Failed to load reviews. Please refresh the page.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()

    // Add event listener for review submission
    const handleReviewSubmitted = () => {
      fetchReviews()
    }

    window.addEventListener('reviewSubmitted', handleReviewSubmitted)

    // Cleanup
    return () => {
      window.removeEventListener('reviewSubmitted', handleReviewSubmitted)
    }
  }, [productId, language, toast])

  if (loading) {
    return (
      <div className="text-center py-4">
        {language === "ar" ? "جار التحميل..." : "Loading reviews..."}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        {language === "ar" ? "لا توجد تقييمات بعد" : "No reviews yet"}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="border rounded-lg p-4">
          <div className="flex items-center gap-4 mb-2">
            {/* User profile section */}
            <div className="flex items-center gap-2">
              {review.userImage ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image 
                    src={review.userImage} 
                    alt={review.userName || 'User'} 
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <span className="font-medium text-sm">
                {review.userName || (language === "ar" ? "مستخدم مجهول" : "Anonymous")}
              </span>
            </div>
            
            <div className="flex items-center ml-auto">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          
          <p className="text-gray-700 mb-2">{review.comment}</p>
          
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  )
}
