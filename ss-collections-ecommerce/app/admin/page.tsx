"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Package, Users, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react"
import { Database } from "@/lib/neon-db"

// Sample data for charts
const salesData = [
  { month: "Jan", sales: 4000, orders: 240 },
  { month: "Feb", sales: 3000, orders: 198 },
  { month: "Mar", sales: 5000, orders: 300 },
  { month: "Apr", sales: 4500, orders: 278 },
  { month: "May", sales: 6000, orders: 389 },
  { month: "Jun", sales: 5500, orders: 349 },
]

const categoryData = [
  { name: "Men", value: 400, color: "#8884d8" },
  { name: "Women", value: 300, color: "#82ca9d" },
  { name: "Unisex", value: 200, color: "#ffc658" },
]

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const data = await Database.getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      case "shipped":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400">Welcome to your SS Collections admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-slate-400">
              <span className="text-green-400">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-slate-400">
              <span className="text-green-400">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Products</CardTitle>
            <Package className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.totalProducts}</div>
            <p className="text-xs text-slate-400">
              <span className="text-green-400">+5</span> new this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Active Users</CardTitle>
            <Users className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-slate-400">
              <span className="text-green-400">+15%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Sales Overview</CardTitle>
            <CardDescription className="text-slate-400">Monthly sales and order trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Bar dataKey="sales" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Category Distribution</CardTitle>
            <CardDescription className="text-slate-400">Sales by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Orders</CardTitle>
          <CardDescription className="text-slate-400">Latest customer orders requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">No recent orders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.recentOrders.slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-white">#{order.id.slice(-8)}</p>
                      <p className="text-sm text-slate-400">
                        {order.items?.length || 0} items • ${order.total?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getStatusColor(order.status || "pending")}>
                      {(order.status || "pending").charAt(0).toUpperCase() + (order.status || "pending").slice(1)}
                    </Badge>
                    <span className="text-sm text-slate-400">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Alert */}
      <Card className="bg-slate-800 border-slate-700 border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            Security Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300">
          <p className="text-sm">
            This admin panel is secured and only accessible to authorized administrators. All admin activities are
            logged for security purposes. Never share your admin credentials.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
