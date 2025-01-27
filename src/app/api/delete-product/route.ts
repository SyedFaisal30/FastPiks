import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/models/Product.model";
import dbConnect from "@/lib/dbConnect";

// Ensure the database connection is established before the handler
dbConnect();

// Handle DELETE method for deleting a product
export async function DELETE(req: NextRequest) {
  // Parse the id from the request body
  const { id } = await req.json(); // Get the ID from the JSON body

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error", error },
      { status: 500 }
    );
  }
}
