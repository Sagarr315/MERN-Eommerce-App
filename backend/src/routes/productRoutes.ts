import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
   getFeaturedProducts,
   updateProductImages
} from "../controllers/productController";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { upload } from "../config/multer";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

router.get("/featured/products", getFeaturedProducts);
// Admin-only routes
router.post("/", protect, adminOnly, upload.array("images"), createProduct);
router.patch("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
//  ADD THIS ROUTE:
router.patch("/:id/images", protect, adminOnly, upload.array("images"), updateProductImages);

export default router;
