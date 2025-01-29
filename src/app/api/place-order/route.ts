import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import sendEmail from '@/helpers/buyProductsEmail';
import UserModel from '@/models/User.model';
import ProductModel from '@/models/Product.model';
import OrderModel from '@/models/Order.model';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token || !token.email) {
      return NextResponse.json({ success: false, message: 'User is not logged in.' }, { status: 401 });
    }

    const user = await UserModel.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    const body = await req.json();
    const { productId, address, quantity } = body;
    if (!productId || !address || !quantity) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
    }

    // **Fetch product details from MongoDB instead of relying on frontend data**
    const product = await ProductModel.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
    }

    const order = new OrderModel({
      user_id: user._id,
      products: [{ product_id: product._id, productname: product.name, quantity }],
      address,
    });

    await order.save();

    // **Send email with actual product name fetched from DB**
    await sendEmail(user.username, user.email, product.name, quantity, address);

    return NextResponse.json({ success: true, message: 'Order placed successfully.' }, { status: 200 });
  } catch (error) {
    console.error("Order Placement Error:", error);
    return NextResponse.json({ success: false, message: 'Failed to process the order.' }, { status: 500 });
  }
}
