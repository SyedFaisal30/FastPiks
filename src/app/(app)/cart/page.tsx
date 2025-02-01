"use client";
import { useEffect, useState } from "react";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import axios from "axios";
import "./cart.css";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook
import { useRouter } from "next/navigation"; // Use next/navigation's useRouter for client-side navigation

const CartPage = () => {
  const { data: session } = useSession(); // Initialize session
  const [cart, setCart] = useState<any>({ items: [] });
  const [loading, setLoading] = useState<boolean>(true);

  const { toast } = useToast(); // Destructure from useToast
  const router = useRouter(); // Using the useRouter from next/navigation

  // Fetch user's cart from the API
  useEffect(() => {
    const fetchCart = async () => {
      if (session?.user) {
        try {
          const response = await axios.get("/api/fetch-cart-products");
          setCart(response.data.cart);
        } catch (error) {
          console.error("Error fetching cart:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // Stop loading if not logged in
      }
    };

    fetchCart();
  }, [session]);

  // Calculate total price, discounted price, and saved amount
  const calculatePrices = () => {
    let totalPrice = 0;
    let totalDiscount = 0;

    cart.items.forEach((product: any) => {
      totalPrice += product.price * product.quantity;
      totalDiscount += (product.price - product.totalPrice) * product.quantity;
    });

    const discountedPrice = totalPrice - totalDiscount;

    return {
      totalPrice,
      discountedPrice,
      totalDiscount,
    };
  };

  const { totalPrice, discountedPrice, totalDiscount } = calculatePrices();

  const handleIncrement = async (productId: string) => {
    try {
      const response = await axios.patch("/api/cart-handler", {
        action: "increase",
        productId,
        quantity: 1,
      });

      if (response.data.success) {
        setCart(response.data.cart);
        toast({
          title: "Product quantity increased!",
          description: "Your cart has been updated.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error updating cart",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during increment:", error);
      toast({
        title: "Error during increment",
        description: "There was an error while updating your cart.",
        variant: "destructive",
      });
    }
  };

  const handleDecrement = async (productId: string) => {
    try {
      const response = await axios.patch("/api/cart-handler", {
        action: "decrease",
        productId,
        quantity: 1,
      });

      if (response.data.success) {
        setCart(response.data.cart);
        toast({
          title: "Product quantity decreased!",
          description: "Your cart has been updated.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error updating cart",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during decrement:", error);
      toast({
        title: "Error during decrement",
        description: "There was an error while updating your cart.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const response = await axios.patch("/api/cart-handler", {
        action: "delete",
        productId,
      });

      if (response.data.success) {
        setCart(response.data.cart);
        toast({
          title: "Product deleted",
          description: "The product has been removed from your cart.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error deleting product",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during deletion:", error);
      toast({
        title: "Error during deletion",
        description: "There was an error while removing the product.",
        variant: "destructive",
      });
    }
  };

  // Handle the "Buy Whole Cart" action
  const handleBuyWholeCart = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Not Logged In",
        description: "You need to log in to proceed with purchasing.",
        variant: "destructive",
      });
      router.push("/sign-in"); // Redirect to login page if not logged in
      return;
    }

    // Instead of making an API call here, redirect to the checkout page
    router.push("/checkout-cart");
  };

  return (
    <>
      <Header />
      <br />
      <br />
      <div className="pricingInfo flex flex-col md:flex-row justify-center items-center space-x-4 p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <p className="text-xl font-semibold text-gray-900">
            Total Price: ₹{totalPrice}
          </p>
          <p className="text-lg font-medium text-green-600">
            Discounted Price: ₹{discountedPrice}
          </p>
          <p className="text-md font-normal text-red-500">
            You Save: ₹{totalDiscount}
          </p>
        </div>
      </div>

      {session?.user ? (
        <div className="productWrapper">
          {loading ? (
            <div className="h-[60vh] flex items-center justify-center text-xl text-gray-500">
              Loading your cart...
            </div>
          ) : cart.items.length === 0 ? (
            <div className="h-[60vh] flex items-center justify-center text-xl text-gray-500">
              Your cart is empty! Add some products to your cart.
            </div>
          ) : (
            <>
              {cart.items.map((product: any) => (
                <div
                  key={product.productId}
                  className="productItem flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 p-4 border-b border-gray-200"
                >
                  <div className="slidesDetail">
                    {product.image && product.image.length > 0 ? (
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="slideDetail w-32 h-32 object-cover"
                      />
                    ) : (
                      <div>No Image Available</div>
                    )}
                  </div>
                  <div className="detail flex-1">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <div className="flex items-center space-x-4">
                      <p className="flex items-center space-x-2">
                        <del className="text-gray-500">₹{product.price}</del>
                        <b>₹{product.totalPrice}</b>
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleDecrement(product.productId)}
                        className="quantityBtn"
                      >
                        <FaMinus />
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        onClick={() => handleIncrement(product.productId)}
                        className="quantityBtn"
                      >
                        <FaPlus />
                      </button>
                      <button
                        onClick={() => handleDelete(product.productId)}
                        className="deleteBtn"
                      >
                        <FaTrash color="red" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Button to buy the whole cart */}
              <div className="w-full flex justify-center mt-6">
                <button
                  onClick={handleBuyWholeCart}
                  className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                >
                  Checkout Cart
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="h-[60vh] flex items-center justify-center text-xl text-gray-500">
          Please log in to add products to your cart.
        </div>
      )}
    </>
  );
};

export default CartPage;
