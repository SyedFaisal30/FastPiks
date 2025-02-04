"use client";
import { useState } from "react";
import AddProductForm from "./add-products"; // Import the AddProductForm
import ProductList from "./pruducts-list"; // Correct import path

const ProductAdmin = () => {
  const [showForm, setShowForm] = useState<boolean>(false)
  const categories = ["Men", "Women", "Kid", "Footwear", "Accessories"];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Admin Product Management
        </h1>

        {/* Add Product Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-green-500 text-white rounded-md"
          >
            {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <AddProductForm categories={categories} />
        )}

        {/* Product List */}
        <ProductList />
      </div>
    </div>
  );
};

export default ProductAdmin;
