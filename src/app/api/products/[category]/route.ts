import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product.model";

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  await dbConnect();

  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  console.log("Decoded category ", decodedCategory);

  try {
    // Query the database for products in the specified category
    const products = await ProductModel.find({ category: decodedCategory }).exec();
    return Response.json(
      {
        success: true,
        message: products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("An error occurred while fetching Products", error);
    return Response.json(
      {
        success: false,
        message: "Error Fetching products",
      },
      { status: 500 }
    );
  }
}
