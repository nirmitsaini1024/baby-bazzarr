"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Star } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ReviewFormProps {
  productId: string
  onReviewSubmitted: () => void
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { user, isLoaded } = useUser()
  const { language } = useLanguage()
  const { toast } = useToast()
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يجب تسجيل الدخول لإضافة تقييم" : "You must be logged in to submit a review",
      })
      return
    }

    if (rating === 0) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "الرجاء اختيار تقييم" : "Please select a rating",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "الرجاء إضافة تعليق" : "Please add a comment",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      toast({
        variant: "success",
        title: language === "ar" ? "تم إضافة التقييم" : "Review Submitted",
        description: language === "ar" ? "شكراً لتقييمك" : "Thank you for your review",
      })

      setRating(0)
      setComment("")
      onReviewSubmitted()
    } catch (error) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: error instanceof Error ? error.message : "Failed to submit review",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Don't show loading state, just return null if not loaded
  if (!isLoaded) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === "ar" ? "التقييم" : "Rating"}
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  value <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          {language === "ar" ? "التعليق" : "Comment"}
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={language === "ar" ? "اكتب تعليقك هنا..." : "Write your review here..."}
          className="min-h-[100px]"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#0CC0DF] hover:bg-[#0CC0DF]/90 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? language === "ar"
            ? "جاري الإرسال..."
            : "Submitting..."
          : language === "ar"
          ? "إرسال التقييم"
          : "Submit Review"}
      </Button>
    </form>
  )
} 