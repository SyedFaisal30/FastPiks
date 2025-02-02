import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/Cart.model";
import OrdModel from "@/models/Ord.model";  // Importing the updated OrdModel
import { getToken } from "next-auth/jwt";
import UserModel from "@/models/User.model"; // Import the UserModel
import sendCartEmail from "@/helpers/cartEmail"; // Import sendCartEmail function

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

    // Map cart items to the order item structure based on your model
    const orderItems = cartItems.map((item: any) => ({
      product_id: item.productId, // Map productId from cart item
      productname: item.name,    // Map name as productName
      quantity: item.quantity,  // Quantity
      price: item.discounted_price, // Use discounted price (or regular price if needed)
    }));

    // Create the order object based on the provided order model structure
    const order = new OrdModel({
      user_id: userId, // Ensure 'userId' is correctly passed here
      products: orderItems,  // Products array, mapped correctly
      address,  // The address for the order
      orderType: "cart",  // You are handling a cart order
    });

    // Calculate the total amount of the order based on the order items
    // order.calculateTotalAmount();

    // Save the order to the database
    await order.save();

    // Send cart order confirmation email after the order is saved
    await sendCartEmail(user.username, user.email, orderItems, address, order.totalAmount);

    // Clear the cart after the order is placed
    await CartModel.updateOne(
      { userId },
      { $set: { items: [], totalAmount: 0 } }
    );

    return NextResponse.json(
      {
        message: "Cart purchased successfully",
        orderDetails: {
          products: orderItems, // Return the products as part of the response
          totalAmount: order.totalAmount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing checkout:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
