import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const url = request.nextUrl;

  // Public routes that should be accessible without authentication
  const isPublicRoute =
    url.pathname === "/" ||
    url.pathname === "/sign-in" ||
    url.pathname === "/sign-up" ||
    url.pathname === "/verify-code" ||
    url.pathname === "/category/[category]" || // Allow all category pages (dynamic route matching)
    url.pathname === "/cart" ||  // Cart page should be accessible without login
    url.pathname === "/checkout" || // Checkout page
    url.pathname === "/checkout-cart"; // Checkout-cart page

  // Protect the dashboard route
  const isDashboardRoute = url.pathname === "/dashboard"; 

  // If the user is authenticated and trying to access a public route (like /sign-in or /sign-up),
  // redirect them to the dashboard.
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is not authenticated and trying to access the protected dashboard route,
  // redirect them to the sign-in page.
  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url)); // Redirect to sign-in if not logged in
  }

  // If the user is authenticated but not an admin and trying to access the dashboard
  if (token && !token.isAdmin && isDashboardRoute) {
    return NextResponse.redirect(new URL("/forbidden", request.url)); // Redirect to forbidden page if not an admin
  }

  // Allow all other cases
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",    // Protect only the dashboard route
    "/sign-in",      // Protect sign-in page if logged in
    "/sign-up",      // Protect sign-up page if logged in
    "/verify-code",  // Protect verify code page if logged in
    "/category/[category]",   // Allow category pages
  ],
};
