import OrderDetailsClient from "./order-details-client"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const resolvedParams = await params
  return <OrderDetailsClient orderId={resolvedParams.id} />
}