import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET_KEY });
  const url = req.nextUrl;

  if (url.pathname.startsWith("/dashboard")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/AdminLogin", req.url));
    }
  }

  if (url.pathname.startsWith("/cart")) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/cart"],
};
