import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/neon-db"
import { getMockProducts } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      minPrice: searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined,
      isNew: searchParams.get("isNew") === "true",
      isOnSale: searchParams.get("isOnSale") === "true",
      isFeatured: searchParams.get("featured") === "true" || searchParams.get("isFeatured") === "true",
    }

    // Try database first, fallback to mock data
    let products = await Database.getProducts(filters)

    if (!products || products.length === 0) {
      products = getMockProducts(filters)
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Get products API error:", error)
    // Return mock data on error
    const { searchParams } = new URL(request.url)
    const filters = {
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      minPrice: searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined,
      isNew: searchParams.get("isNew") === "true",
      isOnSale: searchParams.get("isOnSale") === "true",
      isFeatured: searchParams.get("featured") === "true" || searchParams.get("isFeatured") === "true",
    }
    return NextResponse.json(getMockProducts(filters))
  }
}
