import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import path from "path"; // This is a built-in Node.js module, no install needed

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // This is a temporary storage on our server
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using uuid and keep the original extension
    const uniqueSuffix = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});

export const upload = multer({
  storage,
});