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
    url.pathname === "/products"; // Adding a generic public page

  // Protected routes that require authentication
  const isProtectedRoute = [
    "/api/cart", // Adding product to the cart route
  ].some((protectedPath) => url.pathname.startsWith(protectedPath));

  // If the user is authenticated and trying to access a public route,
  // redirect them to the dashboard (or other logged-in page)
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is not authenticated and trying to access a protected route,
  // redirect them to the sign-in page
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow all other cases
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",          // Home page
    "/sign-in",    // Sign-in page
    "/sign-up",    // Sign-up page
    "/products",   // Example public product page
    "/api/cart",   // Protected route for cart
  ],
};
