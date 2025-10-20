import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
   getFeaturedProducts
} from "../controllers/productController";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { upload } from "../config/multer";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

router.get("/featured/products", getFeaturedProducts);
// Admin-only routes
router.post("/", protect, adminOnly, upload.single("image"), createProduct);

router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
