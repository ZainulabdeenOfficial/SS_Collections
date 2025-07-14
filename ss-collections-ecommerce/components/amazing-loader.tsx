"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AmazingLoaderProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "spinner" | "dots" | "pulse" | "wave" | "fashion"
  className?: string
  text?: string
}

export function AmazingLoader({ size = "md", variant = "fashion", className, text }: AmazingLoaderProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (text) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
      }, 500)
      return () => clearInterval(interval)
    }
  }, [text])

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <div className={cn("animate-spin rounded-full border-2 border-muted border-t-primary", sizeClasses[size])} />
        {text && (
          <p className="text-sm text-muted-foreground font-medium">
            {text}
            {dots}
          </p>
        )}
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-primary rounded-full animate-bounce",
                size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-5 h-5",
              )}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        {text && (
          <p className="text-sm text-muted-foreground font-medium">
            {text}
            {dots}
          </p>
        )}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <div className={cn("bg-primary rounded-full animate-pulse", sizeClasses[size])} />
        {text && (
          <p className="text-sm text-muted-foreground font-medium">
            {text}
            {dots}
          </p>
        )}
      </div>
    )
  }

  if (variant === "wave") {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-primary animate-pulse",
                size === "sm" ? "w-1 h-4" : size === "md" ? "w-1 h-6" : size === "lg" ? "w-2 h-8" : "w-2 h-10",
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
        {text && (
          <p className="text-sm text-muted-foreground font-medium">
            {text}
            {dots}
          </p>
        )}
      </div>
    )
  }

  // Fashion variant - default
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <div className={cn("rounded-full border-4 border-muted animate-spin", sizeClasses[size])}>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse" />
        </div>
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
        />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground font-medium text-center">
          {text}
          {dots}
        </p>
      )}
    </div>
  )
}

export function PageLoader({ text = "Loading SS Collections" }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <AmazingLoader variant="fashion" size="xl" text={text} />
      </div>
    </div>
  )
}

export function AdminPageLoader({ text = "Loading Admin Panel" }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <AmazingLoader variant="fashion" size="xl" text={text} className="text-white" />
      </div>
    </div>
  )
}
