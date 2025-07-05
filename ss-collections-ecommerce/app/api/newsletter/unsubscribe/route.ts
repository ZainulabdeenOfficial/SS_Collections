import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/neon-db"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await Database.unsubscribeNewsletter(email)

    return NextResponse.json({
      message: "Successfully unsubscribed from newsletter",
    })
  } catch (error) {
    console.error("Newsletter unsubscribe API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
