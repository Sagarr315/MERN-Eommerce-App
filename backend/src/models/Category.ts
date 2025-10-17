import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;              // e.g., "Saree", "Silk Saree"
  parentCategory?: mongoose.Types.ObjectId | null; // null for main category
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    parentCategory: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", categorySchema);
