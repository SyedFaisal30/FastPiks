import dbConnect from "./dbConnect";
import ProductModel from "@/models/Product.model";

export const getProductsByCategory = async (category: string) => {
  await dbConnect(); // Ensure database connection
  const products = await ProductModel.find({ category }); // Use 'category' instead of 'group'
  return products;
};
