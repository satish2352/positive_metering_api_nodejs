const express = require('express');
const { upload } = require('../middleware/multerCV');
const { validateUploadCV, validateUploadCVId } = require('../validations/uploadCVValidation');
const {
  addUploadCV,
  updateUploadCV,
  getUploadCVs,
  toggleCVStatus,
  toggleCVDelete
} = require('../controllers/uploadCVController');
const authenticateToken = require('../middleware/auth');
const sendEmail = require('../middleware/nodemailer');

const router = express.Router();

router.post('/create-uploadcv', upload.single('cv'), validateUploadCV, addUploadCV, sendEmail);
router.put('/update-uploadcv/:id', upload.single('cv'), authenticateToken, validateUploadCV, validateUploadCVId, updateUploadCV);
router.get('/find-uploadcv', authenticateToken, getUploadCVs);
router.put('/isactive-uploadcv/:id', authenticateToken, validateUploadCVId, toggleCVStatus);
router.delete('/isdelete-uploadcv/:id', authenticateToken, validateUploadCVId, toggleCVDelete);

module.exports = router;
