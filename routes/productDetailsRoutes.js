const express = require('express');
const { upload, validateImageSize } = require('../middleware/multer');
const { validateProductDetails, validateProductDetailsId } = require('../validations/productDetailsValidation');
const {
  addProductDetails,
  updateProductDetails,
  getProductDetails,
  isActiveStatus,
  isDeleteStatus
} = require('../controllers/productDetailsController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/create-productdetails', upload.single('img'), validateImageSize, authenticateToken, validateProductDetails, addProductDetails);
router.put('/update-productdetails/:id', upload.single('img'), validateImageSize, authenticateToken, validateProductDetails, validateProductDetailsId, updateProductDetails);
router.get('/get-productdetails', getProductDetails);
router.get('/find-productdetails', authenticateToken, getProductDetails);
router.patch('/isactive-productdetails/:id', authenticateToken, validateProductDetailsId, isActiveStatus);
router.patch('/isdelete-productdetails/:id', authenticateToken, validateProductDetailsId, isDeleteStatus);

module.exports = router;
