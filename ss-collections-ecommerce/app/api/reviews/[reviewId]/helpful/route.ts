import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/neon-db"
import { AuthUtils } from "@/lib/auth-utils"

export async function POST(request: NextRequest, { params }: { params: { reviewId: string } }) {
  try {
    // Get user from token
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await AuthUtils.getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid authentication" }, { status: 401 })
    }

    const { isHelpful } = await request.json()
    const reviewId = Number.parseInt(params.reviewId)

    if (typeof isHelpful !== "boolean") {
      return NextResponse.json({ error: "isHelpful must be a boolean" }, { status: 400 })
    }

    await Database.markReviewHelpful(reviewId, user.id, isHelpful)

    return NextResponse.json({
      message: "Review helpfulness updated",
    })
  } catch (error) {
    console.error("Mark review helpful API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
