import type { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { ObjectId as MongoObjectId } from "mongodb"

export interface Review {
  _id?: ObjectId
  userId: string       // Clerk user ID
  productId: string    // Product ID
  rating: number       // Rating from 1-5
  comment: string      // Review comment
  createdAt: Date      // When the review was created
  updatedAt: Date      // When the review was last updated
  userName?: string    // User's name
  userImage?: string   // User's profile image
}

/**
 * Create a new review
 */
export async function createReview(reviewData: {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  userName?: string;
  userImage?: string;
}): Promise<Review> {
  if (!reviewData.userId) {
    throw new Error('User ID is required')
  }
  if (!reviewData.productId) {
    throw new Error('Product ID is required')
  }
  if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
    throw new Error('Rating must be between 1 and 5')
  }
  try {
    const client = await clientPromise
    const db = client.db()
    const now = new Date()
    const review: Review = {
      ...reviewData,
      createdAt: now,
      updatedAt: now
    }
    const result = await db.collection("reviews").insertOne(review)
    return { ...review, _id: result.insertedId }
  } catch (error) {
    console.error('Error creating review:', error)
    throw error
  }
}

/**
 * Get all reviews for a product
 */
export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const client = await clientPromise
    const db = client.db()
    const reviews = await db.collection("reviews")
      .find({ productId })
      .sort({ createdAt: -1 })
      .toArray()
    return reviews as unknown as Review[]
  } catch (error) {
    console.error("Error in getProductReviews:", error)
    throw error
  }
}

/**
 * Update a review
 */
export async function updateReview(
  reviewId: string,
  reviewData: {
    rating?: number;
    comment?: string;
  }
): Promise<void> {
  if (reviewData.rating && (reviewData.rating < 1 || reviewData.rating > 5)) {
    throw new Error('Rating must be between 1 and 5')
  }
  try {
    const client = await clientPromise
    const db = client.db()
    await db.collection("reviews").updateOne(
      { _id: new MongoObjectId(reviewId) },
      {
        $set: {
          ...reviewData,
          updatedAt: new Date()
        }
      }
    )
  } catch (error) {
    console.error(`Error updating review ${reviewId}:`, error)
    throw error
  }
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string): Promise<void> {
  try {
    const client = await clientPromise
    const db = client.db()
    await db.collection("reviews").deleteOne({ _id: new MongoObjectId(reviewId) })
  } catch (error) {
    console.error(`Error deleting review ${reviewId}:`, error)
    throw error
  }
} 