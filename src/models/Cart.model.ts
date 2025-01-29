import mongoose, { Schema, Document } from "mongoose";

// Define CartItem type
export interface CartItem {
  productId: mongoose.Schema.Types.ObjectId;
  name: string;
  image: string[];  // Array to store image URLs
  quantity: number;
  price: number;
  discounted_price:number
  category: string;
  totalPrice: number;
  isBuy: boolean;
}

interface Cart extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Reference to User model
  items: CartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the CartItem schema
// Define the CartItem schema without URL validation
const cartItemSchema = new Schema<CartItem>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",  // Reference to the Product model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: [
    {
      type: String,
      required: true,  // Store an array of image URLs without validation
    },
  ],
  quantity: {
    type: Number,
    required: true,
    min: 1, // Ensures quantity is at least 1
  },
  price: {
    type: Number,
    required: true,
  },
  discounted_price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
    enum: ["Men", "Women", "Kid", "Footwear", "Accessories"],
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  isBuy: {
    type: Boolean,
    default: false, // Default is not purchased
  },
});


// Define the Cart schema
const cartSchema: Schema<Cart> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    items: [cartItemSchema], // Array of CartItems
    totalAmount: {
      type: Number,
      required: true,
      default: 0, // Default to 0 if no items are added
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Pre-save hook to recalculate totalAmount whenever items are updated
cartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce((sum: number, item: CartItem) => sum + item.totalPrice, 0);
  next();
});

// Create or use the existing Cart model
const CartModel = mongoose.models.Cart || mongoose.model<Cart>("Cart", cartSchema);

export default CartModel;
