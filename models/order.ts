import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import type { CartItem } from "@/contexts/cart-context"

export interface OrderItem {
  productId: string
  quantity: number
  price: number
}

export interface Order {
  _id?: ObjectId
  userId: string // Clerk userId
  items: OrderItem[]
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface OrderDocument {
  _id?: ObjectId
  orderId: string
  userId: string
  userEmail: string
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

/**
 * Create a new order
 */
export async function createOrder(orderData: Omit<OrderDocument, "_id" | "createdAt">): Promise<string> {
  try {
    const client = await clientPromise
    const db = client.db()
    const now = new Date()
    const newOrder: OrderDocument = {
      ...orderData,
      createdAt: now,
    }
    const result = await db.collection("orders").insertOne(newOrder)
    return orderData.orderId
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

/**
 * Get all orders (admin only)
 */
export async function getAllOrders(): Promise<Order[]> {
  try {
    const client = await clientPromise
    const db = client.db()
    const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray()
    return orders as Order[]
  } catch (error) {
    console.error("Error fetching all orders:", error)
    throw error
  }
}

/**
 * Get orders for a specific user
 */
export async function getUserOrders(userId: string): Promise<OrderDocument[]> {
  try {
    const client = await clientPromise
    const db = client.db()
    const orders = await db.collection("orders").find({ userId }).sort({ createdAt: -1 }).toArray()
    return orders as OrderDocument[]
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error)
    throw error
  }
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<void> {
  try {
    const client = await clientPromise
    const db = client.db()
    await db.collection("orders").updateOne(
      { orderId },
      { $set: { status, updatedAt: new Date() } }
    )
  } catch (error) {
    console.error(`Error updating order status for ${orderId}:`, error)
    throw error
  }
}

export async function getOrderById(orderId: string): Promise<OrderDocument | null> {
  const client = await clientPromise
  const db = client.db()
  return db.collection("orders").findOne({ orderId }) as Promise<OrderDocument | null>
}
