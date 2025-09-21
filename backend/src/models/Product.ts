import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    stock: { type: Number, default: 0 },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
