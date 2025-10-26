import mongoose, { Document, Schema } from "mongoose";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface IOrderProduct {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number; 
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  customerInfo: {
    name: string;
    email: string;
    shippingAddress: {
      fullName: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  products: IOrderProduct[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderProductSchema = new Schema<IOrderProduct>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customerInfo: {
      name: { type: String, trim: true },
      email: { type: String, trim: true },
      shippingAddress: {
        fullName: { type: String, trim: true },
        phone: { type: String, trim: true },
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zipCode: { type: String, trim: true },
        country: { type: String, default: "India", trim: true }
      }
    },
    products: { type: [OrderProductSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;