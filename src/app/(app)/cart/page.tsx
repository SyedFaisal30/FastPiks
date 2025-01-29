"use client";
import { useEffect, useState } from "react";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import axios from "axios";
import "./cart.css";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook

const CartPage = () => {
  const { data: session } = useSession(); // Initialize session
  const [cart, setCart] = useState<any>({ items: [] });
  const [loading, setLoading] = useState<boolean>(true);

  const { toast } = useToast(); // Destructure from useToast

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

  const handleIncrement = async (productId: string) => {
    try {
      const response = await axios.patch("/api/cart-handler", {
        action: "increase",
        productId,
        quantity: 1,
      });

      if (response.data.success) {
        setCart(response.data.cart);
        toast({ title: "Product quantity increased!", description: "Your cart has been updated.", variant: "default" }); // Corrected toast call
      } else {
        toast({ title: "Error updating cart", description: response.data.message, variant: "destructive" }); // Corrected toast call
      }
    } catch (error) {
      console.error("Error during increment:", error);
      toast({ title: "Error during increment", description: "There was an error while updating your cart.", variant: "destructive" }); // Corrected toast call
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
        toast({ title: "Product quantity decreased!", description: "Your cart has been updated.", variant: "default" }); // Corrected toast call
      } else {
        toast({ title: "Error updating cart", description: response.data.message, variant: "destructive" }); // Corrected toast call
      }
    } catch (error) {
      console.error("Error during decrement:", error);
      toast({ title: "Error during decrement", description: "There was an error while updating your cart.", variant: "destructive" }); // Corrected toast call
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
        toast({ title: "Product deleted", description: "The product has been removed from your cart.", variant: "default" }); // Corrected toast call
      } else {
        toast({ title: "Error deleting product", description: response.data.message, variant: "destructive" }); // Corrected toast call
      }
    } catch (error) {
      console.error("Error during deletion:", error);
      toast({ title: "Error during deletion", description: "There was an error while removing the product.", variant: "destructive" }); // Corrected toast call
    }
  };

  return (
    <>
      <Header
        username={session?.user?.username || "Guest"}
        cartCount={session?.user?.cartCount || 0}
        onProfileClick={() => console.log("Profile clicked")}
      />
      <br />
      <br />
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
            cart.items.map((product: any) => (
              <div key={product.productId} className="productItem">
                <div className="slidesDetail">
                  {product.image && product.image.length > 0 ? (
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="slideDetail"
                    />
                  ) : (
                    <div>No Image Available</div>
                  )}
                </div>
                <div className="detail">
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
            ))
          )}
          <div className="totalAmount">
            <h3>Total Amount: ₹{cart.totalAmount}</h3>
          </div>
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
