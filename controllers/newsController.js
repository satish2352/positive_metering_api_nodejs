const NewsEvent = require('../models/News');
const apiResponse = require('../helper/apiResponse');
const { validationResult } = require('express-validator');


function generateSlug(title) {
  return title
    .toString()                  // ensure string
    .toLowerCase()               // convert to lowercase
    .trim()                      // remove leading/trailing spaces
    .replace(/["'“”‘’]/g, "")    // remove quotes
    .replace(/[^a-z0-9\s-]/g, "")// remove everything except a-z, 0-9, space, -
    .replace(/\s+/g, "-")        // replace spaces with -
    .replace(/-+/g, "-")         // collapse multiple -
    .replace(/^-+|-+$/g, "");    // remove leading/trailing -
}

exports.addNewsEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.ErrorResponse(res, errors.array().map(err => err.msg).join(', '));
  }

  try {
    const { title, shortDesc, longDesc } = req.body;
    const img = req.files['img'] ? req.files['img'][0].path : null;
    const pdf = req.files['pdf'] ? req.files['pdf'][0].path : null;

    let slug = generateSlug(title)

    const newsEvent = await NewsEvent.create({
      img,
      pdf,
      title,
      slug,
      shortDesc,
      longDesc,
      isActive: true,
      isDelete: false,
    });

    return apiResponse.successResponseWithData(
      res,
      'News event added successfully',
      newsEvent
    );
  } catch (error) {
    console.error('Add news event failed', error);
    return apiResponse.ErrorResponse(res, 'Add news event failed');
  }
};

exports.updateNewsEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.ErrorResponse(res, errors.array().map(err => err.msg).join(', '));
  }

  try {
    const { id } = req.params;
    const { title, shortDesc, longDesc } = req.body;
    const img = req.files['img'] ? req.files['img'][0].path : null;
    const pdf = req.files['pdf'] ? req.files['pdf'][0].path : null;

    const newsEvent = await NewsEvent.findByPk(id);
    if (!newsEvent) {
      return apiResponse.notFoundResponse(res, 'News event not found');
    }

    let slug = generateSlug(title)

    newsEvent.img = img || newsEvent.img;
    newsEvent.pdf = pdf || newsEvent.pdf;
    newsEvent.title = title;
    newsEvent.slug = slug;
    newsEvent.shortDesc = shortDesc;
    newsEvent.longDesc = longDesc;
    await newsEvent.save();

    return apiResponse.successResponseWithData(
      res,
      'News event updated successfully',
      newsEvent
    );
  } catch (error) {
    console.error('Update news event failed', error);
    return apiResponse.ErrorResponse(res, 'Update news event failed');
  }
};

exports.getNewsEvents = async (req, res) => {
  try {
    const newsEvents = await NewsEvent.findAll({ where: { isDelete: false } });

    const baseUrl = `${process.env.SERVER_PATH}`;
        const newsEventsWithBaseUrl = newsEvents.map(event => ({
      ...event.toJSON(),
      img: event.img ? baseUrl + event.img.replace(/\\/g, '/') : null,
      pdf: event.pdf ? baseUrl + event.pdf.replace(/\\/g, '/') : null,
    }));

    return apiResponse.successResponseWithData(
      res,
      'News events retrieved successfully',
      newsEventsWithBaseUrl
    );
  } catch (error) {
    console.error('Get news events failed', error);
    return apiResponse.ErrorResponse(res, 'Get news events failed');
  }
};

exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const newsEvent = await NewsEvent.findByPk(id);

    if (!newsEvent) {
      return apiResponse.notFoundResponse(res, 'News event not found');
    }

    newsEvent.isActive = !newsEvent.isActive;
    await newsEvent.save();

    return apiResponse.successResponseWithData(
      res,
      'News event active status updated successfully',
      newsEvent
    );
  } catch (error) {
    console.error('Toggle news event active status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle news event active status failed');
  }
};

exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const newsEvent = await NewsEvent.findByPk(id);

    if (!newsEvent) {
      return apiResponse.notFoundResponse(res, 'News event not found');
    }

    newsEvent.isDelete = !newsEvent.isDelete;
    await newsEvent.save();

    return apiResponse.successResponseWithData(
      res,
      'News event delete status updated successfully',
      newsEvent
    );
  } catch (error) {
    console.error('Toggle news event delete status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle news event delete status failed');
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

exports.getNewsPage = async (req, res) => {
  try {
    const { slug, source } = req.params;        // Get blog ID
    const userAgent = req.headers["user-agent"] || "";

    console.log("slug", slug);
    console.log("source", source);

    // Fetch blog by ID
    const news = await NewsEvent.findOne({ where: { slug } });
    if (!news) {
      // Always return 200 to bots to avoid scraping errors
      if (isBot(userAgent)) {
        return res.status(200).send(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>news Not Found</title>
              <meta name="description" content="This news is not available." />
            </head>
            <body>
              <h1>news Not Found</h1>
              <p>The requested news does not exist.</p>
            </body>
          </html>
        `);
      }
      // For humans, redirect to main news page
      return res.redirect("https://positivemetering.com/newsdetails");
    }

    if (isBot(userAgent)) {
      // Bot request → send Open Graph meta tags
      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>${news.title}</title>
            <meta name="description" content="${news.shortDesc}" />

            <!-- Open Graph -->
            <meta property="og:title" content="${news.title}" />
            <meta property="og:description" content="${news.shortDesc}" />
            <meta property="og:image" content="${process.env.SERVER_PATH}${news.img}" />
            <meta property="og:url" content="${process.env.SERVER_PATH}newevents/news/${slug}" />
          </head>
          <body>
            <h1>${news.title}</h1>
            <p>Preview for bots only. Visit site for full blog.</p>
          </body>
        </html>
      `);
    }

    // Normal user → redirect to frontend slug URL
    const newsSlug = news.slug || news.title.toLowerCase().replace(/\s+/g, '-');
    return res.redirect(`https://${source == "com" ? "positivemetering.com" : "positivemetering.in"}/newevents/${slug}`);

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
