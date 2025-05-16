import type { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export interface UserProfile {
  _id?: ObjectId
  userId: string
  name: string
  email: string
  imageUrl?: string
  phone?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("users").findOne({ userId })
    return result as unknown as UserProfile | null
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

export async function updateUserProfile(
  userId: string,
  profileData: { 
    name: string; 
    email: string;
    imageUrl?: string;
    phone?: string;
  }
): Promise<void> {
  try {
    const client = await clientPromise
    const db = client.db()

    await db.collection("users").updateOne(
      { userId },
      {
        $set: {
          ...profileData,
          isActive: true,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          userId,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )
  } catch (error) {
    console.error(`Error updating user profile for ${userId}:`, error)
    throw error
  }
}

export async function deleteUserProfile(userId: string): Promise<void> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Soft delete by marking as inactive instead of actually removing the record
    await db.collection("users").updateOne(
      { userId },
      {
        $set: {
          isActive: false,
          updatedAt: new Date()
        }
      }
    )
  } catch (error) {
    console.error(`Error deleting user profile for ${userId}:`, error)
    throw error
  }
}