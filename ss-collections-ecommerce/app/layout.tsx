import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { WhatsAppFloatingButton } from "@/components/whatsapp-contact"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SS Collections - Premium Fashion Brand",
  description: "Discover the latest trends in fashion with SS Collections. Premium quality clothing for men and women.",
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
            <AuthProvider>
              <CartProvider>
                <Header />
                <main>{children}</main>
                <Footer />
                <WhatsAppFloatingButton />
                <Toaster />
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
