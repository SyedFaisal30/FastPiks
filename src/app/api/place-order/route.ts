import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import sendEmail from "@/helpers/buyProductsEmail";
import UserModel from "@/models/User.model";
import ProductModel from "@/models/Product.model";
import OrdModel from "@/models/Ord.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    await dbConnect(); // Ensure DB connection is established

    // Get the user token from the request
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token || !token.email) {
      return NextResponse.json({ success: false, message: "User is not logged in." }, { status: 401 });
    }

    // Retrieve the user from the database using the email from the token
    const user = await UserModel.findOne({ email: token.email });
    if (!user) {
      console.error("User not found with email:", token.email); 
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    // Extract userId from the user object
    const userId = user._id;
    console.log("User ID:", userId); // Debugging log to ensure we have the correct userId

    // Parse request body
    const body = await req.json();
    console.log("Received Order Data:", body);

    const { productId, address, quantity, productName } = body;

    // Validate required fields
    if (!productId || !address || !quantity || !productName) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    // Fetch product details from the database
    const product = await ProductModel.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    // Manually calculate the total amount (subtotal) for the order
    const subtotal = product.price * quantity;

    // Create an order object using the provided schema
    const order = new OrdModel({
      user_id: userId,  // Correct field name 'userId'
      products: [{
        product_id: product._id,  // Correct field name 'productId'
        productname: product.name,  // Correct field name 'productName'
        price: product.price,  // Ensure price is populated from the product model
        quantity,  // Use the quantity from the request
      }],
      totalAmount: subtotal,  // Set totalAmount using the manually calculated subtotal
      orderType: 'direct',  // Assuming 'direct' order type for now
      address,  // Address from the request
    });
    // Save the order to the database
    console.log("Saving order:", order);
    await order.save();

    // Send confirmation email
    await sendEmail(user.username, user.email, product.name, quantity, address, product.price);

    return NextResponse.json({ success: true, message: "Order placed successfully." }, { status: 200 });
  } catch (error) {
    console.error("Order Placement Error:", error);
    return NextResponse.json({ success: false, message: "Failed to process the order." }, { status: 500 });
  }
}
