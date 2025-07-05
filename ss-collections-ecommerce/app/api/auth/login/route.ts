import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/neon-db"
import { AuthUtils } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Try to get user from database
    let user = await Database.getUserByEmail(email)

    // Mock admin user for demo
    if (!user && email === "admin@sscollections.com") {
      user = {
        id: "admin-1",
        email: "admin@sscollections.com",
        password_hash: await AuthUtils.hashPassword("admin123"),
        full_name: "Admin User",
        role: "admin" as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await AuthUtils.verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = AuthUtils.generateToken(user.id, user.email, user.role)

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
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
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
