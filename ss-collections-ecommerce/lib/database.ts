import { Database } from "./neon-db"

export interface Product {
  id: number
  name: string
  description: string
  price: number
  original_price?: number
  category: string
  sizes: { size: string; price: number }[]
  colors: string[]
  images: string[]
  stock: number
  rating: number
  reviews_count: number
  is_new: boolean
  is_featured: boolean
  is_on_sale: boolean
  show_on_user_side: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shipping_address: any
  payment_status: "pending" | "paid" | "failed"
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: number
  quantity: number
  price: number
  size?: string
  color?: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: "user" | "admin"
  phone?: string
  address?: any
  created_at: string
}

// Products
export const getProducts = async (
  filters: {
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    sizes?: string[]
    colors?: string[]
    isNew?: boolean
    isOnSale?: boolean
  } = {},
): Promise<Product[]> => {
  try {
    const params = new URLSearchParams()

    if (filters.category && filters.category !== "all") params.append("category", filters.category)
    if (filters.search) params.append("search", filters.search)
    if (filters.minPrice) params.append("minPrice", String(filters.minPrice))
    if (filters.maxPrice) params.append("maxPrice", String(filters.maxPrice))
    if (filters.sizes?.length) params.append("sizes", filters.sizes.join(","))
    if (filters.colors?.length) params.append("colors", filters.colors.join(","))
    if (filters.isNew) params.append("isNew", "true")
    if (filters.isOnSale) params.append("isOnSale", "true")

    const res = await fetch(`/api/products?${params.toString()}`, {
      next: { revalidate: 60 },
      cache: "no-store",
    })

    if (!res.ok) throw new Error(`API returned ${res.status}`)
    const products = await res.json()

    // Parse sizes as needed
    return products.map(product => ({
      ...product,
      sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes,
    }))
  } catch (err) {
    console.error("Error fetching products:", err)
    return []
  }
}

export const getProduct = async (id: number): Promise<Product> => {
  const res = await fetch(`/api/products/${id}`, {
    next: { revalidate: 60 },
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`Failed to load product ${id} – ${res.status}`)
  }
  const product = await res.json()

  // Parse sizes as needed
  product.sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes

  return product
}

// Featured products (max 8)
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch("/api/products?featured=true", {
      next: { revalidate: 60 },
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

// Orders - using Neon database directly
export const createOrder = Database.createOrder
export const getUserOrders = Database.getUserOrders
export const updateOrderStatus = Database.updateOrderStatus

// Admin functions - using Neon database directly
export const getAllProducts = Database.getAllProducts
export const getAllOrders = Database.getAllOrders
export const createProduct = Database.createProduct
export const updateProduct = Database.updateProduct
export const deleteProduct = Database.deleteProduct

// Analytics - using Neon database directly
export const getAnalytics = Database.getAnalytics
