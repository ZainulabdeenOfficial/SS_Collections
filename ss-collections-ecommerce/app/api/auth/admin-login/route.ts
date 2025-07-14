import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/neon-db"
import { AuthUtils } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Try to get admin from database
    const admin = await Database.getAdminByEmail(email)
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await AuthUtils.verifyPassword(password, admin.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = AuthUtils.generateToken(admin.id, admin.email, "admin")

    const response = NextResponse.json({
      message: "Admin login successful",
      user: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: "admin",
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 