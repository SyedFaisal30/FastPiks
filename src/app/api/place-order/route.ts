import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import sendEmail from "@/helpers/buyProductsEmail";
import UserModel from "@/models/User.model";
import ProductModel from "@/models/Product.model";
import OrderModel from "@/models/Order.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token || !token.email) {
      return NextResponse.json({ success: false, message: "User is not logged in." }, { status: 401 });
    }

    const user = await UserModel.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    const body = await req.json();
    console.log("Received Order Data:", body);

    const { productId, address, quantity, productName } = body;

    // Validate required fields
    if (!productId || !address || !quantity || !productName) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    // Fetch product details
    const product = await ProductModel.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    // Check if product fields are present
    if (!product._id || !product.name || !product.price) {
      return NextResponse.json({ success: false, message: "Product is missing necessary fields." }, { status: 400 });
    }

    // Create an order object
    const order = new OrderModel({
      user_id: user._id,  // Make sure you're using 'user_id'
      products: [{
        product_id: product._id,  // Use the correct product ID from the database
        productname: product.name,  // Use the correct product name from the database
        price: product.price,  // Ensure product price is populated
        quantity,  // Use the quantity from the request
      }],
      address,  // Address from the request
    });

    // Save the order to the database
    await order.save();

    // Send confirmation email
    await sendEmail(user.username, user.email, product.name, quantity, address);

    return NextResponse.json({ success: true, message: "Order placed successfully." }, { status: 200 });
  } catch (error) {
    console.error("Order Placement Error:", error);
    return NextResponse.json({ success: false, message: "Failed to process the order." }, { status: 500 });
  }
}
