import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  images?: string[];
  stock: number;
  category: mongoose.Types.ObjectId; // reference to Category
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

    //  Link to category (main/subcategory)
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
