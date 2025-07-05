import { NextResponse } from "next/server"
import { Database } from "@/lib/neon-db"

export async function POST() {
  try {
    console.log("🚀 Running database setup...")

    // Test connection first
    const connected = await Database.testConnection()
    if (!connected) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed. Please check your environment variables.",
        },
        { status: 500 },
      )
    }

    // Create default admin user
    await Database.createDefaultAdmin()

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully! 🎉",
      adminCredentials: {
        email: process.env.DEFAULT_ADMIN_EMAIL || "admin@sscollections.com",
        password: process.env.DEFAULT_ADMIN_PASSWORD || "admin123456",
      },
    })
  } catch (error) {
    console.error("❌ Setup failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Setup failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
