import type React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
}

export function ProductCardSkeleton() {
  return (
    <div className="group bg-background rounded-2xl overflow-hidden shadow-sm">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  )
}

export function OrderSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  )
}

export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full bg-slate-600" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-slate-600" />
              <Skeleton className="h-3 w-24 bg-slate-600" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-6 w-16 bg-slate-600" />
            <Skeleton className="h-8 w-8 bg-slate-600" />
          </div>
        </div>
      ))}
    </div>
  )
}
