"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { FaTrashAlt } from "react-icons/fa"; // Import React Icons (Trash icon)
import data from "@/data/products.json"; // Import the product data

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
  const categories = ["Men", "Women", "Kid", "Footwear", "Accessories"];

  const [selectedCategory, setSelectedCategory] = useState<string>("");
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

  // Use the imported JSON data as the product list
  const [products, setProducts] = useState<Product[]>(data.products); // Assuming products are inside the "products" array

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Product Added:", newProduct);

    // Add the new product to the product list (in a real app, you'd also send this to a backend)
    setProducts([
      ...products,
      { ...newProduct, id: Math.random().toString(36).substring(7) },
    ]);

    // Hide the form after submission
    setShowForm(false);
    // Reset the form
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

    // Handle numeric inputs (price, discounted_price, stock)
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
      // Assuming images are URLs in the input, we push them into the `images` array
      const newImages = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      ); // For file preview purposes
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

        {/* Category Links */}
        <div className="flex justify-center gap-4 mb-6">
          {categories.map((category) => (
            <a
              key={category}
              href="#"
              onClick={(e) => {
                e.preventDefault(); // Prevent page reload
                setSelectedCategory(category);
              }}
              className={`px-2 py-2 rounded-md ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {category}
            </a>
          ))}
        </div>

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
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
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
        {selectedCategory && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {selectedCategory} Products
            </h2>
            <div className="space-y-6">
              {products
                .filter((product) => product.category === selectedCategory)
                .map((product) => (
                  <div
                    key={product.id}
                    className="relative flex flex-row sm:flex-row items-center bg-white p-4 rounded-md shadow-lg gap-[5%]"
                  >
                    {/* Delete Button for Mobile */}
                    <button
                      onClick={() => alert("Delete product functionality")}
                      className="absolute top-2 right-2 text-red-500 sm:hidden"
                    >
                      <FaTrashAlt size={20} />
                    </button>

                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-[45%] sm:w-32 h-32 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600">{product.note}</p>
                      <div className="mt-2">
                        <span className="text-xl font-bold text-gray-800">
                          ₹{product.discounted_price}
                        </span>
                        <span className="line-through text-gray-400 ml-2">
                          ₹{product.price}
                        </span>
                      </div>
                      <div className="mt-2 text-gray-600">
                        Stock: {product.stock}
                      </div>
                    </div>

                    {/* Delete Button for Desktop */}
                    <div className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 hidden sm:block">
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded-md"
                        onClick={() => alert("Delete product functionality")}
                      >
                       <FaTrashAlt size={20} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductAdmin;
