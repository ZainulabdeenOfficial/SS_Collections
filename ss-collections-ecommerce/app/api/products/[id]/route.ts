import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/neon-db"
import { getMockProduct } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    // Try database first, fallback to mock data
    let product = await Database.getProduct(id)

    if (!product) {
      product = getMockProduct(id)
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Get product API error:", error)
    // Return mock data on error
    const id = Number.parseInt(params.id)
    const product = getMockProduct(id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  }
}
