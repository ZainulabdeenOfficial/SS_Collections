import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg shadow-sm border border-border dark:border-zinc-700 bg-white dark:bg-zinc-800 text-base transition-all focus:ring-2 focus:ring-primary/40 dark:focus:ring-primary-dark/60 focus:border-primary dark:focus:border-primary-dark",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
