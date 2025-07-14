"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, ShoppingCart, Menu, Heart, LogOut, User, Crown } from "lucide-react"
import { useCart } from "./cart-provider"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "./theme-toggle"
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const { items, total } = useCart()
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
      window.location.href = "/"
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="backdrop-blur bg-white/90 dark:bg-zinc-900/90 shadow-lg border-b border-border dark:border-zinc-800 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
            SS Collections
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors duration-200 relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors duration-200 relative group">
            Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link href="/products?category=men" className="text-sm font-medium hover:text-primary transition-colors duration-200 relative group">
            Men
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link href="/products?category=women" className="text-sm font-medium hover:text-primary transition-colors duration-200 relative group">
            Women
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-10 rounded-full border-2 focus:border-primary transition-colors duration-200"
            />
          </div>
        </form>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          <div className="rounded-full border border-border dark:border-zinc-700 shadow-sm p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-200">
            <ThemeToggle />
          </div>

          {/* Wishlist */}
          <Link href="/wishlist">
            <Button variant="ghost" size="sm" className="relative hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="relative hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600">
                  {items.length}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Hello, {user.full_name || user.email.split('@')[0]}</span>
              </div>
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                    <Crown className="h-4 w-4 mr-1" />
                    Admin
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors duration-200">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur">
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <div className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    SS Collections
                  </div>
                </div>
                
                <nav className="flex flex-col space-y-4 flex-1">
                  <Link href="/" className="text-lg font-medium hover:text-primary transition-colors duration-200 py-2">
                    Home
                  </Link>
                  <Link href="/products" className="text-lg font-medium hover:text-primary transition-colors duration-200 py-2">
                    Products
                  </Link>
                  <Link href="/products?category=men" className="text-lg font-medium hover:text-primary transition-colors duration-200 py-2">
                    Men
                  </Link>
                  <Link href="/products?category=women" className="text-lg font-medium hover:text-primary transition-colors duration-200 py-2">
                    Women
                  </Link>

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="flex space-x-2 pt-4">
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>

                  {/* Mobile User Actions */}
                  <div className="pt-6 space-y-3">
                    <Link href="/wishlist" className="flex items-center space-x-3 text-lg font-medium hover:text-primary transition-colors duration-200 py-2">
                      <Heart className="h-5 w-5" />
                      <span>Wishlist</span>
                    </Link>
                    <Link href="/cart" className="flex items-center space-x-3 text-lg font-medium hover:text-primary transition-colors duration-200 py-2">
                      <ShoppingCart className="h-5 w-5" />
                      <span>Cart</span>
                      {items.length > 0 && (
                        <Badge className="ml-auto bg-red-500 hover:bg-red-600">
                          {items.length}
                        </Badge>
                      )}
                    </Link>
                  </div>
                </nav>

                {/* Mobile User Menu */}
                <div className="border-t pt-6">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{user.full_name || user.email}</span>
                      </div>
                      {user.role === "admin" && (
                        <Link href="/admin" className="block">
                          <Button variant="outline" size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hover:from-purple-700 hover:to-pink-700">
                            <Crown className="h-4 w-4 mr-2" />
                            Admin Panel
                          </Button>
                        </Link>
                      )}
                      <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/login" className="block">
                        <Button variant="outline" size="sm" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" className="block">
                        <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
