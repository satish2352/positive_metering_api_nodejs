// controllers/technicalDataController.js
const ProductDetails = require('../models/ProductDetails');
const TechnicalData = require('../models/TechnicalData');
const apiResponse = require('../helper/apiResponse');

exports.addTechnicalData = async (req, res) => {
  try {
    const { productName, technicalDescription } = req.body;

    // Find the product by productName
    const product = await ProductDetails.findOne({ where: { productName } });
    if (!product) {
      console.error('Product not found for productName:', productName);
      return apiResponse.notFoundResponse(res, 'Product not found');
    }

    // Create the technical data entry
    const technicalData = await TechnicalData.create({
      productId: product.id,
      technicalDescription,
    });

    // Return success response with data
    return apiResponse.successResponseWithData(
      res,
      'Technical data added successfully',
      technicalData
    );
  } catch (error) {
    console.error('Add technical data failed:', error);

    // Check if the error is a validation error or something else
    if (error.name === 'SequelizeValidationError') {
      return apiResponse.ErrorResponse(res, 'Validation error: ' + error.message);
    }

    return apiResponse.ErrorResponse(res, 'Add technical data failed');
  }
};


exports.updateTechnicalData = async (req, res) => {
  try {
    const { id } = req.params;
    const { technicalDescription } = req.body;

    const technicalData = await TechnicalData.findByPk(id);
    if (!technicalData) {
      return apiResponse.notFoundResponse(res, 'Technical data not found');
    }

    technicalData.technicalDescription = technicalDescription;
    await technicalData.save();

    return apiResponse.successResponseWithData(
      res,
      'Technical data updated successfully',
      technicalData
    );
  } catch (error) {
    console.error('Update technical data failed', error);
    return apiResponse.ErrorResponse(res, 'Update technical data failed');
  }
};

exports.getTechnicalData = async (req, res) => {
  try {
    const { productId } = req.params;
    const technicalData = await TechnicalData.findAll({ where: { productId } });

    return apiResponse.successResponseWithData(
      res,
      'Technical data retrieved successfully',
      technicalData
    );
  } catch (error) {
    console.error('Get technical data failed', error);
    return apiResponse.ErrorResponse(res, 'Get technical data failed');
  }
};
