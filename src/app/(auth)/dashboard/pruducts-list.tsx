"use client";

import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  discounted_price: number;
  images: string[];
  note: string;
  category: string;
  stock: number;
}

interface ApiResponse {
  success: boolean;
  message: Product[];
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const fetchProducts = async (category: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${category}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setProducts(data.message);
      } else {
        setError("Failed to fetch products.");
      }
    } catch (err) {
      console.error("An error occurred while fetching products", err);
      setError("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

  const calculateDiscountPercentage = (
    price: number,
    discounted_price: number
  ) => {
    return ((price - discounted_price) / price) * 100;
  };

  const categories = ["Men", "Women", "Kid", "Footwear", "Accessories"];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Product List
        </h1>

        {/* Category Links */}
        <div className="flex justify-center gap-4 mb-6">
          {categories.map((category) => (
            <a
              key={category}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory(category); // Set category when clicked
              }}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {category}
            </a>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <div className="text-center text-red-500">{error}</div>
        )}

        {/* Product List */}
        {!loading && !error && selectedCategory && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {selectedCategory} Products
            </h2>
            <div className="space-y-6">
              {products.length > 0 ? (
                products.map((product, index) => {
                  const discountPercentage = calculateDiscountPercentage(
                    product.price,
                    product.discounted_price
                  );
                  return (
                    <div
                      key={product.id || `product-${index}`} // Use `product.id` or fallback to an index-based key
                      className="flex items-center bg-white p-4 rounded-md shadow-lg gap-4"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-32 h-32 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {product.name}
                        </h3>
                        <p className="text-gray-600">
                          Price:{" "}
                          <s className="text-red-600">₹{product.price}</s> ₹
                          {product.discounted_price}
                        </p>

                        <p
                          className={`${
                            discountPercentage > 0
                              ? "text-green-600"
                              : "text-red-600"
                          } font-semibold`}
                        >
                          {discountPercentage > 0
                            ? `You save ${discountPercentage.toFixed(2)}%`
                            : "No discount available"}
                        </p>
                        <p className="text-gray-500">{product.note}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500">
                  No products found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
