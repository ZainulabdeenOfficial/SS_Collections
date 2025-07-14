import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Admin routes protection
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // For now, just check if token exists
    // In production, you'd verify the JWT and check admin role
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth pages
  if (["/login", "/register"].includes(pathname)) {
    const token = request.cookies.get("auth-token")?.value
    if (token) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Allow admin login page
  if (pathname === "/admin/login") {
    const token = request.cookies.get("auth-token")?.value
    if (token) {
      // If already authenticated, redirect to admin dashboard
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
