import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

//interface for TypeScript
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  addresses: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    type: string;
    isDefault: boolean;
  }[];
  role: "user" | "admin";
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    phone: { type: String },
    addresses: [{
      fullName: { type: String, trim: true },
      phone: { type: String, trim: true },
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, default: "India", trim: true },
      type: { type: String, default: "shipping" },
      isDefault: { type: Boolean, default: false }
    }],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Pre-save: hash password automatically
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;