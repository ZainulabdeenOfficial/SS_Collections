"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function AdminDashboardPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace("/admin/login")
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/admin/dashboard")
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
        setRecentOrders(data.recentOrders)
      }
    }
    fetchStats()
  }, [])

  if (!user || !isAdmin) return null

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      {stats ? (
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded shadow p-4">
            <div className="text-gray-500">Total Products</div>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-gray-500">Total Users</div>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-gray-500">Total Orders</div>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-gray-500">Total Revenue</div>
            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
          </div>
        </div>
      ) : (
        <div>Loading stats...</div>
      )}
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
      <div className="bg-white rounded shadow p-4">
        {recentOrders.length === 0 ? (
          <div>No recent orders.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user_id}</td>
                  <td>${order.total}</td>
                  <td>{order.status}</td>
                  <td>{order.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
} 