import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/neon-db"
import { verifyAdminToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const products = await Database.getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Admin get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productData = await request.json()

    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product = await Database.createProduct({
      name: productData.name,
      description: productData.description || "",
      price: Number.parseFloat(productData.price),
      original_price: productData.original_price ? Number.parseFloat(productData.original_price) : null,
      category: productData.category,
      sizes: productData.sizes || [],
      colors: productData.colors || [],
      images: productData.images || [],
      stock: Number.parseInt(productData.stock) || 0,
      rating: Number.parseFloat(productData.rating) || 0,
      reviews_count: Number.parseInt(productData.reviews_count) || 0,
      is_new: Boolean(productData.is_new),
      is_featured: Boolean(productData.is_featured),
      is_on_sale: Boolean(productData.is_on_sale),
      show_on_user_side: Boolean(productData.show_on_user_side),
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Admin create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
