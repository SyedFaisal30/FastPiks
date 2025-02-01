import mongoose, { Schema, Document } from 'mongoose';

// Order Item Interface (for each product in the order)
interface OrderItem {
  productId: mongoose.Schema.Types.ObjectId;
  productName: string;  // 'productName' in camelCase
  quantity: number;
  price: number;  // Added price field for tracking the price of individual items
}

// Order Interface
export interface Order extends Document {
  userId: mongoose.Schema.Types.ObjectId;  // Renamed to 'userId' to be consistent
  products: OrderItem[];
  totalAmount: number;  // Total amount for the entire order
  orderType: 'direct' | 'cart';  // New field to differentiate direct purchase vs cart purchase
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order Schema
const orderSchema: Schema<Order> = new Schema(
  {
    userId: {  // Consistent with 'userId' in the interface
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    products: [
      {
        productId: {  // 'productId' instead of 'product_id' for consistency
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // Reference to the Product model
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Ensure at least one product is ordered
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderType: {
      type: String,
      enum: ['direct', 'cart'], // 'direct' for single product, 'cart' for multiple products
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

// Method to calculate the total amount of the order
orderSchema.methods.calculateTotalAmount = function () {
  this.totalAmount = this.products.reduce(
    (total: any, item: any) => total + item.quantity * item.price,
    0
  );
  return this.totalAmount;
};

// Order Model
const OrdModel = mongoose.models.Order || mongoose.model<Order>('Order', orderSchema);

export default OrdModel;
