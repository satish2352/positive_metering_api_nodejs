// controllers/optionsDataController.js
const OptionsData = require('../models/OptionsData');
const apiResponse = require('../helper/apiResponse');

exports.addOptionsData = async (req, res) => {
  try {
    const { productId, optionsDescription } = req.body;

    const optionsData = await OptionsData.create({
      productId,
      optionsDescription,
    });

    return apiResponse.successResponseWithData(
      res,
      'Options data added successfully',
      optionsData
    );
  } catch (error) {
    console.error('Add options data failed', error);
    return apiResponse.ErrorResponse(res, 'Add options data failed');
  }
};

exports.updateOptionsData = async (req, res) => {
  try {
    const { id } = req.params;
    const { optionsDescription } = req.body;

    const optionsData = await OptionsData.findByPk(id);
    if (!optionsData) {
      return apiResponse.notFoundResponse(res, 'Options data not found');
    }

    optionsData.optionsDescription = optionsDescription;
    await optionsData.save();

    return apiResponse.successResponseWithData(
      res,
      'Options data updated successfully',
      optionsData
    );
  } catch (error) {
    console.error('Update options data failed', error);
    return apiResponse.ErrorResponse(res, 'Update options data failed');
  }
};

exports.getOptionsData = async (req, res) => {
  try {
    const { productId } = req.params;
    const optionsData = await OptionsData.findAll({ where: { productId } });

    return apiResponse.successResponseWithData(
      res,
      'Options data retrieved successfully',
      optionsData
    );
  } catch (error) {
    console.error('Get options data failed', error);
    return apiResponse.ErrorResponse(res, 'Get options data failed');
  }
};
