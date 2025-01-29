// src/app/api/get-cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/Cart.model";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token) {
    return NextResponse.json({ message: "User is not logged in." }, { status: 401 });
  }

  await dbConnect();

  try {
    // Fetch the user's cart from the database using the token's user ID (token.sub)
    const cart = await CartModel.findOne({ userId: token.sub });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found." }, { status: 404 });
    }

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}