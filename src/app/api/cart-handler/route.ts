import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/Cart.model";
import ProductModel from "@/models/Product.model";
import { CartItem } from "@/models/Cart.model";
import { getToken } from "next-auth/jwt"; // Import getToken to extract the token

// This is the PATCH handler for updating the cart
export async function PATCH(req: NextRequest) {
  try {
    // Extract the token from the request (this will give us the userId)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.sub) {
      // If no token or user ID is available, return an error
      return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
    }

    const userId = token.sub; // Extract the userId from the token

    await dbConnect();

    const { action, productId, quantity } = await req.json();

    // Find the cart for the given user
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found." }, { status: 404 });
    }

    // Fetch the product details (including discounted price) from the Product model
    const product = await ProductModel.findById(productId);
    if (!product || !product.discounted_price) {
      return NextResponse.json({ message: "Product or discounted price not found." }, { status: 404 });
    }

    // Find the product in the cart
    const itemIndex = cart.items.findIndex((item: CartItem) => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return NextResponse.json({ message: "Product not found in cart." }, { status: 404 });
    }

    const item = cart.items[itemIndex];

    // Update the discounted_price with the product's discounted_price
    item.discounted_price = product.discounted_price; // Fallback to regular price if missing
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
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json({ message: "Error updating cart" }, { status: 500 });
  }
}
