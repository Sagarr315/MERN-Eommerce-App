import { Router } from "express";
import { 
  createCategory, 
  getCategories, 
  getAllCategories,
  activateCategory,
  deactivateCategory,getCategoryById 
} from "../controllers/categoryController"; 

const router = Router();

// Public routes
router.get("/", getCategories); // Only active categories

// Admin routes
router.post("/", createCategory);
router.get("/admin/all", getAllCategories); // All categories (including inactive)
router.patch("/:id/activate", activateCategory);
router.patch("/:id/deactivate", deactivateCategory);
router.get('/:id', getCategoryById);

export default router;