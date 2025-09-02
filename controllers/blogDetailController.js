const BlogDetail = require("../models/BlogDetail");
const apiResponse = require("../helper/apiResponse");
const fs = require("fs");
const path = require("path");

// function generateSlug(title) {
//   return title
//     .toString()                  // ensure string
//     .toLowerCase()               // convert to lowercase
//     .trim()                      // remove leading/trailing spaces
//     .replace(/["'“”‘’]/g, "")    // remove quotes
//     .replace(/[^a-z0-9\s-]/g, "")// remove everything except a-z, 0-9, space, -
//     .replace(/\s+/g, "-")        // replace spaces with -
//     .replace(/-+/g, "-")         // collapse multiple -
//     .replace(/^-+|-+$/g, "");    // remove leading/trailing -
// }
function generateSlug(title) {
  return title
    .toString()                  // ensure string
    .toLowerCase()               // convert to lowercase
    .trim()                      // remove leading/trailing spaces
    .replace(/[^a-z0-9\s]/g, "") // remove everything except letters, numbers, spaces
    .replace(/\s+/g, "-")        // replace spaces with -
    .replace(/-+/g, "-")         // collapse multiple -
    .replace(/^-+|-+$/g, "");    // remove leading/trailing -
}

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

    let slug = generateSlug(title)

    const blogDetail = await BlogDetail.create({
      img,
      title,
      slug,
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

    let slug = generateSlug(title)

    blogDetail.img = img || blogDetail.img;
    blogDetail.title = title;
    blogDetail.slug = slug;
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


function isBot(userAgent) {
  const bots = [
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "whatsapp",
    "discordbot",
    "googlebot"
  ];
  return bots.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));
}

exports.getBlogPage = async (req, res) => {
  try {
    const { slug } = req.params; 
    let frontendDomain
    let cleanSlug
    if (slug.endsWith("=com")) {
      frontendDomain = "https://positivemetering.com/";
    }else if(slug.endsWith("=in")){
      frontendDomain = "https://positivemetering.in/";
    }
    cleanSlug = slug.replace(/=com$/, "").replace(/=in$/, "");
    const userAgent = req.headers["user-agent"] || "";
    const blog = await BlogDetail.findOne({ where: { cleanSlug } });
    if (!blog) {
      // Always return 200 to bots to avoid scraping errors
      if (isBot(userAgent)) {
        return res.status(200).send(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>Blog Not Found</title>
              <meta name="description" content="This blog is not available." />
            </head>
            <body>
              <h1>Blog Not Found</h1>
              <p>The requested blog does not exist.</p>
            </body>
          </html>
        `);
      }
      // For humans, redirect to main blog page
      return res.redirect(`${frontendDomain}blogdetails`);
    }

    if (isBot(userAgent)) {
      // Bot request → send Open Graph meta tags
      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>${blog.title}</title>
            <meta name="description" content="${blog.shortDesc}" />

            <!-- Open Graph -->
            <meta property="og:title" content="${blog.title}" />
            <meta property="og:description" content="${blog.shortDesc}" />
            <meta property="og:image" content="${process.env.SERVER_PATH}${blog.img}" />
            <meta property="og:url" content="${process.env.SERVER_PATH}blogdetails/blog/${cleanSlug}" />
          </head>
          <body>
            <h1>${blog.title}</h1>
            <p>Preview for bots only. Visit site for full blog.</p>
          </body>
        </html>
      `);
    }

    // Normal user → redirect to frontend slug URL
    const blogSlug = blog.slug || blog.title.toLowerCase().replace(/\s+/g, '-');
    return res.redirect(`${frontendDomain}blogdetails/${cleanSlug}`);

  } catch (err) {
    console.error("Error generating blog page:", err);
    // Return 200 HTML with error message for bots to prevent 500 errors
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Error</title>
          <meta name="description" content="Error loading blog preview." />
        </head>
        <body>
          <h1>Error loading blog preview</h1>
        </body>
      </html>
    `);
  }
};
