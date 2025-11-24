// In routes/homeContentRoutes.ts
import express from 'express';
import {
  getActiveHomeContent,
  createHomeContent,
  updateHomeContent,
  deleteHomeContent
} from '../controllers/homeContentController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../config/multer';

const router = express.Router();

router.get('/', getActiveHomeContent);
router.post('/', protect, adminOnly, upload.array('media', 2), createHomeContent);
router.put('/:id', protect, adminOnly, upload.array('media', 2), updateHomeContent);
router.delete('/:id', protect, adminOnly, deleteHomeContent);

export default router; // Make sure this line exists