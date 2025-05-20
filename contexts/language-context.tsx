"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ar"

type Translations = {
  [key in Language]: {
    [key: string]: string
  }
}

// Define translations for both languages
const translations: Translations = {
  en: {
    // Navigation
    newborn: "Newborn",
    toys: "Toys",
    feeding: "Feeding",
    sale: "Sale",
    search: "Search",
    cart: "Cart",
    // Hero
    hero_title: "Premium Baby Essentials for Happy Families",
    hero_subtitle:
      "Discover our curated collection of high-quality products designed for your little one's comfort and joy.",
    shop_now: "Shop Now",
    // Products
    new_arrivals: "New Arrivals",
    view_all: "View all",
    add_to_cart: "Add to Cart",
    // Featured Collection
    featured_collection: "Featured Collection",
    eco_friendly_title: "Eco-Friendly Baby Essentials",
    eco_friendly_desc:
      "Our sustainable collection features organic materials and eco-conscious manufacturing processes, ensuring your baby's comfort while protecting the planet they'll inherit.",
    explore_collection: "Explore Collection",
    // Testimonials
    what_parents_say: "What Parents Say",
    // Footer
    shop: "Shop",
    new_arrivals_footer: "New Arrivals",
    best_sellers: "Best Sellers",
    sale_footer: "Sale",
    gift_cards: "Gift Cards",
    help: "Help",
    customer_service: "Customer Service",
    track_order: "Track Order",
    returns: "Returns & Exchanges",
    shipping: "Shipping Information",
    about: "About",
    our_story: "Our Story",
    sustainability: "Sustainability",
    careers: "Careers",
    contact_us: "Contact Us",
    rights_reserved: "All rights reserved.",
    privacy_policy: "Privacy Policy",
    terms_of_service: "Terms of Service",
    // Shop Page
    shop_title: "Shop",
    shop_subtitle: "Browse our collection of premium baby products",
    // Cart Page
    your_cart: "Your Cart",
    empty_cart: "Your cart is empty",
    continue_shopping: "Continue Shopping",
    product: "Product",
    price: "Price",
    quantity: "Quantity",
    total: "Total",
    remove: "Remove",
    subtotal: "Subtotal",
    shipping_fee: "Shipping Fee",
    cash_collection_fee: "Cash Collection Fee",
    order_total: "Order Total",
    checkout: "Checkout",
    // Checkout
    checkout_title: "Checkout",
    personal_info: "Personal Information",
    full_name: "Full Name",
    email: "Email",
    phone: "Phone",
    shipping_address: "Shipping Address",
    address: "Address",
    city: "City",
    state: "State/Province",
    postal_code: "Postal Code",
    payment_method: "Payment Method",
    cash_on_delivery: "Cash on Delivery",
    place_order: "Place Order",
    order_success: "Order Placed Successfully!",
    order_success_message: "Thank you for your order. We'll contact you soon to confirm delivery details.",
    back_to_shop: "Back to Shop",
    // Categories
    gear: "Gear",
    // My Orders
    my_orders: "My Orders",
  },
  ar: {
    // Navigation
    newborn: "حديثي الولادة",
    toys: "ألعاب",
    feeding: "تغذية",
    sale: "تخفيضات",
    search: "بحث",
    cart: "سلة التسوق",
    // Hero
    hero_title: "مستلزمات أطفال متميزة للعائلات السعيدة",
    hero_subtitle: "اكتشف مجموعتنا المختارة من المنتجات عالية الجودة المصممة لراحة وسعادة طفلك الصغير.",
    shop_now: "تسوق الآن",
    // Products
    new_arrivals: "وصل حديثاً",
    view_all: "عرض الكل",
    add_to_cart: "أضف إلى السلة",
    // Featured Collection
    featured_collection: "المجموعة المميزة",
    eco_friendly_title: "مستلزمات أطفال صديقة للبيئة",
    eco_friendly_desc:
      "تتميز مجموعتنا المستدامة بمواد عضوية وعمليات تصنيع صديقة للبيئة، مما يضمن راحة طفلك مع حماية الكوكب الذي سيرثه.",
    explore_collection: "استكشف المجموعة",
    // Testimonials
    what_parents_say: "ماذا يقول الآباء",
    // Footer
    shop: "تسوق",
    new_arrivals_footer: "وصل حديثاً",
    best_sellers: "الأكثر مبيعاً",
    sale_footer: "تخفيضات",
    gift_cards: "بطاقات الهدايا",
    help: "المساعدة",
    customer_service: "خدمة العملاء",
    track_order: "تتبع الطلب",
    returns: "الإرجاع والاستبدال",
    shipping: "معلومات الشحن",
    about: "عن الشركة",
    our_story: "قصتنا",
    sustainability: "الاستدامة",
    careers: "وظائف",
    contact_us: "اتصل بنا",
    rights_reserved: "جميع الحقوق محفوظة.",
    privacy_policy: "سياسة الخصوصية",
    terms_of_service: "شروط الخدمة",
    // Shop Page
    shop_title: "المتجر",
    shop_subtitle: "تصفح مجموعتنا من منتجات الأطفال المتميزة",
    // Cart Page
    your_cart: "سلة التسوق",
    empty_cart: "سلة التسوق فارغة",
    continue_shopping: "مواصلة التسوق",
    product: "المنتج",
    price: "السعر",
    quantity: "الكمية",
    total: "المجموع",
    remove: "إزالة",
    subtotal: "المجموع الفرعي",
    shipping_fee: "رسوم الشحن",
    cash_collection_fee: "رسوم الدفع عند الاستلام",
    order_total: "إجمالي الطلب",
    checkout: "إتمام الشراء",
    // Checkout
    checkout_title: "إتمام الشراء",
    personal_info: "المعلومات الشخصية",
    full_name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    shipping_address: "عنوان الشحن",
    address: "العنوان",
    city: "المدينة",
    state: "المحافظة",
    postal_code: "الرمز البريدي",
    payment_method: "طريقة الدفع",
    cash_on_delivery: "الدفع عند الاستلام",
    place_order: "تأكيد الطلب",
    order_success: "تم تقديم الطلب بنجاح!",
    order_success_message: "شكراً لطلبك. سنتصل بك قريباً لتأكيد تفاصيل التسليم.",
    back_to_shop: "العودة إلى المتجر",
    // Categories
    gear: "مستلزمات",
    // My Orders
    my_orders: "طلباتي",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("ar")
  const [dir, setDir] = useState<string>("rtl")

  useEffect(() => {
    // Set the direction based on the language
    setDir(language === "ar" ? "rtl" : "ltr")

    // Set the dir attribute on the html element
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"

    // Store the language preference in localStorage
    localStorage.setItem("language", language)
  }, [language])

  // Load the language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>{children}</LanguageContext.Provider>
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
