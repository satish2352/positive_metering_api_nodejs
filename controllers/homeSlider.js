const HomeSlider = require("../models/HomeSlider");
const apiResponse = require("../helper/apiResponse");

exports.addHomeSlider = async (req, res) => {
  try {
    if (!req.file) {
      return apiResponse.ErrorResponse(res, "Image is required");
    }

    const img = req.file.path;

    const homeSlider = await HomeSlider.create({
      img,
      isActive: false,
      isDelete: false,
    });
    return apiResponse.successResponseWithData(
      res,
      "HomeSlider added successfully",
      homeSlider
    );
  } catch (error) {
    console.error("Add HomeSlider failed", error);
    return apiResponse.ErrorResponse(res, "Add HomeSlider failed");
  }
};

exports.updateHomeSlider = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return apiResponse.ErrorResponse(res, "Image is required");
    }

    const img = req.file.path;

    const homeSlider = await HomeSlider.findByPk(id);
    if (!homeSlider) {
      return apiResponse.notFoundResponse(res, "HomeSlider not found");
    }

    carrousal.img = img;
    await carrousal.save();

    return apiResponse.successResponseWithData(
      res,
      "HomeSlider updated successfully",
      homeSlider
    );
  } catch (error) {
    console.error("Update HomeSlider failed", error);
    return apiResponse.ErrorResponse(res, "Update HomeSlider failed");
  }
};

exports.getHomeSlider = async (req, res) => {
  try {
    const homeSlider = await HomeSlider.findAll({ where: { isDelete: false } });

    // Base URL for images
    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const homeSliderWithBaseUrl = homeSlider.map((homeSlider) => {
      return {
        ...homeSlider.toJSON(),
        img: homeSlider.img ? baseUrl + homeSlider.img.replace(/\\/g, "/") : null,
      };
    });

    return apiResponse.successResponseWithData(
      res,
      "HomeSlider retrieved successfully",
      homeSliderWithBaseUrl
    );
  } catch (error) {
    console.error("Get HomeSlider failed", error);
    return apiResponse.ErrorResponse(res, "Get HomeSlider failed");
  }
};

exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const homeSlider = await HomeSlider.findByPk(id);

    if (!homeSlider) {
      return apiResponse.notFoundResponse(res, "homeSlider not found");
    }

    homeSlider.isActive = !homeSlider.isActive;
    await homeSlider.save();

    return apiResponse.successResponseWithData(
      res,
      "HomeSlider status updated successfully",
      homeSlider
    );
  } catch (error) {
    console.error("Toggle HomeSlider status failed", error);
    return apiResponse.ErrorResponse(res, "Toggle HomeSlider status failed");
  }
};

exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const homeSlider = await HomeSlider.findByPk(id);

    if (!homeSlider) {
      return apiResponse.notFoundResponse(res, "homeSlider not found");
    }

    homeSlider.isDelete = !homeSlider.isDelete;
    await homeSlider.save();

    return apiResponse.successResponseWithData(
      res,
      "HomeSlider delete status updated successfully",
      homeSlider
    );
  } catch (error) {
    console.error("Toggle HomeSlider delete status failed", error);
    return apiResponse.ErrorResponse(
      res,
      "Toggle HomeSlider delete status failed"
    );
  }
};
