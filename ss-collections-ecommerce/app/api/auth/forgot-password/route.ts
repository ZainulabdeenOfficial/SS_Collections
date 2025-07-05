import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/neon-db"
import { sendPasswordResetEmail } from "@/lib/email-service"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await Database.getUserByEmail(email)
    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json({ message: "If an account with that email exists, we sent a password reset link." })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")

    // Save reset token to database
    await Database.createPasswordResetToken(user.id, resetToken)

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.full_name || "User")
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError)
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
    }

    return NextResponse.json({ message: "If an account with that email exists, we sent a password reset link." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
