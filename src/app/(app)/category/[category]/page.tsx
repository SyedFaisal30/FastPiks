"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "./CategoryPage.css";
import { FaCartPlus, FaShoppingBag } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

// Define Product interface
interface Product {
  _id: string;
  name: string;
  price: number;
  discounted_price: number;
  stock: number;
  note: string;
  images: string[];
}

// Define API response interface
interface ApiResponse {
  success: boolean;
  message: Product[];
}

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>(); // Typed useParams
  const [products, setProducts] = useState<Product[]>([]); // Typed state for products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndexes, setCurrentImageIndexes] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products/${category}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Response Status ", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json(); // Typed API response
        console.log("Response data ", data);

        if (data.success && Array.isArray(data.message)) {
          setProducts(data.message);

          // Initialize image indexes for each product
          const indexes = data.message.reduce(
            (acc: Record<string, number>, product) => {
              acc[product._id] = 0;
              return acc;
            },
            {}
          );
          setCurrentImageIndexes(indexes);
        } else {
          setError("Failed to fetch products");
        }
      } catch (error) {
        console.error("An Error Occurred While Fetching Products", error);
        setError("An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handlePrevSlide = (productId: string, totalImages: number) => {
    setCurrentImageIndexes((prevIndexes) => ({
      ...prevIndexes,
      [productId]:
        prevIndexes[productId] === 0
          ? totalImages - 1
          : prevIndexes[productId] - 1,
    }));
  };

  const handleNextSlide = (productId: string, totalImages: number) => {
    setCurrentImageIndexes((prevIndexes) => ({
      ...prevIndexes,
      [productId]: (prevIndexes[productId] + 1) % totalImages,
    }));
  };

  const handleAddToCart = (productId: string) => {
    console.log(`Product with ID ${productId} added to cart`);
  };

  const handleBuyNow = (productId: string) => {
    console.log(`Buying product with ID ${productId}`);
  };

  const calculateDiscountPercentage = (
    price: number,
    discounted_price: number
  ) => {
    return ((price - discounted_price) / price) * 100;
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Header username="Faisal" cartCount={3} onProfileClick={() => {}} />
      <br />
      <br />
      <nav className="categoryNav">
        <ul>
          <li>
            <Link href="/category/Men">Men</Link>
          </li>
          <li>
            <Link href="/category/Women">Women</Link>
          </li>
          <li>
            <Link href="/category/Kid">Kids</Link>
          </li>
          <li>
            <Link href="/category/Footwear">Footwear</Link>
          </li>
          <li>
            <Link href="/category/Accessories">Accessories</Link>
          </li>
        </ul>
      </nav>
      <div className="productWrapper">
        {products.length === 0 ? (
          <div className="h-[60vh]">
            <p className="h-[100%] flex items-center justify-center text-xl text-gray-500">
              No products available right now, but new products will be added
              soon!
            </p>
          </div>
        ) : (
          products.map((product) => {
            const discountPercentage = calculateDiscountPercentage(
              product.price,
              product.discounted_price
            );
            return (
              <div key={product._id} className="productItem">
                <div className="slidesDetail">
                  {product.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className={`slideDetail ${
                        currentImageIndexes[product._id] === index
                          ? "active"
                          : ""
                      }`}
                    />
                  ))}

                  <button
                    className="prevDetail"
                    onClick={() =>
                      handlePrevSlide(product._id, product.images.length)
                    }
                  >
                    &#10094;
                  </button>
                  <button
                    className="nextDetail"
                    onClick={() =>
                      handleNextSlide(product._id, product.images.length)
                    }
                  >
                    &#10095;
                  </button>
                </div>
                <div className="detail">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                  <div className="flex items-center space-x-4">
                    <p className="flex items-center space-x-2">
                      <del className="text-gray-500">₹{product.price}</del>
                      <b>₹{product.discounted_price}</b>
                    </p>
                    <p className="discountPercentage bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                      {discountPercentage.toFixed(0)}% Off
                    </p>
                  </div>
                  <p>
                    <strong>Stock:</strong> {product.stock}
                  </p>
                  <p>
                    <strong>Note:</strong> {product.note}
                  </p>
                  <div className="productActions">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="addToCartBtn"
                    >
                      <FaCartPlus color="#333" /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product._id)}
                      className="buyNowBtn"
                    >
                      <FaShoppingBag color="#333" /> Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
