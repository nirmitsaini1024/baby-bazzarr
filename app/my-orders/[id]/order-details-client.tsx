"use client"

import Image from "next/image"
import Link from "next/link"
import { Menu, Search, User, Heart, ArrowLeft, Truck, MessageCircle, ExternalLink } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useOrder } from "@/contexts/order-context"
import LanguageSwitcher from "@/components/language-switcher"
import CartButton from "@/components/cart-button"
import { Button } from "@/components/ui/button"
import { openWhatsAppTracking } from "@/utils/whatsapp"
import { useEffect, useState } from "react"
import { CancelOrderDialog } from "@/components/cancel-order-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, MapPin } from "lucide-react"

// Define types for the order and order items
interface OrderItem {
  id: string
  name: string
  image?: string
  quantity: number
  price: number
}

interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  postalCode: string
}

interface Order {
  orderId: string
  date: string
  expectedDelivery: string
  status: string
  statusAr?: string
  total: number
  items: OrderItem[]
  shippingAddress: ShippingAddress
}

// Client component that receives the resolved orderId
export default function OrderDetailsClient({ orderId }: { orderId: string }) {
  const { t, language, dir } = useLanguage()
  const { getOrderById, refreshOrders } = useOrder()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch the order when the component mounts
  useEffect(() => {
    async function fetchOrder() {
      try {
        console.log("Fetching order with ID:", orderId);
        // Get the order by ID
        const orderData = await getOrderById(orderId)
        console.log("Received order data:", orderData);
        // Handle the possibility of undefined by setting to null
        setOrder(orderData || null)
      } catch (error) {
        console.error("Error fetching order:", error)
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, getOrderById])

  // If loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#112938] mb-4">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </h1>
        </div>
      </div>
    )
  }

  // If order not found, show error
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#112938] mb-4">
            {language === "ar" ? "الطلب غير موجود" : "Order Not Found"}
          </h1>
          <Button asChild className="bg-[#0CC0DF] hover:bg-[#0CC0DF]/90 text-white">
            <Link href="/my-orders">{language === "ar" ? "العودة إلى طلباتي" : "Back to My Orders"}</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Handle tracking via WhatsApp
  const handleTrackOrder = () => {
    openWhatsAppTracking(order.orderId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-amber-100 text-amber-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#112938] text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/baby-bazaar-logo.svg"
                alt="Baby Bazaar Logo"
                width={200}
                height={50}
                className="h-14 w-auto"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/shop" className="py-2 hover:text-[#0CC0DF]">
                {t("shop")}
              </Link>
              <Link href="/my-orders" className="py-2 text-[#0CC0DF]">
                {language === "ar" ? "طلباتي" : "My Orders"}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button className="hidden md:flex items-center gap-1 hover:text-[#0CC0DF]">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/my-orders" className="hidden md:flex items-center gap-1 text-[#0CC0DF]">
              <User className="h-5 w-5" />
            </Link>
            <button className="hidden md:flex items-center gap-1 hover:text-[#0CC0DF]">
              <Heart className="h-5 w-5" />
            </button>
            <CartButton />
            <button className="md:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-4">
              <Link href="/my-orders" className="text-[#0CC0DF] flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {language === "ar" ? "العودة إلى طلباتي" : "Back to My Orders"}
              </Link>
            </div>
          </div>
        </section>

        {/* Order Details */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid gap-6">
              {/* Order Summary */}
              <Card className="shadow-md border-t-4 border-purple-500">
                <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Package className="h-5 w-5" />
                    {language === "ar" ? "ملخص الطلب" : "Order Summary"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-[#112938]">{order.orderId}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {language === "ar" ? order.statusAr : order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {language === "ar" ? "تاريخ الطلب:" : "Order Date:"} {order.date}
                        </p>
                      </div>
                      {order.status !== "Cancelled" && (
                        <div className="mt-2 sm:mt-0">
                          <p className="text-sm text-gray-500">
                            {language === "ar" ? "التوصيل المتوقع:" : "Expected Delivery:"} {order.expectedDelivery}
                          </p>
                          <p className="font-bold text-[#112938] mt-1" dir="ltr">
                            {language === "ar" ? "الإجمالي:" : "Total:"} {order.total.toFixed(2)}{" "}
                            {language === "ar" ? "ج.م" : "EGP"}
                          </p>
                        </div>
                      )}
                      {order.status === "Cancelled" && (
                        <div className="mt-2 sm:mt-0">
                          <p className="font-bold text-[#112938]" dir="ltr">
                            {language === "ar" ? "الإجمالي:" : "Total:"} {order.total.toFixed(2)}{" "}
                            {language === "ar" ? "ج.م" : "EGP"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {order.status !== "Cancelled" && order.status !== "Delivered" && (
                        <>
                          <Button
                            asChild
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Link href={`/track-order/${order.orderId}`}>
                              <Truck className="h-4 w-4 mr-2" />
                              {language === "ar" ? "تتبع الطلب" : "Track Order"}
                            </Link>
                          </Button>
                          <CancelOrderDialog orderId={order.orderId} onSuccess={refreshOrders} />
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="shadow-md">
                <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Package className="h-5 w-5" />
                    {language === "ar" ? "المنتجات" : "Order Items"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-[#112938]">{item.name}</h4>
                          <p className="text-sm text-gray-500">
                            {language === "ar" ? "الكمية:" : "Quantity:"} {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            {language === "ar" ? "السعر:" : "Price:"} {item.price.toFixed(2)}{" "}
                            {language === "ar" ? "ج.م" : "EGP"}
                          </p>
                          <p className="font-medium text-purple-700">
                            {language === "ar" ? "المجموع:" : "Subtotal:"} {(item.price * item.quantity).toFixed(2)}{" "}
                            {language === "ar" ? "ج.م" : "EGP"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="shadow-md">
                <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <MapPin className="h-5 w-5" />
                    {language === "ar" ? "عنوان التوصيل" : "Shipping Address"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p className="text-gray-600">{order.shippingAddress.address}</p>
                    <p className="text-gray-600">{order.shippingAddress.postalCode}</p>
                    <p className="text-gray-600">{order.shippingAddress.phone}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#112938] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-6">
                <div className="bg-white/10 inline-block p-3 rounded-lg">
                  <Image
                    src="/images/baby-bazaar-logo.svg"
                    alt="Baby Bazaar Logo"
                    width={220}
                    height={55}
                    className="h-16 w-auto"
                  />
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                {language === "ar"
                  ? "مستلزمات أطفال متميزة للعائلات السعيدة."
                  : "Premium baby essentials for happy families."}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-[#0CC0DF]">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="hover:text-[#0CC0DF]">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="hover:text-[#0CC0DF]">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t("shop")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/shop" className="text-gray-300 hover:text-[#0CC0DF]">
                    {t("new_arrivals_footer")}
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-gray-300 hover:text-[#0CC0DF]">
                    {t("best_sellers")}
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-gray-300 hover:text-[#0CC0DF]">
                    {t("sale_footer")}
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-gray-300 hover:text-[#0CC0DF]">
                    {t("gift_cards")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t("help")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-[#0CC0DF]">
                    {t("customer_service")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-[#0CC0DF]">
                    {t("track_order")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-[#0CC0DF]">
                    {t("returns")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-[#0CC0DF]">
                    {t("shipping")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t("about")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-[#0CC0DF]">
                    {t("our_story")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-[#0CC0DF]">
                    {t("sustainability")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-[#0CC0DF]">
                    {t("careers")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-[#0CC0DF]">
                    {t("contact_us")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Baby Bazaar. {t("rights_reserved")}
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-gray-400 hover:text-[#0CC0DF]">
                {t("privacy_policy")}
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-[#0CC0DF]">
                {t("terms_of_service")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 