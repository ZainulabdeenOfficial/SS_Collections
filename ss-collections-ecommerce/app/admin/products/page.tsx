"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Product } from "@/lib/neon-db"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    category: "",
    sizes: [] as { size: string; price: string }[],
    colors: [] as string[],
    images: [] as string[],
    stock: "",
    rating: "0",
    reviews_count: "0",
    is_new: false,
    is_featured: false,
    is_on_sale: false,
    show_on_user_side: true,
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      original_price: "",
      category: "",
      sizes: [],
      colors: [],
      images: [],
      stock: "",
      rating: "0",
      reviews_count: "0",
      is_new: false,
      is_featured: false,
      is_on_sale: false,
      show_on_user_side: true,
    })
    setEditingProduct(null)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || "",
      category: product.category,
      sizes: product.sizes.map((size) => ({ size: size.size, price: size.price.toString() })),
      colors: product.colors,
      images: product.images,
      stock: product.stock.toString(),
      rating: product.rating.toString(),
      reviews_count: product.reviews_count.toString(),
      is_new: product.is_new,
      is_featured: product.is_featured,
      is_on_sale: product.is_on_sale,
      show_on_user_side: product.show_on_user_side,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products"

      const method = editingProduct ? "PUT" : "POST"

      const sizes = formData.sizes.map(sz => ({ size: sz.size, price: Number(sz.price) }))

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, sizes }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Product ${editingProduct ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        resetForm()
        loadProducts()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save product",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
        loadProducts()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Products Management</h1>
          <p className="text-slate-400">Manage your product catalog</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription className="text-slate-400">
                {editingProduct ? "Update product information" : "Create a new product"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-slate-200">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-slate-200">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-200">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price" className="text-slate-200">
                    Price *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="original_price" className="text-slate-200">
                    Original Price
                  </Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="stock" className="text-slate-200">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-200">Sizes & Prices *</Label>
                {formData.sizes.map((sz, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Size (e.g. S, M, L)"
                      value={sz.size}
                      onChange={e => {
                        const sizes = [...formData.sizes]
                        sizes[idx].size = e.target.value
                        setFormData({ ...formData, sizes })
                      }}
                      className="bg-slate-700 border-slate-600 text-white w-24"
                      required
                    />
                    <Input
                      placeholder="Price"
                      type="number"
                      value={sz.price}
                      onChange={e => {
                        const sizes = [...formData.sizes]
                        sizes[idx].price = e.target.value
                        setFormData({ ...formData, sizes })
                      }}
                      className="bg-slate-700 border-slate-600 text-white w-32"
                      required
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => {
                      setFormData({ ...formData, sizes: formData.sizes.filter((_, i) => i !== idx) })
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setFormData({ ...formData, sizes: [...formData.sizes, { size: "", price: "" }] })}>
                  <Plus className="h-4 w-4 mr-1" /> Add Size
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                  />
                  <Label htmlFor="is_new" className="text-slate-200">
                    New
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured" className="text-slate-200">
                    Featured
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_on_sale"
                    checked={formData.is_on_sale}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_on_sale: checked })}
                  />
                  <Label htmlFor="is_on_sale" className="text-slate-200">
                    On Sale
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show_on_user_side"
                    checked={formData.show_on_user_side}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_on_user_side: checked })}
                  />
                  <Label htmlFor="show_on_user_side" className="text-slate-200">
                    Visible
                  </Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    resetForm()
                  }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingProduct ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {products.map((product) => (
          <Card key={product.id} className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{product.name}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {product.category} • Stock: {product.stock}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="border-red-600 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="text-2xl font-bold text-white">Rs {product.price}</span>
                  {product.original_price && (
                    <span className="text-lg text-slate-400 line-through">Rs {product.original_price}</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  {product.is_new && <Badge className="bg-green-600">New</Badge>}
                  {product.is_featured && <Badge className="bg-purple-600">Featured</Badge>}
                  {product.is_on_sale && <Badge className="bg-red-600">Sale</Badge>}
                  {!product.show_on_user_side && <Badge variant="outline">Hidden</Badge>}
                </div>
              </div>
              {product.description && <p className="text-slate-300 mt-2 line-clamp-2">{product.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="text-center py-12">
            <p className="text-slate-400 text-lg">No products found</p>
            <p className="text-slate-500">Create your first product to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
