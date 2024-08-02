const Subscribe = require('../models/Subscribe');
const apiResponse = require('../helper/apiResponse');

exports.addSubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const subscribe = await Subscribe.create({ email });
    return apiResponse.successResponseWithData(res, 'Subscription added successfully', subscribe);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('Add subscription failed: Email already exists');
      return apiResponse.conflictResponse(res, 'Email already subscribed');
    }
    console.error('Add subscription failed', error);
    return apiResponse.ErrorResponse(res, 'Add subscription failed');
  }
};


exports.getSubscribes = async (req, res) => {
  try {
    const subscribes = await Subscribe.findAll({ where: { isDelete: false } });
    return apiResponse.successResponseWithData(res, 'Subscriptions retrieved successfully', subscribes);
  } catch (error) {
    console.error('Get subscriptions failed', error);
    return apiResponse.ErrorResponse(res, 'Get subscriptions failed');
  }
};

exports.updateSubscribe = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const subscribe = await Subscribe.findByPk(id);
    if (!subscribe) {
      return apiResponse.notFoundResponse(res, 'Subscription not found');
    }

    subscribe.email = email;
    await subscribe.save();

    return apiResponse.successResponseWithData(res, 'Subscription updated successfully', subscribe);
  } catch (error) {
    console.error('Update subscription failed', error);
    return apiResponse.ErrorResponse(res, 'Update subscription failed');
  }
};

exports.deleteSubscribe = async (req, res) => {
  try {
    const { id } = req.params;
    const subscribe = await Subscribe.findByPk(id);

    if (!subscribe) {
      return apiResponse.notFoundResponse(res, 'Subscription not found');
    }

    subscribe.isDelete = true;
    await subscribe.save();

    return apiResponse.successResponseWithData(res, 'Subscription deleted successfully', subscribe);
  } catch (error) {
    console.error('Delete subscription failed', error);
    return apiResponse.ErrorResponse(res, 'Delete subscription failed');
  }
};
