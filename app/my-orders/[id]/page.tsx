import OrderDetailsClient from "./order-details-client"

interface PageProps {
  params: {
    id: string
  }
}

export default function OrderDetailsPage({ params }: PageProps) {
  return <OrderDetailsClient orderId={params.id} />
}
