import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/neon-db"
import { AuthUtils } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await Database.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await AuthUtils.hashPassword(password)

    const user = await Database.createUser({
      email,
      password_hash: hashedPassword,
      full_name: fullName,
      phone,
      role: "user",
    })

    if (!user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    const token = AuthUtils.generateToken(user.id, user.email, user.role)

    const response = NextResponse.json({
      message: "Registration successful",
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
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
