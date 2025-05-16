import type { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export interface UserProfile {
  _id?: ObjectId
  userId: string
  name: string        // Required field
  email: string       // Required field (new)
  phone?: string      // Optional field
  createdAt: Date
  updatedAt: Date
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const client = await clientPromise
  const db = client.db()

  // Add proper type casting
  const result = await db.collection("users").findOne({ userId })
  return result as unknown as UserProfile | null
}

export async function updateUserProfile(
  userId: string,
  profileData: { name: string; email: string },
): Promise<void> {
  const client = await clientPromise
  const db = client.db()

  await db.collection("users").updateOne(
    { userId },
    {
      $set: {
        ...profileData,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  )
}