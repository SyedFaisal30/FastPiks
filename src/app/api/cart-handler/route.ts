import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // Import getToken to get the JWT token
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/Cart.model";
import { CartItem } from "@/models/Cart.model"; // Import CartItem interface if needed

export async function updateCart(req: NextRequest, userId: string) {
  await dbConnect();

  const { action, productId, quantity } = await req.json();
  const cart = await CartModel.findOne({ userId });

  if (!cart) {
    return NextResponse.json({ message: "Cart not found." }, { status: 404 });
  }

  // Find the product in the cart
  const itemIndex = cart.items.findIndex((item: CartItem) => item.productId.toString() === productId);

  if (itemIndex === -1) {
    return NextResponse.json({ message: "Product not found in cart." }, { status: 404 });
  }

  const item = cart.items[itemIndex];

  switch (action) {
    case "increase":
      item.quantity += quantity;
      item.totalPrice = item.price * item.quantity; // Update total price
      break;
    case "decrease":
      if (item.quantity > 1) {
        item.quantity -= quantity;
        item.totalPrice = item.price * item.quantity; // Update total price
      }
      break;
    case "delete":
      cart.items.splice(itemIndex, 1); // Remove item from cart
      break;
    default:
      return NextResponse.json({ message: "Invalid action." }, { status: 400 });
  }

  // Recalculate the totalAmount
  cart.totalAmount = cart.items.reduce((sum: number, item: CartItem) => sum + item.totalPrice, 0);

  await cart.save();

  return NextResponse.json({ success: true, cart }, { status: 200 });
}

export async function PATCH(req: NextRequest) {
  // Get the token from the request headers using getToken
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.sub) {
    return NextResponse.json({ success: false, message: "User not authenticated." }, { status: 401 });
  }

  // Use the userId from the token (token.sub) for the cart update
  return updateCart(req, token.sub); // token.sub is now guaranteed to be a string
}
