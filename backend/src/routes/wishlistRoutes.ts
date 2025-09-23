import express from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/add", protect, addToWishlist);
router.get("/", protect, getWishlist); 
router.delete("/remove", protect, removeFromWishlist);

export default router;
