import mongoose, { Schema, Document } from "mongoose";

// Interface for Cart Item
interface CartItem {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number; // Price of the product at the time it was added to the cart
  totalPrice: number; // Calculated as `quantity * price`
}

// Interface for Cart Document
export interface Cart extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  items: CartItem[];
  totalPrice: number; // Total price of all items in the cart
  createdAt: Date;
  updatedAt: Date;
}

// Cart Item Schema
const cartItemSchema = new Schema<CartItem>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

// Cart Schema
const cartSchema = new Schema<Cart>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One cart per user
  },
  items: [cartItemSchema], // Array of cart items
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` before saving
cartSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<Cart>("Cart", cartSchema);