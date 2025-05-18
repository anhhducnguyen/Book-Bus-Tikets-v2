import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Tạo đường dẫn tới thư mục public/uploads (từ file uploadBanner.ts nằm trong src/api)
const uploadDir = path.join(__dirname,  '../../public/uploads'); 

// Nếu thư mục chưa tồn tại thì tạo
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename);
  },
});

export const uploadBanner = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
});
