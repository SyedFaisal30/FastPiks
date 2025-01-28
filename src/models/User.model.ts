import mongoose, { Schema, Document } from "mongoose";

export interface CartItem {
  productId: mongoose.Schema.Types.ObjectId;
  name:string;
  quantity: number;
  price: number;
  totalPrice: number;  // Added totalPrice here for the CartItem
  addedAt: Date
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  cart: CartItem[];
  calculateTotalPrice(): number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<CartItem>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true
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
  isAdmin: {
    type: Boolean,
    default: false,
  },
  cart: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.calculateTotalPrice = function (): number {
  return this.cart.reduce((total:any, item: any) => total + item.totalPrice, 0);
};

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;