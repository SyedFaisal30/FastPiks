import mongoose, { Schema, Document } from 'mongoose';

// Order Item Interface (for each product in the order)
interface OrderItem {
  product_id: mongoose.Schema.Types.ObjectId;
  productname: string;
  quantity: number;
}

// Order Interface
export interface Order extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  products: OrderItem[];
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order Schema
// Order Schema
const orderSchema: Schema<Order> = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true,
      },
      productname: {  // Change from 'productname' to 'productName'
        type: String,
        ref: 'Product', // Reference to the Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // Ensure at least one product is ordered
      },
    },
  ],
  address: {
    type: String,
    required: true,
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


// Order Model
const OrderModel = mongoose.models.Order || mongoose.model<Order>('Order', orderSchema);

export default OrderModel;