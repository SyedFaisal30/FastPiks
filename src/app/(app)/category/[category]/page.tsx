"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaCartPlus, FaShoppingBag } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import axios from "axios";
import "./CategoryPage.css";

interface Product {
  _id: string;
  name: string;
  price: number;
  discounted_price: number;
  stock: number;
  note: string;
  images: string[];
}

interface ApiResponse {
  success: boolean;
  message: Product[];
}

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get<ApiResponse>(`/api/products/${category}`);
        if (response.data.success) {
          setProducts(response.data.message);

          const indexes = response.data.message.reduce(
            (acc, product) => ({ ...acc, [product._id]: 0 }),
            {}
          );
          setCurrentImageIndexes(indexes);
        } else {
          setError("Failed to fetch products.");
        }
      } catch (err) {
        console.error(err);
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
      [productId]: prevIndexes[productId] === 0 ? totalImages - 1 : prevIndexes[productId] - 1,
    }));
  };

  const handleNextSlide = (productId: string, totalImages: number) => {
    setCurrentImageIndexes((prevIndexes) => ({
      ...prevIndexes,
      [productId]: (prevIndexes[productId] + 1) % totalImages,
    }));
  };

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      const response = await axios.post('/api/add-to-cart', 
        { productId, quantity }, 
        { headers: { 'Content-Type': 'application/json' } }
      );
      toast({ title: "Product added to cart", description: "Successfully added." });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({ title: "Error", description: "Failed to add product to cart." });
    }
  };

  const handleBuyNow = async (productId: string) => {
    try {
      // Check if the user is logged in
      if (!session?.user) {
        toast({
          title: "Login Required",
          description: "Please log in to complete the purchase.",
        });
        return;
      }

      // Fetch product details
      const product = products.find((prod) => prod._id === productId);
      if (!product) {
        toast({
          title: "Product Not Found",
          description: "This product is unavailable.",
        });
        return;
      }

      // Redirect to the checkout page with product details
      router.push(
        `/checkout?productId=${product._id}&quantity=1&productName=${encodeURIComponent(
          product.name
        )}&price=${product.discounted_price}`
      );
      

      toast({
        title: "Redirecting to Checkout",
        description: "Please provide your address to complete the purchase.",
      });
    } catch (error) {
      console.error("Error during Buy Now:", error);
      toast({
        title: "Error",
        description: "Failed to initiate direct purchase.",
      });
    }
  };

  const calculateDiscountPercentage = (price: number, discounted_price: number) => {
    return ((price - discounted_price) / price) * 100;
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Header/>
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
          <div className="h-[60vh] flex items-center justify-center text-xl text-gray-500">
            No products available right now, but new products will be added soon!
          </div>
        ) : (
          products.map((product) => {
            const discountPercentage = calculateDiscountPercentage(product.price, product.discounted_price);
            return (
              <div key={product._id} className="productItem">
                <div className="slidesDetail">
                  {product.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className={`slideDetail ${
                        currentImageIndexes[product._id] === index ? "active" : ""
                      }`}
                    />
                  ))}
                  <button
                    className="prevDetail"
                    onClick={() => handlePrevSlide(product._id, product.images.length)}
                  >
                    &#10094;
                  </button>
                  <button
                    className="nextDetail"
                    onClick={() => handleNextSlide(product._id, product.images.length)}
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
                      onClick={() => handleAddToCart(product._id, 1)}
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