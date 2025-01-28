import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect'; // Assuming dbConnect is properly set up
import UserModel from '@/models/User.model'; // Import the User model

const deleteProductFromCart = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    try {
      // Connect to the database
      await dbConnect();

      // Get user email and productId from the request body
      const { email, productId } = req.body;

      // Validate the input
      if (!email || !productId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Find the user by email
      const user = await UserModel.findOne({ email });

      // If no user is found, return an error
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Find the product index in the cart by productId
      const productIndex = user.cart.findIndex(item => item.productId.toString() === productId);

      // If the product is not found in the cart, return an error
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      // Remove the product from the cart
      user.cart.splice(productIndex, 1);

      // Save the updated user document with the modified cart
      await user.save();

      // Return the updated cart
      return res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting product from cart', error });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default deleteProductFromCart;
