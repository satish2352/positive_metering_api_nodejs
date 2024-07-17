// routes/optionsDataRoutes.js
const express = require('express');
const {
  addOptionsData,
  updateOptionsData,
  getOptionsData
} = require('../controllers/optionsDataController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/create-optionsdata', authenticateToken, addOptionsData);
router.put('/update-optionsdata/:id', authenticateToken, updateOptionsData);
router.get('/get-optionsdata', authenticateToken,getOptionsData);

module.exports = router;
