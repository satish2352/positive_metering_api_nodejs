// controllers/materialDataController.js
const MaterialData = require('../models/MaterialData');
const apiResponse = require('../helper/apiResponse');

exports.addMaterialData = async (req, res) => {
  try {
    const { productId, materialDescription } = req.body;

    const materialData = await MaterialData.create({
      productId,
      materialDescription,
    });

    return apiResponse.successResponseWithData(
      res,
      'Material data added successfully',
      materialData
    );
  } catch (error) {
    console.error('Add material data failed', error);
    return apiResponse.ErrorResponse(res, 'Add material data failed');
  }
};

exports.updateMaterialData = async (req, res) => {
  try {
    const { id } = req.params;
    const { materialDescription } = req.body;

    const materialData = await MaterialData.findByPk(id);
    if (!materialData) {
      return apiResponse.notFoundResponse(res, 'Material data not found');
    }

    materialData.materialDescription = materialDescription;
    await materialData.save();

    return apiResponse.successResponseWithData(
      res,
      'Material data updated successfully',
      materialData
    );
  } catch (error) {
    console.error('Update material data failed', error);
    return apiResponse.ErrorResponse(res, 'Update material data failed');
  }
};

exports.getMaterialData = async (req, res) => {
  try {
    const { productId } = req.params;
    const materialData = await MaterialData.findAll({ where: { productId } });

    return apiResponse.successResponseWithData(
      res,
      'Material data retrieved successfully',
      materialData
    );
  } catch (error) {
    console.error('Get material data failed', error);
    return apiResponse.ErrorResponse(res, 'Get material data failed');
  }
};
