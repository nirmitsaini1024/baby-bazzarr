import type { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import type { CartItem } from "@/contexts/cart-context"

export interface OrderDocument {
  _id?: ObjectId
  orderId: string
  userId: string
  items: CartItem[]
  total: number
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled"
  statusAr: string
  date: string
  expectedDelivery: string
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    postalCode: string
  }
  createdAt: Date
}

export async function createOrder(orderData: Omit<OrderDocument, "_id" | "createdAt">): Promise<string> {
  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("orders").insertOne({
    ...orderData,
    createdAt: new Date(),
  })

  return orderData.orderId
}

export async function getUserOrders(userId: string): Promise<OrderDocument[]> {
  const client = await clientPromise
  const db = client.db()

  return db.collection("orders").find({ userId }).sort({ createdAt: -1 }).toArray()
}

export async function getOrderById(orderId: string): Promise<OrderDocument | null> {
  const client = await clientPromise
  const db = client.db()

  return db.collection("orders").findOne({ orderId })
}
