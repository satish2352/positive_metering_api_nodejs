const Testimonial = require("../models/Testimonial");
const apiResponse = require("../helper/apiResponse");

exports.addTestimonial = async (req, res) => {
  try {
    const { name, company_Name, review, star, experience } = req.body;

    const testimonial = await Testimonial.create({
      name,
      company_Name,
      review,
      star,
      experience: parseInt(experience, 10), // Convert experience to integer
      isActive: true,
      isDelete: false,
    });

    return apiResponse.successResponseWithData(
      res,
      "Testimonial added successfully",
      testimonial
    );
  } catch (error) {
    console.error("Add testimonial failed", error);
    return apiResponse.ErrorResponse(res, "Add testimonial failed");
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, company_Name, review, star, experience } = req.body;

    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return apiResponse.notFoundResponse(res, "Testimonial not found");
    }

    testimonial.name = name;
    testimonial.company_Name = company_Name;
    testimonial.review = review;
    testimonial.star = star;
    testimonial.experience = parseInt(experience, 10); // Convert experience to integer

    await testimonial.save();

    return apiResponse.successResponseWithData(
      res,
      "Testimonial updated successfully",
      testimonial
    );
  } catch (error) {
    console.error("Update testimonial failed", error);
    return apiResponse.ErrorResponse(res, "Update testimonial failed");
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { isDelete: false },
    });

    const testimonialsFormatted = testimonials.map((testimonial) => ({
      id: testimonial.id,
      name: testimonial.name,
      company_Name: testimonial.company_Name,
      review: testimonial.review,
      star: testimonial.star,
      experience: testimonial.experience,
    }));

    return apiResponse.successResponseWithData(
      res,
      "Testimonials retrieved successfully",
      testimonialsFormatted
    );
  } catch (error) {
    console.error("Get testimonials failed", error);
    return apiResponse.ErrorResponse(res, "Get testimonials failed");
  }
};

exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial) {
      return apiResponse.notFoundResponse(res, "Testimonial not found");
    }

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();

    return apiResponse.successResponseWithData(
      res,
      "Testimonial status updated successfully",
      testimonial
    );
  } catch (error) {
    console.error("Toggle testimonial status failed", error);
    return apiResponse.ErrorResponse(res, "Toggle testimonial status failed");
  }
};

exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial) {
      return apiResponse.notFoundResponse(res, "Testimonial not found");
    }

    testimonial.isDelete = !testimonial.isDelete;
    await testimonial.save();

    return apiResponse.successResponseWithData(
      res,
      "Testimonial delete status updated successfully",
      testimonial
    );
  } catch (error) {
    console.error("Toggle testimonial delete status failed", error);
    return apiResponse.ErrorResponse(
      res,
      "Toggle testimonial delete status failed"
    );
  }
};
