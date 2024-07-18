// routes/productAggregateRoutes.js
const express = require('express');
const {
  getAllProductData,
} = require('../controllers/productAggregateController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/get-all-productdata/:productId', getAllProductData);

module.exports = router;
