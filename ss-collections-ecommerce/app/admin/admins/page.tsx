"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Database } from "@/lib/neon-db"
import { UserPlus, Trash2, Shield, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AuthUtils } from "@/lib/auth-utils"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAdminData, setNewAdminData] = useState({
    email: "",
    password: "",
    fullName: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadAdmins()
  }, [])

  const loadAdmins = async () => {
    try {
      // This would need to be implemented in the Database class
      // For now, we'll use a placeholder
      setAdmins([])
    } catch (error) {
      console.error("Error loading admins:", error)
      toast({
        title: "Error",
        description: "Failed to load admin users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Hash password
      const passwordHash = await AuthUtils.hashPassword(newAdminData.password)

      // Create admin user
      const user = await Database.createUser({
        email: newAdminData.email,
        password_hash: passwordHash,
        full_name: newAdminData.fullName,
        role: "admin",
      })

      toast({
        title: "Success",
        description: "Admin user created successfully",
      })

      setNewAdminData({ email: "", password: "", fullName: "" })
      setIsAddDialogOpen(false)
      loadAdmins()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create admin user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAdmin = async (adminId: string, email: string) => {
    try {
      // Update role to user instead of deleting
      await Database.updateUser(adminId, { role: "user" })

      toast({
        title: "Success",
        description: `${email} is no longer an admin`,
      })

      loadAdmins()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove admin privileges",
        variant: "destructive",
      })
    }
  }

  if (loading && admins.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Admin Users</h1>
        </div>
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Users</h1>
          <p className="text-slate-400">Manage administrator accounts</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Admin</DialogTitle>
              <DialogDescription className="text-slate-400">
                Create a new administrator account with full access to the admin panel.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-200">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={newAdminData.fullName}
                  onChange={(e) => setNewAdminData({ ...newAdminData, fullName: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                  minLength={6}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                  {loading ? "Creating..." : "Create Admin"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Administrator Accounts</CardTitle>
          <CardDescription className="text-slate-400">
            {admins.length} admin user{admins.length !== 1 ? "s" : ""} with full system access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">No admin users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{admin.full_name || "No name"}</h3>
                      <p className="text-sm text-slate-400">{admin.email}</p>
                      <p className="text-xs text-slate-500">Added {new Date(admin.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge className="bg-purple-600 text-white">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-400 hover:bg-red-600 bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-800 border-slate-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Remove Admin Access</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            Are you sure you want to remove admin privileges from {admin.email}? They will become a
                            regular user but their account will not be deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-slate-600 text-slate-300">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove Admin Access
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Security Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-400">
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 mt-0.5 text-purple-400" />
            <p>Admin users have full access to all system functions and data.</p>
          </div>
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 mt-0.5 text-purple-400" />
            <p>The admin panel is only accessible via direct URL and requires admin authentication.</p>
          </div>
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 mt-0.5 text-purple-400" />
            <p>Removing admin access converts the user to a regular customer account.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
