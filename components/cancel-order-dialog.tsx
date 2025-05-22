"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useOrder } from "@/contexts/order-context"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface CancelOrderDialogProps {
  orderId: string
  onSuccess?: () => void
}

export function CancelOrderDialog({ orderId, onSuccess }: CancelOrderDialogProps) {
  const { language } = useLanguage()
  const { refreshOrders } = useOrder()
  const { userId } = useAuth()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    if (!userId) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يجب تسجيل الدخول لإلغاء الطلب" : "You must be logged in to cancel an order",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ 
          status: "Cancelled",
          reason 
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel order")
      }

      toast({
        title: language === "ar" ? "تم إلغاء الطلب بنجاح" : "Order cancelled successfully",
        description: language === "ar" ? "تم إلغاء طلبك بنجاح" : "Your order has been cancelled successfully",
      })

      setOpen(false)
      setReason("")
      await refreshOrders()
      onSuccess?.()
    } catch (error) {
      console.error("Error cancelling order:", error)
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "حدث خطأ أثناء إلغاء الطلب" : "An error occurred while cancelling the order",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-1">
          {language === "ar" ? "إلغاء الطلب" : "Cancel Order"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {language === "ar" ? "تأكيد إلغاء الطلب" : "Confirm Order Cancellation"}
          </DialogTitle>
          <DialogDescription>
            {language === "ar"
              ? "هل أنت متأكد أنك تريد إلغاء هذا الطلب؟"
              : "Are you sure you want to cancel this order?"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder={language === "ar" ? "سبب الإلغاء (اختياري)" : "Cancellation reason (optional)"}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {language === "ar" ? "إغلاق" : "Close"}
          </Button>
          <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
            {isLoading
              ? language === "ar"
                ? "جاري الإلغاء..."
                : "Cancelling..."
              : language === "ar"
              ? "تأكيد الإلغاء"
              : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 