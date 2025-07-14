import { NextResponse } from "next/server"
import { Database } from "@/lib/neon-db"

export async function GET() {
  try {
    console.log("🧪 Testing database connection...")

    // Test basic connection
    const connected = await Database.testConnection()

    if (!connected) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
        },
        { status: 500 },
      )
    }

    // Test getting products
    const products = await Database.getProducts()

    // Test analytics
    const analytics = await Database.getAnalytics()

    return NextResponse.json({
      success: true,
      message: "Database connection successful! 🎉",
      data: {
        connection: "✅ Connected",
        products: `📦 ${products.length} products found`,
        analytics: {
          totalProducts: analytics.totalProducts,
          totalOrders: analytics.totalOrders,
          totalUsers: analytics.totalUsers,
          totalRevenue: analytics.totalRevenue,
        },
      },
    })
  } catch (error) {
    console.error("❌ Database test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Database test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
