"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { FaTrashAlt } from "react-icons/fa"; // Import React Icons (Trash icon)
import data from "@/data/products.json"; // Import the product data
import ProductList from "./pruducts-list"; // Corrected import path

interface Product {
  id: string;
  name: string;
  price: number;
  discounted_price: number;
  images: string[]; // URLs of images
  note: string;
  category: string;
  stock: number;
}

const ProductAdmin = () => {

  const [showForm, setShowForm] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    discounted_price: 0,
    images: [] as string[], // Use image URLs (strings) for new product
    note: "",
    category: "",
    stock: 0,
  });

  const [products, setProducts] = useState<Product[]>(data.products); // Use imported JSON data

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setProducts([
      ...products,
      { ...newProduct, id: Math.random().toString(36).substring(7) },
    ]);

    setShowForm(false);

    setNewProduct({
      name: "",
      price: 0,
      discounted_price: 0,
      images: [],
      note: "",
      category: "",
      stock: 0,
    });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "price" || name === "discounted_price" || name === "stock") {
      setNewProduct((prev) => ({
        ...prev,
        [name]: value ? Number(value) : 0,
      }));
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

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
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Add New Product
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={newProduct.price || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
                  required
                />
              </div>

              <div className="flex gap-4">
                <input
                  type="number"
                  name="discounted_price"
                  placeholder="Discounted Price"
                  value={newProduct.discounted_price || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={newProduct.stock || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
                  required
                />
              </div>

              <div className="flex gap-4">
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
                >
                </select>
              </div>

              <textarea
                name="note"
                placeholder="Product Note"
                value={newProduct.note}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
              />

              <div className="flex gap-4">
                <label className="w-full">
                  Images (URLs or file upload):
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                    multiple
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-md"
              >
                Save Product
              </button>
            </form>
          </div>
        )}

        {/* Product List */}
        <ProductList />
      </div>
    </div>
  );
};

export default ProductAdmin;
