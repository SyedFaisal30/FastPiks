import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // Import getToken to get the JWT token
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/Cart.model";
import ProductModel from "@/models/Product.model";  // Import Product model
import { CartItem } from "@/models/Cart.model"; // Import CartItem interface if needed

// Function to update cart
export async function updateCart(req: NextRequest, userId: string) {
  await dbConnect();

  const { action, productId, quantity } = await req.json();
  const cart = await CartModel.findOne({ userId });

  if (!cart) {
    return NextResponse.json({ message: "Cart not found." }, { status: 404 });
  }

  // Fetch the product details (including discounted price) from the Product model
  const product = await ProductModel.findById(productId);
  if (!product) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  // Find the product in the cart
  const itemIndex = cart.items.findIndex((item: CartItem) => item.productId.toString() === productId);

  if (itemIndex === -1) {
    return NextResponse.json({ message: "Product not found in cart." }, { status: 404 });
  }

  const item = cart.items[itemIndex];

  // Update the discounted_price with the product's discounted_price
  item.discounted_price = product.discounted_price;
  item.totalPrice = item.discounted_price * item.quantity; // Update total price based on discounted price

  // Perform action (increase, decrease, delete)
  switch (action) {
    case "increase":
      item.quantity += quantity;
      item.totalPrice = item.discounted_price * item.quantity; // Update total price
      break;
    case "decrease":
      if (item.quantity > 1) {
        item.quantity -= quantity;
        item.totalPrice = item.discounted_price * item.quantity; // Update total price
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

  // Calculate cart count (total items in cart)
  const cartCount = cart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);

  await cart.save();

  // Return the updated cart and the cart count
  return NextResponse.json({ success: true, cart, cartCount }, { status: 200 });
}

// PATCH method to handle the request and pass the token
export async function PATCH(req: NextRequest) {
  // Get the token from the request headers using getToken
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.sub) {
    return NextResponse.json({ success: false, message: "User not authenticated." }, { status: 401 });
  }

  // Use the userId from the token (token.sub) for the cart update
  return updateCart(req, token.sub); // token.sub is now guaranteed to be a string
}
