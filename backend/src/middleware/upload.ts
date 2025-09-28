import multer from "multer";
import path from "path";

// store files in memory (not disk) → later upload to cloudinary
const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png allowed"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
