'use server';

import type { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export interface UserProfile {
  _id?: ObjectId
  userId: string       // Clerk user ID
  name: string         // Full name
  email: string        // Primary email
  phone?: string       // Optional phone number
  imageUrl?: string    // Profile image URL
  isActive: boolean    // User account status
  createdAt: Date      // When the user was first created
  updatedAt: Date      // When the user was last updated
}

/**
 * Get a user profile by Clerk user ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("users").findOne({ userId })
    return result as unknown as UserProfile | null
  } catch (error) {
    console.error(`Error fetching user profile for ${userId}:`, error)
    throw error
  }
}

/**
 * Get a user profile by email address
 */
export async function getUserProfileByEmail(email: string): Promise<UserProfile | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("users").findOne({ email })
    return result as unknown as UserProfile | null
  } catch (error) {
    console.error(`Error fetching user profile for email ${email}:`, error)
    throw error
  }
}

/**
 * Update or create a user profile
 */
export async function updateUserProfile(
  userId: string,
  profileData: { 
    name: string; 
    email: string;
    phone?: string;
    imageUrl?: string;
  }
): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required')
  }
  
  if (!profileData.email) {
    throw new Error('Email is required')
  }

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

/**
 * Mark a user as deleted (soft delete)
 */
export async function markUserDeleted(userId: string): Promise<void> {
  try {
    const client = await clientPromise
    const db = client.db()

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
    console.error(`Error marking user as deleted for ${userId}:`, error)
    throw error
  }
}

/**
 * Get all active users
 */
export async function getAllActiveUsers(): Promise<UserProfile[]> {
  try {
    const client = await clientPromise
    const db = client.db()

    const users = await db.collection("users")
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .toArray()

    return users as unknown as UserProfile[]
  } catch (error) {
    console.error('Error fetching all users:', error)
    throw error
  }
}