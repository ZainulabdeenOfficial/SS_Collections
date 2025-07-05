import type { Product } from "./neon-db"

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    description: "Soft and comfortable premium cotton t-shirt perfect for everyday wear.",
    price: 29.99,
    original_price: 39.99,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Navy"],
    images: ["/placeholder.svg?height=400&width=400"],
    stock: 50,
    rating: 4.5,
    reviews_count: 23,
    is_new: true,
    is_featured: true,
    is_on_sale: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Elegant Summer Dress",
    description: "Beautiful flowing summer dress perfect for any occasion.",
    price: 79.99,
    original_price: null,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blue", "Pink", "White"],
    images: ["/placeholder.svg?height=400&width=400"],
    stock: 30,
    rating: 4.8,
    reviews_count: 45,
    is_new: false,
    is_featured: true,
    is_on_sale: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Classic Denim Jeans",
    description: "High-quality denim jeans with a perfect fit and timeless style.",
    price: 89.99,
    original_price: 109.99,
    category: "men",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Blue", "Black"],
    images: ["/placeholder.svg?height=400&width=400"],
    stock: 25,
    rating: 4.3,
    reviews_count: 67,
    is_new: false,
    is_featured: true,
    is_on_sale: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Stylish Sneakers",
    description: "Comfortable and trendy sneakers for everyday activities.",
    price: 119.99,
    original_price: null,
    category: "shoes",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["White", "Black", "Gray"],
    images: ["/placeholder.svg?height=400&width=400"],
    stock: 40,
    rating: 4.6,
    reviews_count: 89,
    is_new: true,
    is_featured: true,
    is_on_sale: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Cozy Winter Sweater",
    description: "Warm and comfortable sweater perfect for cold weather.",
    price: 69.99,
    original_price: 89.99,
    category: "women",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beige", "Gray", "Navy"],
    images: ["/placeholder.svg?height=400&width=400"],
    stock: 35,
    rating: 4.4,
    reviews_count: 34,
    is_new: false,
    is_featured: true,
    is_on_sale: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Professional Blazer",
    description: "Elegant blazer perfect for business meetings and formal events.",
    price: 149.99,
    original_price: null,
    category: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Charcoal"],
    images: ["/placeholder.svg?height=400&width=400"],
    stock: 20,
    rating: 4.7,
    reviews_count: 56,
    is_new: true,
    is_featured: true,
    is_on_sale: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: "Casual Shorts",
    description: "Comfortable shorts perfect for summer activities and relaxation.",
    price: 34.99,
    original_price: 44.99,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Khaki", "Navy", "Black"],
    images: ["/placeholder.svg?height=400&width=400"],
    stock: 60,
    rating: 4.2,
    reviews_count: 78,
    is_new: false,
    is_featured: true,
    is_on_sale: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: "Elegant Handbag",
    description: "Stylish and practical handbag perfect for any occasion.",
    price: 99.99,
    original_price: null,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tan"],
    images: ["/placeholder.svg?height=400&width=400"],
    stock: 15,
    rating: 4.9,
    reviews_count: 123,
    is_new: true,
    is_featured: true,
    is_on_sale: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function getMockProducts(filters: any = {}) {
  let products = [...mockProducts]

  if (filters.category && filters.category !== "all") {
    products = products.filter((p) => p.category === filters.category)
  }

  if (filters.search) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase()),
    )
  }

  if (filters.isFeatured) {
    products = products.filter((p) => p.is_featured)
  }

  if (filters.isNew) {
    products = products.filter((p) => p.is_new)
  }

  if (filters.isOnSale) {
    products = products.filter((p) => p.is_on_sale)
  }

  if (filters.minPrice !== undefined) {
    products = products.filter((p) => p.price >= filters.minPrice)
  }

  if (filters.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= filters.maxPrice)
  }

  return products
}

export function getMockProduct(id: number) {
  return mockProducts.find((p) => p.id === id) || null
}

export function getFeaturedMockProducts() {
  return mockProducts.filter((p) => p.is_featured).slice(0, 8)
}
