"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart, ArrowLeft, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { WhatsAppContact } from "@/components/whatsapp-contact"
import { getProduct } from "@/lib/database"
import type { Product } from "@/lib/database"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (productId) {
      loadProduct()
    }
  }, [productId])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const data = await getProduct(productId)
      setProduct(data)
      if (data.sizes.length > 0) setSelectedSize(data.sizes[0]?.size || "")
      if (data.colors.length > 0) setSelectedColor(data.colors[0])
    } catch (error) {
      console.error("Error loading product:", error)
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? "Item removed from wishlist" : "Item saved for later",
    })
  }

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this amazing product: ${product.name}`,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied",
          description: "Product link copied to clipboard",
        })
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-muted animate-pulse rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-12 bg-muted animate-pulse rounded" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>
    )
  }

  const selectedSizeObj = product.sizes.find(sz => sz.size === selectedSize) || product.sizes[0]

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.is_new && <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">New</Badge>}
            {product.is_on_sale && product.original_price && (
              <Badge className="absolute top-4 right-4 bg-red-500 text-white text-base px-3 py-1 rounded-full shadow-lg">
                Sale {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews_count} reviews)</span>
              </div>
              <Badge variant="outline">{product.category}</Badge>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mb-4">
                <label className="block font-semibold mb-1">Select Size:</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((sz) => (
                      <SelectItem key={sz.size} value={sz.size}>
                        {sz.size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Price Display */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold">Rs {selectedSizeObj.price}</span>
              {product.original_price && (
                <span className="text-xl text-muted-foreground line-through">Rs {product.original_price}</span>
              )}
              {product.is_on_sale && product.original_price && (
                <Badge className="bg-red-500">Save Rs {(product.original_price - selectedSizeObj.price).toFixed(0)}</Badge>
              )}
            </div>
          </div>

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {product.colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <WhatsAppContact />

            <div className="flex gap-3">
              <Button variant="outline" onClick={toggleWishlist} className="flex-1 bg-transparent">
                <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews_count})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description ||
                    "Experience premium quality and style with this carefully crafted piece from SS Collections. Made with attention to detail and using the finest materials, this item represents the perfect blend of comfort, durability, and fashion-forward design."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Product Details</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        <span className="font-medium">Category:</span> {product.category}
                      </li>
                      <li>
                        <span className="font-medium">Available Sizes:</span> {product.sizes.map(sz => sz.size).join(", ")}
                      </li>
                      <li>
                        <span className="font-medium">Available Colors:</span> {product.colors.join(", ")}
                      </li>
                      <li>
                        <span className="font-medium">Stock:</span> {product.stock} items available
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Care Instructions</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Machine wash cold with like colors</li>
                      <li>• Do not bleach</li>
                      <li>• Tumble dry low</li>
                      <li>• Iron on low heat if needed</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No reviews yet</p>
                  <p className="text-sm text-muted-foreground">
                    Be the first to review this product! Contact us via WhatsApp after your purchase.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-3 shadow-lg"
          onClick={() => window.open(`https://wa.me/923297533820?text=${encodeURIComponent('Hi! I want to buy: ' + product.name + ' (ID: ' + product.id + ') for Rs ' + selectedSizeObj.price + (selectedSize ? ' Size: ' + selectedSize : ''))}`)}
        >
          Buy with WhatsApp
        </Button>
        <Button asChild variant="outline" className="flex-1 text-lg py-3">
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    </div>
  )
}
