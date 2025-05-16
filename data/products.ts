export type Product = {
  id: string
  name: string
  nameAr: string
  price: number
  originalPrice?: number
  discountPercentage?: number
  image: string
  additionalImages?: string[]
  category: string
  description: string
  descriptionAr: string
  features?: string[]
  featuresAr?: string[]
  colors?: { id: string; name: string; nameAr: string; hex: string }[]
  specifications?: { name: string; nameAr: string; value: string; valueAr: string }[]
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Baby Bouncer",
    nameAr: "نطاطة الأطفال",
    price: 3349 ,
    originalPrice: 5000 ,
    discountPercentage: 34,
    image: "/images/baby-bouncer.jpeg",
    additionalImages: [
      "/images/baby-bouncer-features.jpeg",
      "/images/baby-bouncer-with-baby.jpeg",
      "/images/baby-bouncer-with-net.jpeg",
    ],
    category: "gear",
    description:
      "Premium baby bouncer with comfortable padding and soothing rocking motion. Features side-to-side movement at 5 perfect angles with full tilt mode. Includes 3 timer settings (15, 30, and 45 minutes) and comes with a mosquito net for protection. Enjoy 15 tones with volume control that can be operated via remote control. Suitable for children aged 0–3 years with a maximum weight capacity of 18 kg.",
    descriptionAr:
      "نطاطة أطفال متميزة مع وسادة مريحة وحركة هزازة مهدئة. تتميز بحركة جانبية بخمس زوايا مثالية مع وضع إمالة كامل. تتضمن 3 إعدادات للمؤقت (15 و 30 و 45 دقيقة) وتأتي مع ناموسية للحماية. استمتع بـ 15 نغمة مع التحكم في مستوى الصوت الذي يمكن تشغيله عبر جهاز التحكم عن بعد. مناسبة للأطفال من عمر 0-3 سنوات بسعة وزن قصوى تبلغ 18 كجم.",
    features: [
      "Side-to-side movement at 5 perfect angles",
      "Full tilt mode",
      "3 timer settings (15, 30, and 45 minutes)",
      "Comes with mosquito net",
      "15 tones with volume control",
      "Can be controlled via remote control",
      "Suitable for children aged 0–3 years",
      "Maximum weight: 18 kg",
    ],
    featuresAr: [
      "حركة جانبية بخمس زوايا مثالية",
      "وضع إمالة كامل",
      "3 إعدادات للمؤقت (15 و 30 و 45 دقيقة)",
      "تأتي مع ناموسية",
      "15 نغمة مع التحكم في مستوى الصوت",
      "يمكن التحكم فيها عبر جهاز التحكم عن بعد",
      "مناسبة للأطفال من عمر 0-3 سنوات",
      "الوزن الأقصى: 18 كجم",
    ],
    colors: [
      { id: "blue", name: "Blue", nameAr: "أزرق", hex: "#6E8FAD" },
      { id: "pink", name: "Pink", nameAr: "وردي", hex: "#F7CAD0" },
    ],
    specifications: [
      {
        name: "Brand",
        nameAr: "الماركة",
        value: "Mastela",
        valueAr: "ماستيلا",
      },
      {
        name: "Age Group",
        nameAr: "الفئة العمرية",
        value: "Infants",
        valueAr: "الرضع",
      },
      {
        name: "Color",
        nameAr: "اللون",
        value: "Multicolor",
        valueAr: "متعدد الألوان",
      },
      {
        name: "Type",
        nameAr: "النوع",
        value: "For both sexes",
        valueAr: "للجنسين",
      },
      {
        name: "Material",
        nameAr: "المادة",
        value: "Multi-material",
        valueAr: "متعدد المواد",
      },
      {
        name: "Condition",
        nameAr: "الحالة",
        value: "New",
        valueAr: "جديد",
      },
      {
        name: "Maximum Weight",
        nameAr: "الوزن الأقصى",
        value: "18 kg",
        valueAr: "18 كجم",
      },
      {
        name: "Timer Settings",
        nameAr: "إعدادات المؤقت",
        value: "15, 30, 45 minutes",
        valueAr: "15، 30، 45 دقيقة",
      },
      {
        name: "Sound",
        nameAr: "الصوت",
        value: "15 tones with volume control",
        valueAr: "15 نغمة مع التحكم في مستوى الصوت",
      },
      {
        name: "Control",
        nameAr: "التحكم",
        value: "Remote control included",
        valueAr: "جهاز تحكم عن بعد مضمن",
      },
    ],
  },
  {
    id: "p2",
    name: "Baby Play Pen",
    nameAr: "سرير لعب للأطفال",
    price: 1600,
    originalPrice: 2000,
    discountPercentage: 20,
    image: "/images/baby-play-pen.jpeg",
    additionalImages: [
      "/images/baby-play-pen-with-baby.jpeg",
      "/images/baby-play-pen-with-balls.jpeg",
      "/images/baby-play-pen-dimensions.jpeg",
    ],
    category: "furniture",
    description:
      "Infant and child fence for indoor and outdoor use. This spacious playground for babies and children features mesh sides for visibility, a comfortable base, and easy assembly. Dimensions: 127 cm x 127 cm x 66 cm. Safe and comfortable design to provide a secure environment for your little one while they play. Perfect for both indoor and outdoor use.",
    descriptionAr:
      "سياج للرضع والأطفال للاستخدام الداخلي والخارجي. تتميز ساحة اللعب الواسعة هذه للأطفال والرضع بجوانب شبكية للرؤية، وقاعدة مريحة، وسهولة التجميع. الأبعاد: 127 سم × 127 سم × 66 سم. تصميم آمن ومريح لتوفير بيئة آمنة لطفلك الصغير أثناء اللعب. مثالي للاستخدام الداخلي والخارجي.",
    features: [
      "Spacious play area (127 cm x 127 cm x 66 cm)",
      "Mesh sides for visibility and airflow",
      "Safe and comfortable design",
      "Easy assembly and disassembly",
      "Suitable for indoor and outdoor use",
      "Includes colorful balls for play",
      "Portable and lightweight design",
    ],
    featuresAr: [
      "مساحة لعب واسعة (127 سم × 127 سم × 66 سم)",
      "جوانب شبكية للرؤية وتدفق الهواء",
      "تصميم آمن ومريح",
      "سهولة التجميع والتفكيك",
      "مناسب للاستخدام الداخلي والخارجي",
      "يتضمن كرات ملونة للعب",
      "تصميم محمول وخفيف الوزن",
    ],
    colors: [
      { id: "red", name: "Red", nameAr: "أحمر", hex: "#E63946" },
      { id: "grey", name: "Grey", nameAr: "رمادي", hex: "#8D99AE" },
      { id: "blue", name: "Blue", nameAr: "أزرق", hex: "#457B9D" },
      { id: "pink", name: "Pink", nameAr: "وردي", hex: "#F7CAD0" },
    ],
    specifications: [
      {
        name: "Brand",
        nameAr: "الماركة",
        value: "Generic",
        valueAr: "جينيريك",
      },
      {
        name: "Age Group",
        nameAr: "الفئة العمرية",
        value: "Young children",
        valueAr: "الأطفال الصغار",
      },
      {
        name: "Dimensions",
        nameAr: "الأبعاد",
        value: "127 cm x 127 cm x 66 cm",
        valueAr: "127 سم × 127 سم × 66 سم",
      },
      {
        name: "Type",
        nameAr: "النوع",
        value: "Unisex",
        valueAr: "للجنسين",
      },
      {
        name: "Material",
        nameAr: "المادة",
        value: "Multi-material",
        valueAr: "متعدد المواد",
      },
      {
        name: "Main Color",
        nameAr: "اللون الرئيسي",
        value: "Ashen",
        valueAr: "رمادي",
      },
      {
        name: "Condition",
        nameAr: "الحالة",
        value: "New",
        valueAr: "جديد",
      },
      {
        name: "Usage",
        nameAr: "الاستخدام",
        value: "Indoor and outdoor",
        valueAr: "داخلي وخارجي",
      },
    ],
  },
]
