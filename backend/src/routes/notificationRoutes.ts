import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { getNotifications, markAsRead } from "../controllers/notificationController";

const router = express.Router();

router.get("/", protect, adminOnly, getNotifications);
router.put("/:id/read", protect, adminOnly, markAsRead);

export default router;
