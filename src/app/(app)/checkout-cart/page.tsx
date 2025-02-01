"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

// Define types for Cart and CartItem
type CartItem = {
  productId: string;
  name: string;
  image: string[];
  quantity: number;
  price: number;
  discounted_price: number;
  category: string;
  totalPrice: number;
};

type Cart = {
  items: CartItem[];
  totalAmount: number;
};

const CheckoutCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "unauthenticated") {
      toast({
        title: "Not Logged In",
        description: "You need to log in first to proceed with the checkout.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      if (session?.user?.id) {
        try {
          const cartRes = await axios.get(`/api/fetch-cart-products`);
          setCart(cartRes.data.cart || { items: [], totalAmount: 0 });
        } catch (error) {
          console.error("Error fetching cart:", error);
          toast({
            title: "Error",
            description: "There was an issue fetching your cart data.",
            variant: "destructive",
          });
        }
      }
    };

    fetchData();
  }, [session, status, toast, router]);

  const calculatePrices = () => {
    let totalPrice = 0;
    let totalDiscount = 0;

    if (!cart || !cart.items) return { totalPrice, discountedPrice: 0, totalDiscount };

    cart.items.forEach((product: CartItem) => {
      totalPrice += product.price * product.quantity;
      totalDiscount += (product.price - product.discounted_price) * product.quantity;
    });

    return { totalPrice, discountedPrice: totalPrice - totalDiscount, totalDiscount };
  };

  const { totalPrice, discountedPrice, totalDiscount } = cart
    ? calculatePrices()
    : { totalPrice: 0, discountedPrice: 0, totalDiscount: 0 };

  const handleCheckout = async () => {
    if (!address.trim()) {
      toast({
        title: "Address Missing",
        description: "Please enter your shipping address.",
        variant: "destructive",
      });
      return;
    }

    if (status === "unauthenticated") {
      toast({
        title: "Not Logged In",
        description: "You need to log in to proceed with the checkout.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/buy-cart", {
        address,
        cartItems: cart?.items || [],
      });

      toast({
        title: "Order Created",
        description: "Your order has been successfully placed.",
        variant: "default",
      });

      router.push("/cart");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue during checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return <p className="text-center text-gray-600 mt-10">Loading your cart details...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-6 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      {/* User Details */}
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-3xl mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">User Information</h2>
        <p className="text-gray-600"><strong>Name:</strong> {session?.user?.username}</p>
        <p className="text-gray-600"><strong>Email:</strong> {session?.user?.email}</p>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-3xl mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Order Summary</h2>

        <ul>
          {cart.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 border-b border-gray-300 py-4">
              <img src={item.image[0]} alt={item.name} className="w-20 h-20 object-cover rounded-lg shadow" />
              <div className="flex flex-col">
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-600">Price: ₹{item.discounted_price}</p>
                <p className="text-gray-600">Subtotal: ₹{item.discounted_price * item.quantity}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <p className="text-gray-800"><strong>Total Price:</strong> ₹{totalPrice}</p>
          <p className="text-gray-800"><strong>Total Discount:</strong> ₹{totalDiscount}</p>
          <p className="text-gray-800"><strong>Discounted Price:</strong> ₹{discountedPrice}</p>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-3xl mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Shipping Address</h3>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        ></textarea>
      </div>

      {/* Checkout Button */}
      <div className="flex justify-center w-full max-w-3xl">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Submit Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutCart;
