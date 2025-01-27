import { useState, ChangeEvent, FormEvent } from "react";

interface AddProductProps {
  categories: string[]; // Pass categories as props
}

const AddProductForm: React.FC<AddProductProps> = ({ categories }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    discounted_price: 0,
    images: [] as File[], // Use File array for images
    note: "",
    category: "",
    stock: 0,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "discounted_price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files); // Store file objects directly
      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price.toString());
    formData.append("discounted_price", newProduct.discounted_price.toString());
    formData.append("note", newProduct.note);
    formData.append("category", newProduct.category);
    formData.append("stock", newProduct.stock.toString());

    // Append all images to FormData
    newProduct.images.forEach((image) => {
      formData.append("images", image); // appending image files to the formData
    });

    try {
      const response = await fetch("/api/add-product", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        alert("Product added successfully!");
        // Reset form or show success message
        setNewProduct({
          name: "",
          price: 0,
          discounted_price: 0,
          images: [],
          note: "",
          category: "",
          stock: 0,
        });
      } else {
        alert(result.message || "Error adding product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    }
  };

  return (
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
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
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
          Images:
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            multiple
          />
        </label>
      </div>

      <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md">
        Save Product
      </button>
    </form>
  );
};

export default AddProductForm;
