import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { signOut } from "./lib/auth-client";
import { cookies } from "next/headers";
import { getSession } from "./lib/get-session";

const AUTH_ROUTES = ["/login", "/register"];
const ADMIN_ROUTES = ["/dashboard/admin"];
const USER_ROUTES = ["/dashboard/user", "/my-orders"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { data: session } = await getSession();

  const cookieStore = await cookies();

  const sessionToken =
    cookieStore.get("better-auth.session_token") ||
    cookieStore.get("better-auth.session-token") ||
    cookieStore.get("__Secure-better-auth.session_token");

  // 1. If user is logged in and trying to access auth routes, redirect to home
  if (session && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If user is not logged in and trying to access protected routes, redirect to login
  const isProtectedRoute = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/my-orders") || 
    pathname.startsWith("/checkout");

  if (isProtectedRoute && (!sessionToken && !session)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If we have a session but are accessing protected routes
  if (session && isProtectedRoute) {
    const role = session.user.role;
    const status = session.user.status;

    // 3. If user is banned or inactive, log them out and redirect to home
    if (status === "BANNED" || status === "INACTIVE") {
      await signOut({ fetchOptions: { headers: request.headers } });
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 4. Protect Admin Routes
    if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/user", request.url));
      }
    }

    // 5. Protect User Routes (Optional: If admins shouldn't see user dashboard)
    if (USER_ROUTES.some((r) => pathname.startsWith(r))) {
      if (role !== "USER" && role !== "ADMIN") {
         return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/my-orders/:path*", "/checkout/:path*"],
};
