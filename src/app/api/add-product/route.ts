import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  console.log("API request received"); // Log to verify if the request is hitting here

  // Connect to the database
  await dbConnect();
  console.log("Connected to the database"); // Log to verify if the connection is successful

  try {
    const product = await ProductModel.create({
      name: "Nigga Shoes",
      price: 1000,
      discounted_price: 500,
      images: [
        "https://images-cdn.ubuy.co.id/655b5e9577442d74860aa414-fashion-running-sneaker-for-men-shoes.jpg",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/custom-nike-dunk-high-by-you-shoes.png",
      ],
      note: "This is a nice pair of shoes",
      category: "Men",
    });

    product.save();

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error occurred:" + error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}