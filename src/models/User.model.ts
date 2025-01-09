import mongoose, { Schema, Document } from "mongoose";

// Interface for Cart Item
export interface CartItem extends Document {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  addedAt: Date;
}

// Interface for User Document
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  cart: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Cart Item Schema
const CartItemSchema: Schema<CartItem> = new Schema({
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
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// User Schema
const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code expiry is required"],
  },
  cart: [CartItemSchema], // Array of cart items
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the `updatedAt` field before saving
UserSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;
