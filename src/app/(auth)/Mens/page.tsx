'use client';
import { useState, useEffect } from "react";
import { getProductsByCategory } from "@/lib/getProductsByCategory";

// Define Product interface
interface Product {
  _id: string;
  name: string;
  price: number;
  discounted_price: number;
  images: string[];
  note?: string;
}

const MensPage = () => {
  const [mensProducts, setMensProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductsByCategory("Men");

        // Ensure the data is in the correct format
        if (response && Array.isArray(response)) {
          setMensProducts(response);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error: any) {
        setError(error.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Men's Products</h1>
      <div>
        {mensProducts.length > 0 ? (
          mensProducts.map((product) => (
            <div key={product._id}>
              <h2>{product.name}</h2>
              <p>Price: ₹{product.price}</p>
              <p>Discounted Price: ₹{product.discounted_price}</p>
              <p>{product.note}</p>
              <div>
                {product.images.map((image: string, index: number) => (
                  <img key={index} src={image} alt={`${product.name} image ${index + 1}`} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default MensPage;
