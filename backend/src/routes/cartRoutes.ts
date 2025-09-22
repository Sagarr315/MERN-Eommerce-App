import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
} from "../controllers/cartController";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/:userId", protect, getCart);
router.put("/update", protect, updateCart);
router.delete("/remove", protect, removeFromCart);

export default router;
