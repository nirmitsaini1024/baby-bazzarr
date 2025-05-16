import type { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export interface UserProfile {
  _id?: ObjectId
  userId: string
  email: string
  name?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const client = await clientPromise
  const db = client.db()

  return db.collection("users").findOne({ userId })
}

export async function updateUserProfile(
  userId: string,
  profileData: { name?: string; email?: string; phone?: string },
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
        createdAt: new Date(),
      },
    },
    { upsert: true },
  )
}
