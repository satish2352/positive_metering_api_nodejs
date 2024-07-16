// routes/materialDataRoutes.js
const express = require('express');
const {
  addMaterialData,
  updateMaterialData,
  getMaterialData
} = require('../controllers/materialDataController');
const authenticateToken = require('../middleware/auth');
const { validateMaterialData } = require('../validations/materialDataValidation');

const router = express.Router();

router.post('/create-materialdata', authenticateToken, validateMaterialData, addMaterialData);
router.put('/update-materialdata/:id', authenticateToken, updateMaterialData);
router.get('/get-materialdata/:productId', authenticateToken, getMaterialData);

module.exports = router;
