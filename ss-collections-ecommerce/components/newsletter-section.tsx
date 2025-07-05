"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: "You've been subscribed to our newsletter.",
        })
        setEmail("")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to subscribe",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and fashion tips.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 text-black"
          />
          <Button type="submit" disabled={loading} variant="secondary">
            {loading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  )
}
