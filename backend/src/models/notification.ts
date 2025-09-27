import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  message: string;
  type: string; // e.g., "order"
  userId: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    message: { type: String, required: true },
    type: { type: String, default: "order" },
    userId: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>("Notification", notificationSchema);
