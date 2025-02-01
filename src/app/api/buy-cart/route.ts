import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/Cart.model";
import OrdModel from "@/models/Ord.model";
import { getToken } from "next-auth/jwt";
import UserModel from "@/models/User.model"; // Import the UserModel

export async function POST(req: NextRequest) {
  try {
    await dbConnect(); // Ensure DB connection is established

    // Get the user token from the request
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    if (!token || !token.email) {
      return NextResponse.json(
        { success: false, message: "User is not logged in." },
        { status: 401 }
      );
    }

    // Retrieve the user from the database using the email from the token
    const user = await UserModel.findOne({ email: token.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const userId = user._id; // Extract userId from the user document

    // Parse request body
    const body = await req.json();
    const { address, cartItems } = body;

    if (!address || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { message: "Address and cart items are required" },
        { status: 400 }
      );
    }

    // Log cartItems to verify the structure
    console.log("Cart Items received:", cartItems);

    // Map cart items to the order item structure
    const orderItems = cartItems.map((item: any) => ({
      productId: item.productId, // Map productId from cart item
      productName: item.name, // Map name as productName
      quantity: item.quantity, // Quantity
      price: item.discounted_price, // Use discounted price (or regular price if needed)
    }));

    // Calculate the total amount for the order
    const totalAmount = cartItems.reduce((total: number, item: any) => {
      return total + item.quantity * item.discounted_price;
    }, 0);

    // Create the order first (before modifying cart)
    const order = new OrdModel({
      userId: userId,
      products: orderItems, // Use the mapped items here
      totalAmount,
      address,
      orderType: "cart",
    });

    // Save the order
    await order.save();

    // After saving the order, set a timeout to clear the cart
    setTimeout(async () => {
      try {
        // Update cart items' isBuy to true after order creation
        await CartModel.updateOne(
          { userId },
          {
            $set: {
              "items.$[].isBuy": true, // Update all items' isBuy to true
            },
          }
        );

        // Clear the cart in database (empty the cart) after 30 seconds
        await CartModel.updateOne(
          { userId },
          { $set: { items: [], totalAmount: 0 } }
        );

        console.log("Cart cleared after 30 seconds.");
      } catch (error) {
        console.error("Error clearing cart after 30 seconds:", error);
      }
    }, 30); // 30 seconds delay (30,000 milliseconds)

    return NextResponse.json(
      {
        message: "Cart purchased successfully",
        orderDetails: {
          products: orderItems, // Return the products as part of the response
          totalAmount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing checkout:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
