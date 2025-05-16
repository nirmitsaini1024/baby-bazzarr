import type { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import type { CartItem } from "@/contexts/cart-context"

export interface CartDocument {
  _id?: ObjectId
  userId: string
  items: CartItem[]
  updatedAt: Date
}

export async function getUserCart(userId: string): Promise<CartDocument | null> {
  const client = await clientPromise
  const db = client.db()

  return db.collection("carts").findOne({ userId })
}

export async function updateUserCart(userId: string, items: CartItem[]): Promise<void> {
  const client = await clientPromise
  const db = client.db()

  await db.collection("carts").updateOne(
    { userId },
    {
      $set: {
        items,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  )
}

export async function clearUserCart(userId: string): Promise<void> {
  const client = await clientPromise
  const db = client.db()

  await db.collection("carts").updateOne(
    { userId },
    {
      $set: {
        items: [],
        updatedAt: new Date(),
      },
    },
  )
}
