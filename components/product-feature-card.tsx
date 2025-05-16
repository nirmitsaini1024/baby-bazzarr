import type { ReactNode } from "react"

type ProductFeatureCardProps = {
  icon: ReactNode
  title: string
  description: string
}

export default function ProductFeatureCard({ icon, title, description }: ProductFeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-3">
        <div className="text-[#0CC0DF] mr-3">{icon}</div>
        <h3 className="font-medium text-[#112938]">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
