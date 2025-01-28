import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/dbConnect"; // Your DB connection
import UserModel from "@/models/User.model"; // Your User model
import ProductModel from "@/models/Product.model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return res.status(401).json({ message: "User is not logged in. Please log in to add items to the cart." });
    }

    await dbConnect();

    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    try {
      // Find the logged-in user
      const user = await UserModel.findById(token.sub);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Fetch product details from the database using the productId
      const product = await ProductModel.findById(productId); // Replace with your Product model
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      // Destructure required fields from the product
      const { name, price } = product;

      // Check if the product is already in the user's cart
      const existingItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);
      if (existingItemIndex > -1) {
        user.cart[existingItemIndex].quantity += quantity;
        user.cart[existingItemIndex].totalPrice += price * quantity;
      } else {
        user.cart.push({
          productId,
          name, // Add product name for convenience
          quantity,
          price,
          totalPrice: price * quantity,
          addedAt: new Date(),
        });
      }

      // Save the updated cart to the database
      await user.save();
      return res.status(200).json({ message: "Product added to cart", cart: user.cart });
    } catch (error) {
      console.error("Error adding to cart:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
}
