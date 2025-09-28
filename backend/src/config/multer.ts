import multer from "multer";

// Use memory storage → files stay in RAM
const storage = multer.memoryStorage();

export const upload = multer({ storage });
