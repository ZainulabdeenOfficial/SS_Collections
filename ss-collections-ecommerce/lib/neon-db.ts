import { neon } from "@neondatabase/serverless"

// Only initialize on server side
let sql: any = null

if (typeof window === "undefined") {
  const connectionString =
    "postgresql://neondb_owner:npg_AMh4FDOBmis0@ep-frosty-hat-a8lgqa3j-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require"

  if (connectionString) {
    sql = neon(connectionString)
  }
}

export interface User {
  id: string
  email: string
  password_hash: string
  full_name?: string
  phone?: string
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

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
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  product_id: number
  user_id: string
  user_name: string
  rating: number
  comment: string
  helpful_count: number
  created_at: string
}

export interface Newsletter {
  id: string
  email: string
  subscribed_at: string
  is_active: boolean
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

export interface PasswordReset {
  id: string
  user_id: string
  token: string
  expires_at: string
  used: boolean
  created_at: string
}

// Server-side database functions
export class Database {
  static async getProducts(filters: any = {}): Promise<Product[]> {
    if (!sql) return []

    try {
      let query = `SELECT * FROM products WHERE 1=1`
      const params: any[] = []
      let paramIndex = 1

      if (filters.category && filters.category !== "all") {
        query += ` AND category = $${paramIndex}`
        params.push(filters.category)
        paramIndex++
      }

      if (filters.search) {
        query += ` AND name ILIKE $${paramIndex}`
        params.push(`%${filters.search}%`)
        paramIndex++
      }

      if (filters.isFeatured) {
        query += ` AND is_featured = true`
      }

      if (filters.isNew) {
        query += ` AND is_new = true`
      }

      if (filters.isOnSale) {
        query += ` AND is_on_sale = true`
      }

      query += ` ORDER BY created_at DESC`

      if (filters.isFeatured) {
        query += ` LIMIT 8`
      }

      const result = params.length > 0 ? await sql.query(query, params) : await sql.query(query)
      return result || []
    } catch (error) {
      console.error("Database error:", error)
      return []
    }
  }

  static async getProduct(id: number): Promise<Product | null> {
    if (!sql) return null

    try {
      const result = await sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`
      return result[0] || null
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  static async getFeaturedProducts(): Promise<Product[]> {
    if (!sql) return []

    try {
      const result = await sql`
        SELECT * FROM products 
        WHERE is_featured = true
        ORDER BY created_at DESC
        LIMIT 8
      `
      return result || []
    } catch (error) {
      console.error("Database error:", error)
      return []
    }
  }

  static async createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User | null> {
    if (!sql) return null

    try {
      const result = await sql`
        INSERT INTO users (email, password_hash, full_name, phone, role)
        VALUES (${userData.email}, ${userData.password_hash}, ${userData.full_name || null}, ${userData.phone || null}, ${userData.role || "user"})
        RETURNING *
      `
      return result[0] || null
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    if (!sql) return null

    try {
      const result = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`
      return result[0] || null
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    if (!sql) return null

    try {
      const result = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`
      return result[0] || null
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  static async subscribeToNewsletter(email: string): Promise<Newsletter | null> {
    if (!sql) return null

    try {
      const result = await sql`
        INSERT INTO newsletter_subscribers (email)
        VALUES (${email})
        ON CONFLICT (email) DO UPDATE SET is_active = true, subscribed_at = NOW()
        RETURNING *
      `
      return result[0] || null
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  static async getProductReviews(productId: number): Promise<Review[]> {
    if (!sql) return []

    try {
      const result = await sql`
        SELECT * FROM reviews 
        WHERE product_id = ${productId}
        ORDER BY created_at DESC
      `
      return result || []
    } catch (error) {
      console.error("Database error:", error)
      return []
    }
  }

  static async createReview(reviewData: Omit<Review, "id" | "created_at" | "helpful_count">): Promise<Review | null> {
    if (!sql) return null

    try {
      const result = await sql`
        INSERT INTO reviews (product_id, user_id, user_name, rating, comment)
        VALUES (${reviewData.product_id}, ${reviewData.user_id}, ${reviewData.user_name}, ${reviewData.rating}, ${reviewData.comment})
        RETURNING *
      `
      return result[0] || null
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  static async createPasswordResetToken(userId: string, token: string): Promise<PasswordReset | null> {
    if (!sql) return null

    try {
      const result = await sql`
        INSERT INTO password_resets (user_id, token, expires_at)
        VALUES (${userId}, ${token}, NOW() + INTERVAL '1 hour')
        RETURNING *
      `
      return result[0] || null
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  static async getPasswordResetToken(token: string): Promise<PasswordReset | null> {
    if (!sql) return null

    try {
      const result = await sql`
        SELECT * FROM password_resets 
        WHERE token = ${token} AND expires_at > NOW() AND used = false
        LIMIT 1
      `
      return result[0] || null
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  static async markPasswordResetTokenAsUsed(token: string): Promise<void> {
    if (!sql) return

    try {
      await sql`UPDATE password_resets SET used = true WHERE token = ${token}`
    } catch (error) {
      console.error("Database error:", error)
    }
  }

  static async getAllProducts(): Promise<Product[]> {
    if (!sql) return []

    try {
      const result = await sql`SELECT * FROM products ORDER BY created_at DESC`
      return result || []
    } catch (error) {
      console.error("Database error:", error)
      return []
    }
  }

  static async createProduct(productData: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product | null> {
    if (!sql) return null

    try {
      const result = await sql`
        INSERT INTO products (
          name, description, price, original_price, category, sizes, colors, images,
          stock, rating, reviews_count, is_new, is_featured, is_on_sale
        )
        VALUES (
          ${productData.name}, ${productData.description}, ${productData.price}, 
          ${productData.original_price || null}, ${productData.category}, 
          ${JSON.stringify(productData.sizes)}, ${JSON.stringify(productData.colors)}, 
          ${JSON.stringify(productData.images)}, ${productData.stock}, ${productData.rating}, 
          ${productData.reviews_count}, ${productData.is_new}, ${productData.is_featured}, 
          ${productData.is_on_sale}
        )
        RETURNING *
      `
      return result[0] || null
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  static async updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
    if (!sql) return null

    try {
      const keys = Object.keys(updates)
      const values = Object.values(updates)

      if (keys.length === 0) return null

      const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(", ")

      const result = await sql.query(`UPDATE products SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`, [
        id,
        ...values,
      ])

      return result[0] || null
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  static async deleteProduct(id: number): Promise<void> {
    if (!sql) return

    try {
      await sql`DELETE FROM products WHERE id = ${id}`
    } catch (error) {
      console.error("Database error:", error)
    }
  }
}
