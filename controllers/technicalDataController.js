// controllers/technicalDataController.js
const TechnicalData = require('../models/TechnicalData');
const apiResponse = require('../helper/apiResponse');

exports.addTechnicalData = async (req, res) => {
  try {
    const { productId, technicalDescription } = req.body;

    const technicalData = await TechnicalData.create({
      productId,
      technicalDescription,
    });

    return apiResponse.successResponseWithData(
      res,
      'Technical data added successfully',
      technicalData
    );
  } catch (error) {
    console.error('Add technical data failed', error);
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
