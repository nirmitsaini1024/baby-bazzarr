"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, Search, User, Heart, ShoppingCart, Star, StarHalf, Check, Truck, RotateCcw } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import LanguageSwitcher from "@/components/language-switcher"
import CartButton from "@/components/cart-button"
import { Button } from "@/components/ui/button"
import { products } from "@/data/products"
import CustomerReview from "@/components/customer-review"
import ProductImageGallery from "@/components/product-image-gallery"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { t, language, dir } = useLanguage()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [selectedColor, setSelectedColor] = useState<string>("blue")

  // Find the product by ID
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#112938] mb-4">
            {language === "ar" ? "المنتج غير موجود" : "Product Not Found"}
          </h1>
          <Button asChild className="bg-[#0CC0DF] hover:bg-[#0CC0DF]/90 text-white">
            <Link href="/shop">{language === "ar" ? "العودة إلى المتجر" : "Back to Shop"}</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Product images (use additional images if available)
  const productImages = product.additionalImages
    ? [product.image, ...product.additionalImages]
    : [product.image, "/placeholder-g8caw.png", "/placeholder-u88hx.png", "/placeholder-b2s0z.png"]

  // Available colors (use product colors if available)
  const availableColors = product.colors || [
    { id: "blue", name: "Blue", nameAr: "أزرق", hex: "#1E90FF" },
    { id: "pink", name: "Pink", nameAr: "وردي", hex: "#FF69B4" },
    { id: "green", name: "Green", nameAr: "أخضر", hex: "#32CD32" },
  ]

  // Product specifications (use product specifications if available)
  const specifications = product.specifications || [
    {
      name: "Material",
      nameAr: "المادة",
      value: "Premium cotton and polyester",
      valueAr: "قطن وبوليستر ممتاز",
    },
    {
      name: "Age Range",
      nameAr: "الفئة العمرية",
      value: "0-12 months",
      valueAr: "0-12 شهر",
    },
    {
      name: "Dimensions",
      nameAr: "الأبعاد",
      value: "60 x 40 x 30 cm",
      valueAr: "60 × 40 × 30 سم",
    },
    {
      name: "Weight",
      nameAr: "الوزن",
      value: "2.5 kg",
      valueAr: "2.5 كجم",
    },
  ]

  // Customer reviews (mock data)
  const customerReviews = [
    {
      name: "Sarah Johnson",
      nameAr: "سارة جونسون",
      rating: 5,
      date: "2023-05-15",
      comment: "The quality is excellent. My baby loves it!",
      commentAr: "الجودة ممتازة. طفلي يحبها!",
    },
    {
      name: "Ahmed Hassan",
      nameAr: "أحمد حسن",
      rating: 4.5,
      date: "2023-06-02",
      comment: "Good product, sturdy and safe. Assembly was easy.",
      commentAr: "منتج جيد، متين وآمن. كان التجميع سهلاً.",
    },
  ]

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: language === "ar" ? product.nameAr : product.name,
      price: product.price,
      image: product.image,
    })

    // Show toast notification
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>{language === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart"}</span>
        </div>
      ),
      description: language === "ar" ? product.nameAr : product.name,
    })
  }

  // Render stars for rating
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-5 w-5 fill-yellow-400 text-yellow-400" />)
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-5 w-5 text-gray-300" />)
    }

    return stars
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
              <Link href="/my-orders" className="py-2 hover:text-[#0CC0DF]">
                {language === "ar" ? "طلباتي" : "My Orders"}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button className="hidden md:flex items-center gap-1 hover:text-[#0CC0DF]">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/my-orders" className="hidden md:flex items-center gap-1 hover:text-[#0CC0DF]">
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
        {/* Breadcrumb */}
        <div className="bg-gray-100 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-[#0CC0DF]">
                {language === "ar" ? "الرئيسية" : "Home"}
              </Link>
              <span className="mx-2">/</span>
              <Link href="/shop" className="hover:text-[#0CC0DF]">
                {language === "ar" ? "المتجر" : "Shop"}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{language === "ar" ? product.nameAr : product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Product Images */}
              <div className="w-full lg:w-1/2">
                <ProductImageGallery 
                  images={productImages} 
                  productName={language === "ar" ? product.nameAr : product.name} 
                />
              </div>

              {/* Product Info */}
              <div className="w-full lg:w-1/2">
                <h1 className="text-3xl font-bold text-[#112938] mb-2">
                  {language === "ar" ? product.nameAr : product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex">{renderStars(4.5)}</div>
                  <span className="ml-2 text-gray-600 text-sm">(24 {language === "ar" ? "تقييم" : "reviews"})</span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#112938]" dir="ltr">
                      {product.price.toFixed(2)} {language === "ar" ? "ج.م" : "EGP"}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through" dir="ltr">
                        {product.originalPrice.toFixed(2)} {language === "ar" ? "ج.م" : "EGP"}
                      </span>
                    )}
                    {product.discountPercentage && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-medium">
                        {language === "ar"
                          ? `خصم ${product.discountPercentage}%`
                          : `${product.discountPercentage}% OFF`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-[#112938] mb-2">
                    {language === "ar" ? "الوصف" : "Description"}
                  </h2>
                  <p className="text-gray-700">{language === "ar" ? product.descriptionAr : product.description}</p>
                </div>

                {/* Features */}
                {product.features && (
                  <div className="mb-6">
                    <h2 className="text-lg font-medium text-[#112938] mb-2">
                      {language === "ar" ? "المميزات" : "Features"}
                    </h2>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {(language === "ar" ? product.featuresAr : product.features).map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Colors */}
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-[#112938] mb-2">
                    {language === "ar" ? "الألوان المتاحة" : "Available Colors"}
                  </h2>
                  <div className="flex gap-3">
                    {availableColors.map((color) => (
                      <button
                        key={color.id}
                        className={`w-10 h-10 rounded-full border-2 ${selectedColor === color.id ? "border-[#0CC0DF]" : "border-transparent"}`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setSelectedColor(color.id)}
                        aria-label={language === "ar" ? color.nameAr : color.name}
                        title={language === "ar" ? color.nameAr : color.name}
                      >
                        {selectedColor === color.id && <Check className="h-5 w-5 text-white mx-auto" />}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {language === "ar" ? "اللون المحدد:" : "Selected color:"}{" "}
                    {language === "ar"
                      ? availableColors.find((c) => c.id === selectedColor)?.nameAr
                      : availableColors.find((c) => c.id === selectedColor)?.name}
                  </p>
                </div>

                {/* Add to Cart */}
                <div className="mb-8">
                  <Button
                    className="w-full py-6 bg-[#0CC0DF] hover:bg-[#0CC0DF]/90 text-white text-lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {language === "ar" ? "أضف إلى السلة" : "Add to Cart"}
                  </Button>
                </div>

                {/* Shipping & Returns */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-start mb-3">
                    <Truck className="h-5 w-5 text-[#0CC0DF] mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <h3 className="font-medium text-[#112938]">{language === "ar" ? "الشحن" : "Shipping"}</h3>
                      <p className="text-sm text-gray-600">
                        {language === "ar"
                          ? "شحن سريع في جميع أنحاء مصر. يستغرق 2-5 أيام عمل."
                          : "Fast shipping across Egypt. Takes 2-5 business days."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <RotateCcw className="h-5 w-5 text-[#0CC0DF] mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <h3 className="font-medium text-[#112938]">
                        {language === "ar" ? "سياسة الإرجاع" : "Return Policy"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === "ar"
                          ? "إرجاع مجاني خلال 14 يومًا من الاستلام."
                          : "Free returns within 14 days of receipt."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-[#112938] mb-2">
                    {language === "ar" ? "المواصفات" : "Specifications"}
                  </h2>
                  <div className="border rounded-lg overflow-hidden">
                    {specifications.map((spec, index) => (
                      <div key={index} className={`flex ${index !== specifications.length - 1 ? "border-b" : ""}`}>
                        <div className="w-1/3 bg-gray-50 p-3 font-medium text-[#112938]">
                          {language === "ar" ? spec.nameAr : spec.name}
                        </div>
                        <div className="w-2/3 p-3 text-gray-700">{language === "ar" ? spec.valueAr : spec.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features Highlight */}
            {product.id === "p1" && (
              <div className="mb-8 mt-8">
                <h2 className="text-xl font-bold text-[#112938] mb-4">
                  {language === "ar" ? "المميزات الرئيسية" : "Key Features"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-[#0CC0DF] rounded-full flex items-center justify-center text-white font-bold mr-2">
                        1
                      </div>
                      <h3 className="font-medium">
                        {language === "ar" ? "5 زوايا مثالية" : "5 Perfect Angles"}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {language === "ar"
                        ? "حركة جانبية بخمس زوايا مختلفة لراحة طفلك"
                        : "Side-to-side movement with 5 different angles for your baby's comfort"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-[#0CC0DF] rounded-full flex items-center justify-center text-white font-bold mr-2">
                        2
                      </div>
                      <h3 className="font-medium">
                        {language === "ar" ? "3 إعدادات للمؤقت" : "3 Timer Settings"}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {language === "ar"
                        ? "اختر بين 15 أو 30 أو 45 دقيقة لتهدئة طفلك"
                        : "Choose between 15, 30, or 45 minutes to soothe your baby"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-[#0CC0DF] rounded-full flex items-center justify-center text-white font-bold mr-2">
                        3
                      </div>
                      <h3 className="font-medium">
                        {language === "ar" ? "ناموسية واقية" : "Protective Mosquito Net"}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {language === "ar"
                        ? "تحمي طفلك من الحشرات مع الحفاظ على التهوية"
                        : "Protects your baby from insects while maintaining ventilation"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-[#0CC0DF] rounded-full flex items-center justify-center text-white font-bold mr-2">
                        4
                      </div>
                      <h3 className="font-medium">
                        {language === "ar" ? "تحكم عن بعد" : "Remote Control"}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {language === "ar"
                        ? "تحكم في جميع الوظائف بسهولة من مسافة بعيدة"
                        : "Control all functions easily from a distance"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {product.id === "p1" && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#112938] mb-4">
                  {language === "ar" ? "المواصفات التقنية" : "Technical Specifications"}
                </h2>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 w-1/3">
                          {language === "ar" ? "الفئة العمرية" : "Age Range"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {language === "ar" ? "0-3 سنوات" : "0-3 years"}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700">
                          {language === "ar" ? "الوزن الأقصى" : "Maximum Weight"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {language === "ar" ? "18 كجم" : "18 kg"}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700">
                          {language === "ar" ? "سرعات الحركة" : "Movement Speeds"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {language === "ar" ? "5 سرعات" : "5 speeds (gears)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700">
                          {language === "ar" ? "إعدادات المؤقت" : "Timer Settings"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {language === "ar" ? "15، 30، 45 دقيقة" : "15, 30, 45 minutes"}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700">
                          {language === "ar" ? "النغمات" : "Tones"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {language === "ar" ? "15 نغمة مع التحكم في مستوى الصوت" : "15 tones with volume control"}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700">
                          {language === "ar" ? "الملحقات" : "Accessories"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {language === "ar" ? "ناموسية، جهاز تحكم عن بعد" : "Mosquito net, remote control"}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700">
                          {language === "ar" ? "الألوان المتاحة" : "Available Colors"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {language === "ar" ? "أزرق، وردي" : "Blue, Pink"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {product.id === "p1" && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold text-[#112938] mb-4">
                  {language === "ar" ? "لماذا تختار هذا المنتج؟" : "Why Choose This Product?"}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0CC0DF] flex items-center justify-center mt-1 mr-3">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-gray-700">
                      {language === "ar"
                        ? "تصميم مريح يساعد على تهدئة طفلك ويمنحك وقتًا للراحة"
                        : "Comfortable design that helps soothe your baby and gives you time to rest"}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0CC0DF] flex items-center justify-center mt-1 mr-3">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-gray-700">
                      {language === "ar"
                        ? "خمس سرعات مختلفة تناسب تفضيلات طفلك"
                        : "Five different speeds to suit your baby's preferences"}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0CC0DF] flex items-center justify-center mt-1 mr-3">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-gray-700">
                      {language === "ar"
                        ? "جهاز تحكم عن بعد يتيح لك ضبط الإعدادات دون إزعاج طفلك"
                        : "Remote control allows you to adjust settings without disturbing your baby"}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0CC0DF] flex items-center justify-center mt-1 mr-3">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-gray-700">
                      {language === "ar"
                        ? "ناموسية مدمجة لحماية طفلك من الحشرات"
                        : "Built-in mosquito net to protect your baby from insects"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Reviews */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-[#112938] mb-6">
                {language === "ar" ? "آراء العملاء" : "Customer Reviews"}
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {customerReviews.map((review, index) => (
                  <CustomerReview
                    key={index}
                    name={review.name}
                    nameAr={review.nameAr}
                    rating={review.rating}
                    date={review.date}
                    comment={review.comment}
                    commentAr={review.commentAr}
                  />
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline">{language === "ar" ? "عرض جميع التقييمات" : "View All Reviews"}</Button>
              </div>
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
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 01 1.772 1.153 4.902 4.902 0 01 1.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902\"
