import { NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/neon-db"
import { AuthUtils } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    // Check if the current user is an admin
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const user = AuthUtils.verifyToken(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { email, password, fullName } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if admin already exists
    const existing = await Database.getAdminByEmail(email)
    if (existing) {
      return NextResponse.json({ error: "Admin with this email already exists" }, { status: 409 })
    }

    const password_hash = await AuthUtils.hashPassword(password)
    const newAdmin = await Database.createAdmin({ email, password_hash, full_name: fullName })
    if (!newAdmin) {
      return NextResponse.json({ error: "Failed to create admin" }, { status: 500 })
    }

    return NextResponse.json({ message: "Admin created successfully", admin: { id: newAdmin.id, email: newAdmin.email, full_name: newAdmin.full_name } })
  } catch (error) {
    console.error("Add admin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 