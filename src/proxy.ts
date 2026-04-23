import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { userServices } from "./services/user.service";

const AUTH_ROUTES = ["/login", "/register"];
const ADMIN_ROUTES = ["/dashboard/admin"];
const USER_ROUTES = ["/dashboard/user", "/my-orders"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await userServices.getSession();

  const cookieStore = await cookies();

  const sessionToken =
    cookieStore.get("urban_snacks.session_data") ||
    cookieStore.get("urban_snacks.session_token") ||
    cookieStore.get("session_token") ||
    cookieStore.get("__Secure-urban_snacks.session_data") ||
    cookieStore.get("__Secure-urban_snacks.session_token");

  // 1. If user is logged in and trying to access auth routes, redirect to home
  if (session && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If user is not logged in and trying to access protected routes, redirect to login
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/my-orders") ||
    pathname.startsWith("/checkout");

  if (isProtectedRoute && !sessionToken && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If we have a session but are accessing protected routes
  if (session && isProtectedRoute) {
    const role = session.user.role;
    const status = session.user.status;

    // 3. If user is banned or inactive, redirect to home (cannot call client signOut in middleware)
    if (status === "BANNED" || status === "INACTIVE") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 4. Protect Admin Routes — only ADMIN can access /dashboard/admin
    if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/user", request.url));
      }
    }

    // 5. Protect User Routes
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
