"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, User, LogOut, Eye } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-400">Manage your SS Collections store</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">3</Badge>
          </Button>

          {/* View Store */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
          >
            <Link href="/" target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              View Store
            </Link>
          </Button>

          {/* Admin Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-slate-300 hover:text-white">
                <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm">{user?.user_metadata?.full_name || user?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
              <DropdownMenuItem className="text-slate-300 hover:text-white">
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem onClick={signOut} className="text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
