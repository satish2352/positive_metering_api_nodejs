const express = require('express');
const { upload } = require('../middleware/multer');
const {
  addBlogDetail,
  updateBlogDetail,
  getBlogDetails,
  isActiveStatus,
  isDeleteStatus,
} = require('../controllers/blogDetailController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/create-blogdetail', upload.single('img'), authenticateToken, addBlogDetail);
router.put('/update-blogdetail/:id', upload.single('img'), authenticateToken, updateBlogDetail);
router.get('/get-blogdetails', getBlogDetails);
router.patch('/isactive-blogdetail/:id', authenticateToken, isActiveStatus);
router.patch('/isdelete-blogdetail/:id', authenticateToken, isDeleteStatus);

module.exports = router;
