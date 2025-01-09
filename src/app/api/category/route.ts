import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product.model";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log("API request received"); // Log to verify if the request is hitting here

  // Connect to the database
  await dbConnect();
  console.log("Connected to the database"); // Log to verify if the connection is successful

  // Validate category query
  const { category } = req.query;
  if (!category || typeof category !== "string") {
    return res.status(400).json({ success: false, message: "Invalid category" });
  }

  try {
    // Fetch products by category
    const products = await ProductModel.find({ category });
    console.log("Products fetched:", products);

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
}
