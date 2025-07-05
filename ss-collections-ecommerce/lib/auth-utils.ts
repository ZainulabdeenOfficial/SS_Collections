import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"
import { Database } from "./neon-db"
import type { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export class AuthUtils {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  static generateToken(userId: string, email: string, role = "user"): string {
    return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: "7d" })
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return null
    }
  }

  static async getUserFromToken(token: string) {
    try {
      const decoded = this.verifyToken(token)
      if (!decoded) return null

      const user = await Database.getUserById(decoded.userId)
      return user
    } catch (error) {
      return null
    }
  }

  static generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
}

export async function verifyAdminToken(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return { success: false, error: "No token provided" }
    }

    const user = await AuthUtils.getUserFromToken(token)
    if (!user || user.role !== "admin") {
      return { success: false, error: "Admin access required" }
    }

    return { success: true, user }
  } catch (error) {
    return { success: false, error: "Invalid token" }
  }
}
