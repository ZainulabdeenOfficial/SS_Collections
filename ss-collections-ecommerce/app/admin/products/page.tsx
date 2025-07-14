"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function AdminProductsPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace("/admin/login")
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/admin/products")
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products)
      }
    }
    fetchProducts()
  }, [])

  if (!user || !isAdmin) return null

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => router.push("/admin/products/new")}
      >
        Add Product
      </button>
      <div className="bg-white rounded shadow p-4">
        {products.length === 0 ? (
          <div>No products found.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded"
                      onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded"
                      onClick={async () => {
                        await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" })
                        setProducts(products.filter((p) => p.id !== product.id))
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
