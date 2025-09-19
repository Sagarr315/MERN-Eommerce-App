import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    // Connect to MongoDB using URI from .env
    const conn = await mongoose.connect(process.env.MONGO_URI as string);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1); // stop the app if DB connection fails
  }
};

export default connectDB;
