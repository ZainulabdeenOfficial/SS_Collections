import { type NextRequest, NextResponse } from "next/server"
import { AuthUtils } from "@/lib/auth-utils"
import { Database } from "@/lib/neon-db"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    // Verify reset token
    const resetRecord = await Database.getPasswordResetToken(token)
    if (!resetRecord) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    // Hash new password
    const passwordHash = await AuthUtils.hashPassword(password)

    // Update user password
    await Database.updateUser(resetRecord.user_id, {
      password_hash: passwordHash,
    })

    // Mark token as used
    await Database.markPasswordResetTokenAsUsed(token)

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
