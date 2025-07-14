"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface Profile {
  full_name?: string
  phone?: string
  role: "user" | "admin"
  avatar_url?: string
}

export interface AuthUser {
  id: string
  email: string
  profile: Profile
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (data: { email: string; password: string; fullName?: string; phone?: string }) => Promise<{
    ok: boolean
    error?: string
  }>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<{ ok: boolean; error?: string }>
  resetPassword: (token: string, password: string) => Promise<{ ok: boolean; error?: string }>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  /* -------------------------- initial session check ------------------------- */
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user ?? null)
        }
      } catch (err) {
        console.error("Auth check failed", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  /* -------------------------------- helpers -------------------------------- */

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        return { ok: true }
      }
      return { ok: false, error: data.error }
    } catch {
      return { ok: false, error: "Network error" }
    }
  }, [])

  const register = useCallback(async (info: { email: string; password: string; fullName?: string; phone?: string }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(info),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        return { ok: true }
      }
      return { ok: false, error: data.error }
    } catch {
      return { ok: false, error: "Network error" }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (err) {
      console.error("Logout failed", err)
    } finally {
      setUser(null)
      router.refresh()
    }
  }, [router])

  const forgotPassword = useCallback(async (email: string) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      return res.ok ? { ok: true } : { ok: false, error: data.error }
    } catch {
      return { ok: false, error: "Network error" }
    }
  }, [])

  const resetPassword = useCallback(async (token: string, password: string) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      return res.ok ? { ok: true } : { ok: false, error: data.error }
    } catch {
      return { ok: false, error: "Network error" }
    }
  }, [])

  /* -------------------------------- context -------------------------------- */

  const value: AuthContextValue = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAdmin: user?.profile.role === "admin"
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                        */
/* -------------------------------------------------------------------------- */

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}

// Re-export auth functions for compatibility from './auth-context' from "./auth-context"
