'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import data from '@/data/products.json'; // Import JSON data
import './CategoryPage.css'; // Ensure this file is properly styled
import { FaCartPlus, FaShoppingBag } from 'react-icons/fa'; // Import icons from react-icons
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link'; // Import Link from next

const CategoryPage: React.FC = () => {
  const { category } = useParams(); // Extract category from the route
  const products = data.products.filter((product) => product.category === category); // Filter products by category

  const [currentImageIndexes, setCurrentImageIndexes] = useState(
    products.reduce((acc, product) => {
      acc[product.id] = 0; // Initialize image index for each product
      return acc;
    }, {} as Record<string, number>)
  );

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

  const handleAddToCart = (productId: string) => {
    // Implement logic for adding to cart
    console.log(`Product with ID ${productId} added to cart`);
  };

  const handleBuyNow = (productId: string) => {
    // Implement logic for buying now
    console.log(`Buying product with ID ${productId}`);
  };

  const handleProfileClick = () => {
    // Implement the logic when the profile is clicked (e.g., toggle dropdown, show profile settings, etc.)
    console.log("Profile clicked");
  };

  return (
    <>

      <Header username="Faisal" cartCount={3} onProfileClick={handleProfileClick} />
      <br />
      <br />
      {/* Navigation Links */}
      <nav className="categoryNav">
        <ul>
          <li><Link href="/category/Men">Men</Link></li>
          <li><Link href="/category/Women">Women</Link></li>
          <li><Link href="/category/Kids">Kids</Link></li>
          <li><Link href="/category/Footwear">Footwear</Link></li>
          <li><Link href="/category/Accessories">Accessories</Link></li>
        </ul>
      </nav>
      <div className="productWrapper">
        {products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="productItem">
              <div className="slidesDetail">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className={`slideDetail ${currentImageIndexes[product.id] === index ? 'active' : ''}`}
                  />
                ))}

                <button
                  className="prevDetail"
                  onClick={() => handlePrevSlide(product.id, product.images.length)}
                >
                  &#10094;
                </button>
                <button
                  className="nextDetail"
                  onClick={() => handleNextSlide(product.id, product.images.length)}
                >
                  &#10095;
                </button>
              </div>
              <div className="detail">
                <h2>{product.name}</h2>
                <p>
                  <del>₹{product.price}</del> <b>₹{product.discounted_price}</b>
                </p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <p><strong>Note:</strong> {product.note}</p>

                <div className="productActions">
                  <button onClick={() => handleAddToCart(product.id)} className="addToCartBtn">
                    <FaCartPlus color="#333" /> Add to Cart
                  </button>
                  <button onClick={() => handleBuyNow(product.id)} className="buyNowBtn">
                    <FaShoppingBag color="#333" /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
        <Footer></Footer>
    </>
  );
};

export default CategoryPage;
