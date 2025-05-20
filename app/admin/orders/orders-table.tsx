"use client"

import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ShoppingBag } from "lucide-react"

function OrderDetailsRow({ order }: { order: any }) {
  return (
    <tr className="bg-purple-50">
      <td colSpan={6} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2 text-purple-700">Shipping Address</h4>
            <div className="text-sm text-gray-700">
              <div><span className="font-medium">Name:</span> {order.shippingAddress?.fullName}</div>
              <div><span className="font-medium">Phone:</span> {order.shippingAddress?.phone}</div>
              <div><span className="font-medium">Address:</span> {order.shippingAddress?.address}</div>
              <div><span className="font-medium">Postal Code:</span> {order.shippingAddress?.postalCode}</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-purple-700">Order Items</h4>
            <ul className="divide-y divide-gray-200">
              {order.items?.map((item: any) => (
                <li key={item.id || item.productId} className="py-2 flex items-center gap-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover border" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold text-purple-700">${item.price}</div>
                </li>
              ))}
            </ul>
            <div className="mt-2 text-right text-sm font-bold text-purple-800">
              Total: ${order.total || order.items?.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0)}
            </div>
          </div>
        </div>
      </td>
    </tr>
  )
}

interface OrdersTableProps {
  orders: any[]
  orderStatuses: readonly string[]
  statusColors: Record<string, string>
  updateOrderStatusAction: (formData: FormData) => Promise<void>
}

export function OrdersTable({ orders, orderStatuses, statusColors, updateOrderStatusAction }: OrdersTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  
  return (
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
          <TableHead className="font-semibold">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => [
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
                    className={statusColors[order.status] || "bg-gray-100"}
                    variant="outline"
                  >
                    {order.status}
                  </Badge>
                  <Select name="status" defaultValue={order.status}>
                    <SelectTrigger className="w-[130px] border-purple-200 focus:ring-purple-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map((status) => (
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
            <TableCell>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-purple-300 text-purple-700"
                onClick={() => setExpanded(expanded === order._id?.toString() ? null : order._id?.toString())}
              >
                {expanded === order._id?.toString() ? "Hide Detail" : "View Detail"}
              </Button>
            </TableCell>
          </TableRow>,
          expanded === order._id?.toString() && <OrderDetailsRow key={order._id?.toString() + "-details"} order={order} />
        ])}
      </TableBody>
    </Table>
  )
} 