const express = require('express');
const { upload } = require('../middleware/multer');
const {
  addNewsEvent,
  updateNewsEvent,
  getNewsEvents,
  isActiveStatus,
  isDeleteStatus,
} = require('../controllers/newsEventController');
const authenticateToken = require('../middleware/auth');
const {
  validateNewsEvent,
  validateNewsEventId,
} = require('../validations/newsEventValidation');

const router = express.Router();

router.post('/create-newevent', upload.single('img'), authenticateToken, validateNewsEvent, addNewsEvent);
router.put('/update-newevent/:id', upload.single('img'), authenticateToken, validateNewsEvent, validateNewsEventId, updateNewsEvent);
router.get('/get-newevents', getNewsEvents);
router.put('/isactive-newevent/:id', authenticateToken, validateNewsEventId, isActiveStatus);
router.delete('/isdelete-newevent/:id', authenticateToken, validateNewsEventId, isDeleteStatus);

module.exports = router;
