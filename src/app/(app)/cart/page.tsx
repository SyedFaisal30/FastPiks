"use client";
import { useEffect, useState } from "react";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import axios from "axios";
import "./cart.css"; 

const CartPage = () => {
  const [cart, setCart] = useState<any>({ items: [] });
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user's cart from the API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("/api/fetch-cart-products");
        setCart(response.data.cart);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleIncrement = (productId: string) => {
    const updatedCart = { ...cart };
    const product = updatedCart.items.find((item: any) => item.productId === productId);
    if (product) {
      product.quantity += 1;
      product.totalPrice = product.quantity * product.price;
      updatedCart.totalAmount = updatedCart.items.reduce((total: number, item: any) => total + item.totalPrice, 0);
      setCart(updatedCart);
    }
  };

  const handleDecrement = (productId: string) => {
    const updatedCart = { ...cart };
    const product = updatedCart.items.find((item: any) => item.productId === productId);
    if (product && product.quantity > 1) {
      product.quantity -= 1;
      product.totalPrice = product.quantity * product.price;
      updatedCart.totalAmount = updatedCart.items.reduce((total: number, item: any) => total + item.totalPrice, 0);
      setCart(updatedCart);
    }
  };

  const handleDelete = (productId: string) => {
    const updatedCart = { ...cart };
    updatedCart.items = updatedCart.items.filter((item: any) => item.productId !== productId);
    updatedCart.totalAmount = updatedCart.items.reduce((total: number, item: any) => total + item.totalPrice, 0);
    setCart(updatedCart);
  };

  return (
    <div className="productWrapper">
      {loading ? (
        <div className="h-[60vh] flex items-center justify-center text-xl text-gray-500">Loading your cart...</div>
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
  );
};

export default CartPage;
