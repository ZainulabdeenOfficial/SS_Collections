"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, ShoppingCart, Menu, Heart, LogOut } from "lucide-react"
import { useCart } from "./cart-provider"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const { items, total } = useCart()
  const { user, logout } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  return (
    <header className="backdrop-blur bg-white/80 dark:bg-zinc-900/80 shadow-md border-b border-border dark:border-zinc-800 sticky top-0 z-50 transition-all">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="font-bold text-xl">SS Collections</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors" scroll={false} passHref>
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors" scroll={false} passHref>
            Products
          </Link>
          <Link href="/products?category=men" className="text-sm font-medium hover:text-primary transition-colors" scroll={false} passHref>
            Men
          </Link>
          <Link href="/products?category=women" className="text-sm font-medium hover:text-primary transition-colors" scroll={false} passHref>
            Women
          </Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-sm mx-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </form>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle className="ml-4 rounded-full border border-border dark:border-zinc-700 shadow-sm p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition" />

          {/* Wishlist */}
          <Link href="/wishlist" scroll={false} passHref>
            <Button variant="ghost" size="sm" className="relative">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          {/* Cart */}
          <Link href="/cart" scroll={false} passHref>
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {items.length}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm hidden md:block">Hello, {user.full_name || user.email}</span>
              {user.role === "admin" && (
                <Link href="/admin" scroll={false} passHref>
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login" scroll={false} passHref>
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register" scroll={false} passHref>
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-lg font-medium" scroll={false} passHref>
                  Home
                </Link>
                <Link href="/products" className="text-lg font-medium" scroll={false} passHref>
                  Products
                </Link>
                <Link href="/products?category=men" className="text-lg font-medium" scroll={false} passHref>
                  Men
                </Link>
                <Link href="/products?category=women" className="text-lg font-medium" scroll={false} passHref>
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
                  <Button type="submit" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
