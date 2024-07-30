const ProductDetails = require('../models/ProductDetails');
const apiResponse = require('../helper/apiResponse');

exports.addProductDetails = async (req, res) => {
  try {
    console.log(req.body); // Log the body to check the incoming data
    const { productName, application } = req.body;
    const img = req.file ? req.file.path : null;

    const productDetails = await ProductDetails.create({
      img,
      productName,
      application,
      isActive: true,
      isDelete: false,
    });

    return apiResponse.successResponseWithData(
      res,
      'Product details added successfully',
      productDetails
    );
  } catch (error) {
    console.error('Add product details failed', error);
    return apiResponse.ErrorResponse(res, 'Add product details failed');
  }
};

exports.updateProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, application } = req.body;
    const img = req.file ? req.file.path : null;

    const productDetails = await ProductDetails.findByPk(id);
    if (!productDetails) {
      return apiResponse.notFoundResponse(res, 'Product details not found');
    }

    productDetails.img = img || productDetails.img;
    productDetails.productName = productName;
    productDetails.application = application;
    await productDetails.save();

    return apiResponse.successResponseWithData(
      res,
      'Product details updated successfully',
      productDetails
    );
  } catch (error) {
    console.error('Update product details failed', error);
    return apiResponse.ErrorResponse(res, 'Update product details failed');
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const productDetails = await ProductDetails.findAll({ where: { isDelete: false } });

    const baseUrl = `${req.protocol}://${req.get('host')}/`;
    const productDetailsWithBaseUrl = productDetails.map(details => ({
      ...details.toJSON(),
      img: details.img ? baseUrl + details.img.replace(/\\/g, '/') : null,
    }));

    return apiResponse.successResponseWithData(
      res,
      'Product details retrieved successfully',
      productDetailsWithBaseUrl
    );
  } catch (error) {
    console.error('Get product details failed', error);
    return apiResponse.ErrorResponse(res, 'Get product details failed');
  }
};

exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const productDetails = await ProductDetails.findByPk(id);

    if (!productDetails) {
      return apiResponse.notFoundResponse(res, 'Product details not found');
    }

    productDetails.isActive = !productDetails.isActive;
    await productDetails.save();

    return apiResponse.successResponseWithData(
      res,
      'Product details active status updated successfully',
      productDetails
    );
  } catch (error) {
    console.error('Toggle product details active status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle product details active status failed');
  }
};

exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const productDetails = await ProductDetails.findByPk(id);

    if (!productDetails) {
      return apiResponse.notFoundResponse(res, 'Product details not found');
    }

    productDetails.isDelete = !productDetails.isDelete;
    await productDetails.save();

    return apiResponse.successResponseWithData(
      res,
      'Product details delete status updated successfully',
      productDetails
    );
  } catch (error) {
    console.error('Toggle product details delete status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle product details delete status failed');
  }
};
