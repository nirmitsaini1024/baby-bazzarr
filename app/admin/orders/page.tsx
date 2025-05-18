import { auth } from "@clerk/nextjs/server"
import { getAllOrders } from "@/models/order"
import { getUserProfile } from "@/models/user"
import { updateOrderStatusAction } from "./actions"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, Package, Calendar, User, ShoppingBag } from "lucide-react"

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
    userName: userMap.get(order.userId) || "Unknown",
    orderId: (order as any).orderId,
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[180px] font-semibold">
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="h-4 w-4 text-purple-600" />
                        Order ID
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-purple-600" />
                        User Name
                      </div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell font-semibold">User ID</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="hidden md:table-cell font-semibold">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        Ordered At
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id?.toString()} className="hover:bg-purple-50 transition-colors">
                      <TableCell className="font-medium text-purple-700">
                        {order.orderId ? `${order.orderId}` : order._id?.toString()}
                      </TableCell>
                      <TableCell className="font-medium">{order.userName}</TableCell>
                      <TableCell className="hidden md:table-cell truncate max-w-[150px] text-gray-500 text-sm">
                        {order.userId}
                      </TableCell>
                      <TableCell>
                        <form action={updateOrderStatusAction} className="flex items-center gap-2">
                          <input type="hidden" name="orderId" value={order._id?.toString()} />
                          <div className="flex items-center gap-2">
                            <Badge
                              className={STATUS_COLORS[order.status as keyof typeof STATUS_COLORS] || "bg-gray-100"}
                              variant="outline"
                            >
                              {order.status}
                            </Badge>
                            <Select name="status" defaultValue={order.status}>
                              <SelectTrigger className="w-[130px] border-purple-200 focus:ring-purple-500">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {ORDER_STATUSES.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                              Update
                            </Button>
                          </div>
                        </form>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
