// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Define storage for multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Extract the folder name from the request
//     const folderName = req.baseUrl; 
//     const uploadFolder = `uploads${folderName}`;
//     console.log("uploadFolder", uploadFolder);
    
//     // Ensure the directory exists
//     const uploadPath = path.join(__dirname, '..', uploadFolder);
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }

//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// // File filter to only allow certain image types
// const fileFilter = (req, file, cb) => {
//   const ext = path.extname(file.originalname);
//   if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.mp4' && ext !== '.avi' && ext !== '.mov') {
//     return cb(new Error('Only media files are allowed'), false);
//   }
//   cb(null, true);
// };

// // multer configuration
// const upload = multer({
//   storage,
//   fileFilter,
//   // limits: { fileSize: 1024 * 1024 } // 1MB limit
// });
// const upload2 = multer({
//   storage,
//   fileFilter,
//   // limits: { fileSize: 1024 * 1024 } // 1MB limit
// }).array('img', 5); 
// // Custom middleware to check file size after upload
// const validateImageSize = (req, res, next) => {
//     if (req.file && req.file.size > 1024 * 1024) { // 300 KB
//       return res.status(400).json({ error: 'Image size must be less than 300 KB' });
//     }
//     next();
//   };

//   module.exports = { upload,upload2, validateImageSize };


const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Extract the folder name from the request
    const folderName = req.baseUrl; 
    const uploadFolder = `uploads${folderName}`; // This will be used as part of the public URL
    
    // Ensure the directory exists (absolute path)
    const uploadPath = path.join(__dirname, '..', uploadFolder); 
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); // Save the file to this directory (absolute path)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Save the file with a timestamp
  }
});

// File filter to only allow certain image types
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.mp4' && ext !== '.avi' && ext !== '.mov') {
    return cb(new Error('Only media files are allowed'), false);
  }
  cb(null, true);
};

// multer configuration
const upload = multer({
  storage,
  fileFilter,
}).single('img'); // For uploading a single file

const upload2 = multer({
  storage,
  fileFilter,
}).array('img', 5); // For multiple files

// Custom middleware to check file size after upload
const validateImageSize = (req, res, next) => {
    if (req.file && req.file.size > 1024 * 1024) { // 1 MB limit
      return res.status(400).json({ error: 'Image size must be less than 1 MB' });
    }
    next();
};

// Example route after file upload to return URL
app.post('/upload', upload2, (req, res) => {
  const folderName = req.baseUrl; // Use folderName for URL construction
  const fileUrls = req.files.map(file => {
    // Construct the URL based on the folder and filename
    return `https://nodetest.positivemetering.in/uploads${folderName}/${file.filename}`;
  });

  res.status(200).json({
    message: 'Files uploaded successfully',
    urls: fileUrls, // Return the array of file URLs
  });
});

module.exports = { upload, upload2, validateImageSize };
