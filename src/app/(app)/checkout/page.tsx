"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

// Wrapper component with Suspense
const AddressPageWrapper = () => {
  return (
    <Suspense fallback={
      <div className="bg-off-white min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <AddressPage />
    </Suspense>
  );
};

const AddressPage = () => {
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
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill user info
  const username = usernameFromQuery;
  const email = session?.user?.email || "";

  // Fetch product name if productId is available
  useEffect(() => {
    if (productId && !productNameFromQuery) {
      setIsLoading(true);
      axios
        .get(`/api/products/${productId}`)
        .then((response) => {
          setProductName(response.data.name);
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
          setProductName("Product not found");
          toast({
            title: "Error",
            description: "Failed to fetch product details",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [productId, productNameFromQuery, toast]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation checks
    if (!address.trim()) {
      setError("Please enter your address.");
      setIsLoading(false);
      return;
    }

    if (!productId) {
      setError("Invalid product selection.");
      setIsLoading(false);
      return;
    }

    try {
      const orderData = {
        productId,
        address,
        quantity,
        productName,
        username,
        email,
      };

      const response = await axios.post("/api/place-order", orderData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        toast({
          title: "Success!",
          description: "Your order has been placed successfully.",
          variant: "default",
        });
        router.push("/"); // Or wherever you want to redirect after success
      } else {
        throw new Error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive",
      });
      setError("An error occurred while placing your order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-off-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-6">Shipping Information</h1>

        <div className="space-y-4 mb-6">
          <p className="text-lg">
            <span className="font-semibold">Username:</span> {username || "Not available"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Email:</span> {email || "Not available"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Product:</span>{" "}
            {isLoading ? "Loading..." : productName || "Not available"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="quantity" className="block text-lg font-medium mb-2">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              className="w-24 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-lg font-medium mb-2">
              Shipping Address:
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter your complete shipping address"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressPageWrapper;