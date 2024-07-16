const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = 'uploads/cvs';
    const uploadPath = path.join(__dirname, '..', uploadFolder);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to only allow certain file types
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.pdf' && ext !== '.doc' && ext !== '.docx') {
    return cb(new Error('Only PDF and DOC files are allowed'), false);
  }
  cb(null, true);
};

// multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 300 * 1024 } // 300 KB limit
});

// Custom middleware to check file size after upload
const validateFileSize = (req, res, next) => {
  if (req.file && req.file.size > 300 * 1024) { // 300 KB
    return res.status(400).json({ error: 'File size must be less than 300 KB' });
  }
  next();
};

module.exports = { upload, validateFileSize };