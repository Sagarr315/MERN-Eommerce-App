import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order";
import Product from "../models/Product";
import Notification from "../models/notification"; 

const buildOrderProducts = async (items: { productId: string; quantity: number }[]) => {
  const result: { productId: mongoose.Types.ObjectId; quantity: number; price: number }[] = [];

  for (const it of items) {
    if (!mongoose.isValidObjectId(it.productId)) {
      throw new Error(`Invalid productId: ${it.productId}`);
    }

    const prod = await Product.findById(it.productId).select("price");
    if (!prod) {
      throw new Error(`Product not found: ${it.productId}`);
    }

    result.push({
      productId: new mongoose.Types.ObjectId(it.productId),
      quantity: it.quantity,
      price: prod.price,
    });
  }

  return result;
};

// POST make the order 
export const createOrder = async (req: Request, res: Response) => {
  try {
    // authenticated user set by protect middleware
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { products } = req.body as { products: { productId: string; quantity: number }[] };

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products are required" });
    }

    // build product entries with current price
    const orderProducts = await buildOrderProducts(products);

    // compute total
    const totalAmount = orderProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const order = await Order.create({
      userId: user.id,
      products: orderProducts,
      totalAmount,
      status: "pending",
    });

       // reduce stock for each ordered product
    for (const item of orderProducts) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    //  create notification for admin
    await Notification.create({
      message: `New order placed by user ${user.id}`,
      type: "order",
      userId: user.id,
    });

    const populated = await Order.findById(order._id).populate("products.productId");

    return res.status(201).json({ message: "Order created", order: populated });
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message || err });
  }
};

// GET /api/orders/:userId  (user or admin)
export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const reqUser = (req as any).user;
    const { userId } = req.params;

    // allow user to fetch own orders or admin to fetch any
    if (reqUser.role !== "admin" && reqUser.id !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await Order.find({ userId }).populate("products.productId").sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message || err });
  }
};

// GET (admin only) - list all orders
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("products.productId").sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message || err });
  }
};

//PUT update the status by (admin only) -> update status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status?: string };

    if (!status) return res.status(400).json({ message: "Status is required" });

    if (!["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
  
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).populate("products.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json({ message: "Order updated", order });
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message || err });
  }
};