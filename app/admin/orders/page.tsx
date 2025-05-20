import { auth } from "@clerk/nextjs/server"
import { getAllOrders } from "@/models/order"
import { getUserProfile } from "@/models/user"
import { updateOrderStatusAction } from "./actions"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert, Package, ShoppingBag } from "lucide-react"
import { OrdersTable } from "./orders-table"

const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"] as const

// Status badge colors
const STATUS_COLORS = {
  Processing: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  Shipped: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  Delivered: "bg-green-100 text-green-800 hover:bg-green-100",
  Cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
}

async function getOrdersWithUserNames() {
  const orders = await getAllOrders()
  const userIds = Array.from(new Set(orders.map((o) => o.userId)))
  const userProfiles = await Promise.all(userIds.map((id) => getUserProfile(id)))
  const userMap = new Map(userProfiles.filter(Boolean).map((u) => [u!.userId, u!.name]))
  return orders.map((order) => ({
    ...order,
    _id: order._id?.toString(),
    userName: userMap.get(order.userId) || "Unknown",
    orderId: (order as any).orderId,
    createdAt: order.createdAt?.toISOString(),
    updatedAt: order.updatedAt?.toISOString()
  }))
}

export default async function AdminOrdersPage() {
  const { userId, orgId, orgRole, sessionId } = await auth()

  if (!orgId) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive" className="mb-6 border-l-4 border-red-600 shadow-md">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="text-lg">Access Denied</AlertTitle>
          <AlertDescription>Please sign in to your organization to access this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (orgRole !== "org:admin") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive" className="mb-6 border-l-4 border-red-600 shadow-md">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="text-lg">Access Denied</AlertTitle>
          <AlertDescription>You must be an admin to view this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const orders = await getOrdersWithUserNames()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" dir="ltr">
      <div className="flex items-center gap-3 mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-lg text-white shadow-lg">
        <Package className="h-8 w-8" />
        <h1 className="text-3xl font-bold tracking-tight">Admin Orders</h1>
      </div>

      <Card className="shadow-md border-t-4 border-purple-500">
        <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <ShoppingBag className="h-5 w-5" />
            Order Management
          </CardTitle>
          <CardDescription>Manage all customer orders and update their status</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-gray-50">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg">No orders found.</p>
            </div>
          ) : (
            <OrdersTable 
              orders={orders} 
              orderStatuses={ORDER_STATUSES}
              statusColors={STATUS_COLORS}
              updateOrderStatusAction={updateOrderStatusAction}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
