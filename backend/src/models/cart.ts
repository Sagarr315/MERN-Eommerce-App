import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICartProduct {
  productId: Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  products: ICartProduct[];
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<ICart>("Cart", cartSchema);