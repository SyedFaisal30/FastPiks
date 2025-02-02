"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

const AddressPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const productId = searchParams.get("productId");
  const initialQuantity = searchParams.get("quantity") || "1";
  const usernameFromQuery = searchParams.get("username") || session?.user?.name || "";
  const productNameFromQuery = searchParams.get("productName") || "";

  const [quantity, setQuantity] = useState<number>(parseInt(initialQuantity, 10));
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [productName, setProductName] = useState(productNameFromQuery);

  // Pre-fill user info
  const username = usernameFromQuery;
  const email = session?.user?.email || "";

  // Fetch product name if productId is available
  useEffect(() => {
    if (productId && !productNameFromQuery) {
      axios
        .get(`/api/products/${productId}`)
        .then((response) => {
          console.log("Product Data:", response.data); // Debugging
          setProductName(response.data.name);
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
          setProductName("Product not found");
        });
    }
  }, [productId, productNameFromQuery]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!address) {
      setError("Please enter your address.");
      return;
    }

    if (!productId) {
      setError("Invalid product selection.");
      return;
    }

    try {
      const orderData = {
        productId,
        address,
        quantity,
        productName, // Ensure that productName is included in the order data
      };

      console.log("Order Data to be sent:", orderData);  // Log the order data being sent

      const response = await axios.post("/api/place-order", orderData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        toast({
          title: "Order Placed Successfully",
          description: "A confirmation email has been sent.",
          variant: "default", // Optional: use "success" for success toast style
        });
        router.push("/"); // Redirect to homepage or order confirmation page
      } else {
        toast({
          title: "Order Failed",
          description: "Failed to place the order. Please try again.",
          variant: "destructive", // Optional: use "destructive" for error toast style
        });
        setError("Failed to place the order.");
      }
      
    } catch (error) {
      console.error("Error placing order:", error);
      setError("An error occurred while placing your order.");
    }
  };

  return (
    <div className="bg-off-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-4">Shipping Information</h1>

        <p className="text-lg mb-2">
          <strong>Username:</strong> {session?.user?.username}
        </p>
        <p className="text-lg mb-2">
          <strong>Email:</strong> {email}
        </p>
        <p className="text-lg mb-2">
          <strong>Product:</strong> {productName || "Loading..."}
        </p>

        <label className="text-lg font-medium mb-2">
          <strong>Quantity:</strong>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            className="border border-gray-300 rounded p-2 ml-2 w-16"
          />
        </label>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="address" className="block text-lg font-medium mb-2">
              Enter your address:
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter your address"
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressPage;
