const express = require('express');
const { upload, validateImageSize } = require('../middleware/multer');
const { validateCarrousalId } = require('../validations/carrousalValidation');
const {
  addCarrousal,
  updateCarrousal,
  getCarrousals,
  toggleCarrousalStatus,
  toggleCarrousalDelete
} = require('../controllers/carrousalController');
const authenticateToken = require('../middleware/auth');
const imageRequired = require('../validations/imageValidation');

const router = express.Router();

router.post('/create-carrousal', upload.single('img'), validateImageSize, authenticateToken, addCarrousal);
router.put('/update-carrousal/:id', upload.single('img'), validateImageSize, authenticateToken, validateCarrousalId, updateCarrousal);
router.get('/get-carrousal', getCarrousals);
router.get('/find-carrousal', authenticateToken, getCarrousals);
router.patch('/isactive-carrousal/:id', authenticateToken, validateCarrousalId, toggleCarrousalStatus);
router.patch('/isdelete-carrousal/:id', authenticateToken, validateCarrousalId, toggleCarrousalDelete);

module.exports = router;
