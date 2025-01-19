import mongoose, { Schema, Document } from "mongoose";

export interface CartItem extends Document {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  addedAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  cart: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

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

const UserSchema : Schema<User> = new Schema({
  username:{
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
  cart: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;