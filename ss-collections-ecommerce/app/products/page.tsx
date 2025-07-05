"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, Grid, List, Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ProductCardSkeleton } from "@/components/loading-skeleton"
import { AmazingLoader } from "@/components/amazing-loader"
import { WhatsAppContact } from "@/components/whatsapp-contact"
import { getProducts } from "@/lib/database"
import type { Product } from "@/lib/database"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([500, 5000])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [wishlist, setWishlist] = useState<number[]>([])

  const { toast } = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const minProductPrice = Math.min(...product.sizes.map(sz => sz.price))
      const matchesPrice = minProductPrice >= priceRange[0] && minProductPrice <= priceRange[1]
      const matchesSize = selectedSizes.length === 0 || product.sizes.some(sz => selectedSizes.includes(sz.size))
      const matchesColor = selectedColors.length === 0 || selectedColors.some((color) => product.colors.includes(color))

      return matchesSearch && matchesCategory && matchesPrice && matchesSize && matchesColor
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0))
        break
      default:
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
    }

    return filtered
  }, [products, searchTerm, selectedCategory, selectedSizes, selectedColors, priceRange, sortBy])

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))

    const isAdding = !wishlist.includes(productId)
    toast({
      title: isAdding ? "Added to wishlist" : "Removed from wishlist",
      description: isAdding ? "Item saved for later" : "Item removed from wishlist",
    })
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="men">Men</SelectItem>
            <SelectItem value="women">Women</SelectItem>
            <SelectItem value="unisex">Unisex</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} max={5000} min={500} step={100} className="mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Rs {priceRange[0]}</span>
          <span>Rs {priceRange[1]}</span>
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h3 className="font-semibold mb-3">Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSizes([...selectedSizes, size])
                  } else {
                    setSelectedSizes(selectedSizes.filter((s) => s !== size))
                  }
                }}
              />
              <label htmlFor={`size-${size}`} className="text-sm">
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="font-semibold mb-3">Color</h3>
        <div className="space-y-2">
          {["Black", "White", "Navy", "Red", "Blue", "Green"].map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedColors([...selectedColors, color])
                  } else {
                    setSelectedColors(selectedColors.filter((c) => c !== color))
                  }
                }}
              />
              <label htmlFor={`color-${color}`} className="text-sm">
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-4" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-64 shrink-0">
            <div className="space-y-6">
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    <div className="h-8 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="h-10 w-48 bg-muted animate-pulse rounded" />
              <div className="flex gap-2">
                <div className="h-10 w-10 bg-muted animate-pulse rounded" />
                <div className="h-10 w-10 bg-muted animate-pulse rounded" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        <p className="text-muted-foreground">Discover our complete collection of premium fashion</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <FilterContent />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Controls */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine your product search</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Search and Controls */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products Grid */}
          <div
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            }`}
          >
            {filteredProducts.map((product) => {
              const minProductPrice = Math.min(...product.sizes.map(sz => sz.price))
              const priceDisplay = product.sizes.length > 1 ? `From Rs ${minProductPrice}` : `Rs ${minProductPrice}`

              return (
                <div
                  key={product.id}
                  className={`group bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 h-48" : "aspect-[3/4]"}`}>
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.is_new && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                      {product.is_on_sale && <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>}
                    </div>

                    {/* Wishlist Button */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>

                    {/* Quick Actions */}
                    {viewMode === "grid" && (
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <WhatsAppContact />
                          <Button variant="outline" asChild>
                            <Link href={`/products/${product.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                        {product.name}
                      </Link>
                    </h3>

                    <div className="flex items-center gap-1 mb-2">
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
                      <span className="text-sm text-muted-foreground">({product.reviews_count})</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold">{priceDisplay}</span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through">Rs {product.original_price}</span>
                      )}
                    </div>

                    {product.is_on_sale && product.original_price && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        Sale {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                      </Badge>
                    )}

                    <div className="flex gap-2 mt-2">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
                        onClick={() => window.open(`https://wa.me/923297533820?text=${encodeURIComponent('Hi! I want to buy: ' + product.name + ' (ID: ' + product.id + ') for Rs ' + product.price)}`)}
                      >
                        Buy with WhatsApp
                      </Button>
                      <Button asChild variant="outline" className="flex-1">
                        <Link href={`/products/${product.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="mb-4">
                <AmazingLoader variant="pulse" size="lg" />
              </div>
              <p className="text-muted-foreground text-lg mb-4">No products found matching your criteria.</p>
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedSizes([])
                  setSelectedColors([])
                  setPriceRange([500, 5000])
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
