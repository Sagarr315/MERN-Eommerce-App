import { Router } from "express";
import { getUsers, deleteUser, getAnalytics } from "../controllers/adminController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

router.get("/users", protect, adminOnly, getUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.get("/analytics", protect, adminOnly, getAnalytics);

export default router;
