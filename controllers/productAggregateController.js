// controllers/productAggregateController.js
const ProductDetails = require('../models/ProductDetails');
const OptionsData = require('../models/OptionsData');
const TechnicalData = require('../models/TechnicalData');
const MaterialData = require('../models/MaterialData');
const apiResponse = require('../helper/apiResponse');

exports.getAllProductData = async (req, res) => {
  try {
    const { productId } = req.params;

    // Fetch product details
    const productDetails = await ProductDetails.findByPk(productId);
    if (!productDetails) {
      return apiResponse.notFoundResponse(res, 'Product not found');
    }

    // Fetch related data
    const optionsData = await OptionsData.findAll({ where: { productId } });
    const technicalData = await TechnicalData.findAll({ where: { productId } });
    const materialData = await MaterialData.findAll({ where: { productId } });

    // Aggregate all data
    const allProductData = {
      productDetails,
      optionsData,
      technicalData,
      materialData,
    };

    return apiResponse.successResponseWithData(
      res,
      'Product data retrieved successfully',
      allProductData
    );
  } catch (error) {
    console.error('Get all product data failed', error);
    return apiResponse.ErrorResponse(res, 'Get all product data failed');
  }
};
