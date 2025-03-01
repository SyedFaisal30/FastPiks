import mongoose, { Schema, Document } from "mongoose";

// Interface for Product Document
export interface Product extends Document {
  name: string; // Product name
  price: number; // Product price
  discounted_price: number; // Discounted price
  images: string[]; // Array of image URLs
  note?: string; // Optional note
  category: string; // Category (Men, Women, etc.)
  stock: number;
  createdAt: Date; // Date of creation (auto-managed by Mongoose)
  updatedAt: Date; // Date of update (auto-managed by Mongoose)
}

// Product Schema
const productSchema: Schema<Product> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    discounted_price: {
      type: Number,
      required: [true, "Discounted price is required"],
      min: [0, "Discounted price cannot be negative"],
      default: 0, // Default to 0 if no discount is applied
    },
    images: [
      {
        type: String,
        required: [true, "Product images are required"],
      },
    ],
    note: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["Men", "Women", "Kid", "Footwear", "Accessories"], // Ensure valid category
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);


// Model creation
const ProductModel = mongoose.models.Product || mongoose.model<Product>("Product", productSchema);

export default ProductModel;
