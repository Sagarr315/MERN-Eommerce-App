import express from "express";
import {createOrder,getOrdersByUser,getAllOrders,updateOrderStatus} from "../controllers/orderController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createOrder);   // (logged-in user)
router.get("/:userId", protect, getOrdersByUser);   // get orders for a user (user or admin)
router.get("/", protect, adminOnly, getAllOrders);  // admin: list all orders
router.put("/:id", protect, adminOnly, updateOrderStatus);  // admin: update order status

export default router;
