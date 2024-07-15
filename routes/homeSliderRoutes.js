const express = require('express');
const { upload, validateImageSize } = require('../middleware/multer');
const { validateHomeSliderId } = require('../validations/homeSliderValidation');
const {
  addHomeSlider,
  updateHomeSlider,
  getHomeSlider,
  isActiveStatus,
  isDeleteStatus
} = require('../controllers/homeSlider');
const authenticateToken = require('../middleware/auth');
const imageRequired = require('../validations/imageValidation');

const router = express.Router();

router.post('/create-homeslider', upload.single('img'), validateImageSize, imageRequired, authenticateToken, addHomeSlider);
router.put('/update-homeslider/:id', upload.single('img'), validateImageSize, imageRequired, authenticateToken, validateHomeSliderId, updateHomeSlider);
router.get('/get-homeslider', getHomeSlider);
router.get('/find-homeslider', authenticateToken, getHomeSlider);
router.patch('/isactive-homeslider/:id', authenticateToken, validateHomeSliderId, isActiveStatus);
router.patch('/isdelete-homeslider/:id', authenticateToken, validateHomeSliderId, isDeleteStatus);

module.exports = router;
