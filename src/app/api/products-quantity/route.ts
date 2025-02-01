import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect'; // Ensure dbConnect is properly set up
import UserModel from '@/models/User.model'; // Import the User model

const updateCartQuantity = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    try {
      // Connect to the database
      await dbConnect();

      // Get user email, product ID, and the updated quantity from the request body
      const { email, productId, quantity } = req.body;

      // Validate the input
      if (!email || !productId || quantity === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Find the user by email
      const user = await UserModel.findOne({ email });

      // If no user is found, return an error
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Find the product in the user's cart by product ID
      const productIndex = user.cart.findIndex((item: any) => item.productId.toString() === productId);

      // If the product is not in the cart, return an error
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      // Ensure discounted_price is set, if missing use price as fallback
      user.cart[productIndex].discounted_price = user.cart[productIndex].discounted_price || user.cart[productIndex].price;

      // Update the product's quantity and recalculate the total price
      user.cart[productIndex].quantity = quantity;
      user.cart[productIndex].totalPrice = user.cart[productIndex].price * quantity;

      // Save the updated user document with the modified cart
      await user.save();

      // Return the updated cart
      return res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating cart', error });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default updateCartQuantity;
