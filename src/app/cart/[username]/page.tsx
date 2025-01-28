"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [cart, setCart] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart?username=Faisal', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setCart(data.cart);  // Assuming the response includes a `cart` field
          toast({
            title: "Cart Loaded",
            description: "Your cart has been fetched successfully",
          });
        } else {
          toast({
            title: "Failed to fetch cart",
            description: data.message || "An error occurred while fetching your cart.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast({
          title: "Error fetching cart",
          description: "Something went wrong while loading your cart.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []); // Empty dependency array to run once on mount

  if (loading) {
    return <div>Loading your cart...</div>;
  }

  return (
    <div className="p-8 space-y-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <ul>
          {cart.map((item: any) => (
            <li key={item.id} className="mb-4">
              <div className="flex justify-between items-center">
                <p>{item.name}</p>
                <p>{item.price}</p>
                {/* Add logic for quantity and delete buttons */}
              </div>
            </li>
          ))}
        </ul>
      )}
      <Button onClick={() => router.push("/checkout")}>Proceed to Checkout</Button>
    </div>
  );
}
