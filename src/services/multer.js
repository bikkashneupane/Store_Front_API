import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const destinationFolder = path.join(__dirname, "../../public/assets/images");

const isFolderPresent = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

isFolderPresent(destinationFolder);

//storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // destination path
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    // fileName
    const uniqueName = ` ${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

//limits
const limits = {
  fileSize: 10 * 1024 * 1024,
};

// fileFilter

export const upload = multer({ storage, limits });
