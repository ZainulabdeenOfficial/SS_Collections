"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface WishlistItem {
  id: number
  name: string
  price: number
  original_price?: number
  images: string[]
  category: string
  is_on_sale: boolean
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWishlist()
  }, [])

  const loadWishlist = async () => {
    try {
      const wishlistIds = JSON.parse(localStorage.getItem("wishlist") || "[]")

      if (wishlistIds.length === 0) {
        setLoading(false)
        return
      }

      // Fetch product details for wishlist items
      const products = await Promise.all(
        wishlistIds.map(async (id: number) => {
          const response = await fetch(`/api/products/${id}`)
          if (response.ok) {
            return response.json()
          }
          return null
        }),
      )

      setWishlistItems(products.filter(Boolean))
    } catch (error) {
      console.error("Error loading wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = (productId: number) => {
    const currentWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    const updatedWishlist = currentWishlist.filter((id: number) => id !== productId)
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))

    setWishlistItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const addToCart = (product: WishlistItem) => {
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = currentCart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      })
    }

    localStorage.setItem("cart", JSON.stringify(currentCart))

    // Trigger cart update event
    window.dispatchEvent(new Event("cartUpdated"))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-8 w-8 text-red-500 fill-current" />
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <Badge variant="secondary">{wishlistItems.length} items</Badge>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Start adding products you love to your wishlist</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <Link href={`/products/${item.id}`}>
                    <Image
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                  </Link>
                  {item.is_on_sale && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-transparent"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="font-semibold hover:text-blue-600 transition-colors line-clamp-2">{item.name}</h3>
                  </Link>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-600">Rs {item.price}</span>
                    {item.original_price && item.original_price > item.price && (
                      <span className="text-sm text-gray-500 line-through">Rs {item.original_price}</span>
                    )}
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>

                  <Button className="w-full mt-3" onClick={() => addToCart(item)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
