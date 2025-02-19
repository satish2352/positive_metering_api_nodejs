const BlogDetail = require("../models/BlogDetail");
const apiResponse = require("../helper/apiResponse");
const fs = require("fs");
const path = require("path");
exports.addBlogDetail = async (req, res) => {
  try {
    const { title, shortDesc, longDesc } = req.body;
    const img = req.file ? req.file.path : null;
    const processBase64Images = (htmlContent) => {
      return htmlContent.replace(
        /<img[^>]+src=["'](data:image\/(png|jpeg|jpg|gif);base64,([^"']+))["'][^>]*>/g,
        (match, fullData, ext, base64Data) => {
          try {
            // Convert base64 to buffer
            const buffer = Buffer.from(base64Data, "base64");

            // Generate unique filename
            const filename = `image_${Date.now()}.${ext}`;
            const filePath = path.join(
              __dirname,
              "../uploads/blogdetails",
              filename
            );

            // Save the file
            fs.writeFileSync(filePath, buffer);

            // Return new img tag with file path

            return `<div style="text-align: center;">
            <img src="${process.env.SERVER_PATH}uploads/blogDetails/${filename}" alt="blog image" width="50%" height="auto"/>
        </div>`;
          } catch (error) {
            console.error("Error processing base64 image:", error);
            return match; // Return original if error occurs
          }
        }
      );
    };

    const updatedLongDesc = processBase64Images(longDesc);

    const blogDetail = await BlogDetail.create({
      img,
      title,
      shortDesc,
      longDesc: updatedLongDesc,
      isActive: true,
      isDelete: false,
    });

    return apiResponse.successResponseWithData(
      res,
      "Blog details added successfully",
      blogDetail
    );
  } catch (error) {
    console.error("Add blog details failed", error);
    return apiResponse.ErrorResponse(res, "Add blog details failed");
  }
};

exports.updateBlogDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, shortDesc, longDesc } = req.body;
    const img = req.file ? req.file.path : null;

    const blogDetail = await BlogDetail.findByPk(id);
    if (!blogDetail) {
      return apiResponse.notFoundResponse(res, "Blog detail not found");
    }

    const processBase64Images = (htmlContent) => {
      return htmlContent.replace(
        /<img[^>]+src=["'](data:image\/(png|jpeg|jpg|gif);base64,([^"']+))["'][^>]*>/g,
        (match, fullData, ext, base64Data) => {
          try {
            // Convert base64 to buffer
            const buffer = Buffer.from(base64Data, "base64");

            // Generate unique filename
            const filename = `image_${Date.now()}.${ext}`;
            const filePath = path.join(
              __dirname,
              "../uploads/blogdetails",
              filename
            );

            // Save the file
            fs.writeFileSync(filePath, buffer);

            // Return new img tag with file path

            return `<div style="text-align: center;">
            <img src="${process.env.SERVER_PATH}/uploads/blogDetails/${filename}" alt="blog image" width="50%" height="auto"/>
        </div>`;
          } catch (error) {
            console.error("Error processing base64 image:", error);
            return match; // Return original if error occurs
          }
        }
      );
    };

    const updatedLongDesc = processBase64Images(longDesc);

    blogDetail.img = img || blogDetail.img;
    blogDetail.title = title;
    blogDetail.shortDesc = shortDesc;
    blogDetail.longDesc = updatedLongDesc;
    await blogDetail.save();

    return apiResponse.successResponseWithData(
      res,
      "Blog details updated successfully",
      blogDetail
    );
  } catch (error) {
    console.error("Update blog details failed", error);
    return apiResponse.ErrorResponse(res, "Update blog details failed");
  }
};

exports.getBlogDetails = async (req, res) => {
  try {
    const blogDetails = await BlogDetail.findAll({
      where: { isDelete: false },
    });

    // Base URL for images
    const baseUrl = `${process.env.SERVER_PATH}`;

    const blogDetailsWithBaseUrl = blogDetails.map((blogDetail) => ({
      ...blogDetail.toJSON(), // Convert Sequelize instance to plain object
      img: blogDetail.img ? baseUrl + blogDetail.img.replace(/\\/g, "/") : null,
    }));

    return apiResponse.successResponseWithData(
      res,
      "blogDetails retrieved successfully",
      blogDetailsWithBaseUrl
    );
  } catch (error) {
    console.error("Get blogDetails failed", error);
    return apiResponse.ErrorResponse(res, "Get blogDetails failed");
  }
};

exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const blogDetail = await BlogDetail.findByPk(id);

    if (!blogDetail) {
      return apiResponse.notFoundResponse(res, "Blog detail not found");
    }

    blogDetail.isActive = !blogDetail.isActive;
    await blogDetail.save();

    return apiResponse.successResponseWithData(
      res,
      "Blog detail active status updated successfully",
      blogDetail
    );
  } catch (error) {
    console.error("Toggle blog detail active status failed", error);
    return apiResponse.ErrorResponse(
      res,
      "Toggle blog detail active status failed"
    );
  }
};

exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const blogDetail = await BlogDetail.findByPk(id);

    if (!blogDetail) {
      return apiResponse.notFoundResponse(res, "Blog detail not found");
    }

    blogDetail.isDelete = !blogDetail.isDelete;
    await blogDetail.save();

    return apiResponse.successResponseWithData(
      res,
      "Blog detail delete status updated successfully",
      blogDetail
    );
  } catch (error) {
    console.error("Toggle blog detail delete status failed", error);
    return apiResponse.ErrorResponse(
      res,
      "Toggle blog detail delete status failed"
    );
  }
};
