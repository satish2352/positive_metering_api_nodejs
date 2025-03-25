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
            <img src="${process.env.SERVER_PATH}uploads/blogdetails/${filename}" alt="blog image" width="50%" height="auto"/>
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
            <img src="${process.env.SERVER_PATH}/uploads/blogdetails/${filename}" alt="blog image" width="50%" height="auto"/>
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


// exports.getBlogMeta = async (req, res) => {
//   try {
//     const { id } = req.body; // Get blog ID from request body

//     if (!id) {
//       return apiResponse.validationError(res, "Blog ID is required");
//     }

//     // Fetch blog details from the database
//     const blogDetail = await BlogDetail.findOne({
//       where: { id, isDelete: false, isActive: true },
//     });

//     if (!blogDetail) {
//       return apiResponse.notFoundResponse(res, "Blog not found");
//     }

//     // Construct full image URL
//     const urlTitle = blogDetail.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
//     const baseUrl = `${process.env.SERVER_PATH}`;
//     const imageUrl = blogDetail.img ? baseUrl + blogDetail.img.replace(/\\/g, "/") : null;
//     const blogUrl = `https://seohelmet.sumagodemo.com/blogdetails/${urlTitle}`;
//     console.log("imageUrl", imageUrl);
    
//     // Generate dynamic Open Graph meta tags
//     const html = `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>${blogDetail.title}</title>
//             <meta property="og:title" content="${blogDetail.title}" />
//             <meta property="og:description" content="${blogDetail.shortDesc}" />
//             <meta property="og:image" content="${imageUrl}" />
//             <meta property="og:url" content="${blogUrl}" />
//             <meta property="og:type" content="article" />

//             <!-- Redirect after WhatsApp fetches meta tags -->
//             <meta http-equiv="refresh" content="1;url=${blogUrl}" />
//         </head>
//         <body>
//             <h1>Redirecting to ${blogDetail.title}...</h1>
//         </body>
//         </html>
//     `;

//     return res.send(html);
//   } catch (error) {
//     console.error("Error fetching blog meta:", error);
//     return apiResponse.ErrorResponse(res, "Failed to generate blog metadata");
//   }
// };
exports.getBlogMeta = async (req, res) => {
  try {
    const { id } = req.params; // Fetch the blog ID from request params

    if (!id) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    // Fetch blog details from the database
    const blogDetail = await BlogDetail.findOne({
      where: { id, isDelete: false, isActive: true },
    });

    if (!blogDetail) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Generate URLs for images and blog link
    const baseUrl = process.env.SERVER_PATH || ""; // Fallback to empty string if undefined
    const imageUrl = blogDetail.img
      ? baseUrl + blogDetail.img.replace(/\\/g, "/") // Ensure proper URL formatting
      : "https://seohelmet.sumagodemo.com/default-image.jpg"; // Provide a default image

    const urlTitle = blogDetail.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace spaces & special characters with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

    const blogUrl = `https://seohelmet.sumagodemo.com/blogdetails/${urlTitle}`;

    // Serve an HTML page with Open Graph meta tags for proper social sharing
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${blogDetail.title}</title>
          <meta property="og:title" content="${blogDetail.title}" />
          <meta property="og:description" content="${blogDetail.shortDesc}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${blogUrl}" />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body>
          <h1>${blogDetail.title}</h1>
          <p>${blogDetail.shortDesc}</p>
          <img src="${imageUrl}" alt="${blogDetail.title}" width="100%" />
      </body>
      </html>
    `;

    return res.send(html);
  } catch (error) {
    console.error("Error fetching blog meta:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

