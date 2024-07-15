const apiResponse = require("../helper/apiResponse");

const imageRequired = (req, res, next) => {
  if (!req.file) {
    return apiResponse.ErrorResponse(res, "Image is required");
  }
  next();
};

module.exports = imageRequired;
