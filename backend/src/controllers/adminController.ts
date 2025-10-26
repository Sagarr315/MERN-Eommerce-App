import { Request, Response } from "express";
import User from "../models/User";
import Order from "../models/Order";

// GET all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    return res.json({ users });
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET user by ID with addresses (for checkout)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reqUser = (req as any).user;

    // Allow user to fetch own data or admin to fetch any
    if (reqUser.role !== "admin" && reqUser.id !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User deleted" });
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Analytics (orders count + total sales)
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    return res.json({ totalOrders, totalSales });
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
