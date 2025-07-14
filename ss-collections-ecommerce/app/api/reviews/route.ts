import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/neon-db"
import { AuthUtils } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const reviews = await Database.getProductReviews(Number.parseInt(productId))
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Get reviews error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await AuthUtils.getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { productId, rating, comment } = await request.json()

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: "Product ID, rating, and comment are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const review = await Database.createReview({
      product_id: productId,
      user_id: user.id,
      user_name: user.full_name || user.email,
      rating,
      comment,
    })

    return NextResponse.json({
      message: "Review created successfully",
      review,
    })
  } catch (error) {
    console.error("Create review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
