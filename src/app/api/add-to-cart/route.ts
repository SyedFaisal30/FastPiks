import dbConnect from "@/lib/dbConnect";
import { getToken } from "next-auth/jwt";
import ProductModel from "@/models/Product.model";
import CartModel from "@/models/Cart.model";
import { CartItem } from "@/models/Cart.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    // Get the token from the request
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json(
            {
                success: false,
                message: "User is not logged in.",
            },
            { status: 401 }
        );
    }

    await dbConnect();

    try {
        const { productId, quantity } = await req.json();

        // Validate input
        if (!productId || typeof quantity !== 'number' || quantity <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product ID or quantity.",
                },
                { status: 400 }
            );
        }

        // Find the product by its ID
        const product = await ProductModel.findById(productId);
        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found.",
                },
                { status: 404 }
            );
        }

        // Extract product details (excluding stock)
        const { name, price, discounted_price, images, category } = product;

        // Prepare the product data to be added to the cart
        const cartProduct: CartItem = {
            productId,
            name,
            image: images,  // Store all images
            quantity,
            price,
            totalPrice: (discounted_price || price) * quantity,  // Calculate total price
            category,
            isBuy: false, // Default to not purchased
        };

        // Find the user's cart
        let cart = await CartModel.findOne({ userId: token.sub });

        if (!cart) {
            cart = new CartModel({ userId: token.sub, items: [], totalAmount: 0 });
        }

        // Check if the product already exists in the cart
        const existingItemIndex = cart.items.findIndex((item: CartItem) => item.productId.toString() === productId);

        if (existingItemIndex > -1) {
            // If the product already exists, update its quantity and total price
            cart.items[existingItemIndex].quantity += quantity;
            cart.items[existingItemIndex].totalPrice += cartProduct.totalPrice;
        } else {
            // Add the new product to the cart
            cart.items.push(cartProduct);
        }

        // Update the total amount for the cart
        cart.totalAmount = cart.items.reduce((total: number, item: CartItem) => total + item.totalPrice, 0);

        // Save the cart
        await cart.save();

        return NextResponse.json(
            {
                success: true,
                message: "Product added to cart successfully",
                cart,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during adding to cart:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error during adding product to cart",
            },
            { status: 500 }
        );
    }
}
