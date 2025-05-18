import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { createReview, getProductReviews } from "@/models/review"

export const dynamic = 'force-dynamic'

// Public endpoint - no auth required for fetching reviews
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      )
    }

    // Get all reviews for the product
    const reviews = await getProductReviews(productId)
    
    // Return with explicit cache control headers
    return new NextResponse(JSON.stringify(reviews), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}

// Protected endpoint - auth required for posting reviews
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get current user information for the review
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { message: "User information not found" },
        { status: 400 }
      )
    }

    const { productId, rating, comment } = await req.json()

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create review with user information (no duplicate check)
    const review = await createReview({
      userId: session.userId,
      productId,
      rating,
      comment,
      userName: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.username || 'Anonymous',
      userImage: user.imageUrl
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create review" },
      { status: 500 }
    )
  }
} 