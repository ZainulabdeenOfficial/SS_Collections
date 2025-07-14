"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart } from "lucide-react"
import { useCart } from "./cart-provider"
import type { Product } from "@/lib/neon-db"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("/api/products?featured=true")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching featured products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.svg",
    })
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const minPrice = Math.min(...product.sizes.map(sz => sz.price))
            const priceDisplay = product.sizes.length > 1 ? `From Rs ${minPrice}` : `Rs ${minPrice}`
            return (
              <Card
                key={product.id}
                className="bg-white dark:bg-[#18181b] border border-border dark:border-zinc-800 rounded-xl shadow-lg transition-all group hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {product.is_new && <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>}
                  {product.is_on_sale && product.original_price && (
                    <Badge className="absolute top-2 right-2 bg-red-500">
                      Sale {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold mb-2 hover:text-blue-600 transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({product.reviews_count})</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg">{priceDisplay}</span>
                      {product.original_price && (
                        <span className="text-sm text-gray-500 line-through">Rs {product.original_price}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
                      onClick={() => window.open(`https://wa.me/923297533820?text=${encodeURIComponent('Hi! I want to buy: ' + product.name + ' (ID: ' + product.id + ') for Rs ' + product.price)}`)}
                    >
                      <span>Buy with WhatsApp</span>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/products/${product.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="text-center mt-12">
          <Link href="/products">
            <Button size="lg">View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
