import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db";
connectDB();
import authRoutes from "./routes/authRoutes";


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hello Server ");
});

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
