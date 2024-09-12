const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 8000;
const https = require('https');
const cors = require("cors");
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// const corsOptions = {
//   origin: ['*'],
//   methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };

// app.use(cors(corsOptions));
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'https://positivebackend.sumagodemo.com'); // Replace with your frontend URL
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

app.use(bodyParser.json());


app.use("/uploads", express.static("uploads"));

const sslOptions = {
  key: fs.readFileSync('./ssl/private.key'),
  cert: fs.readFileSync('./ssl/certificate.crt')
};

https.createServer(sslOptions, app).listen(443, () => {
  console.log('Server running on https://localhost:443');
});

app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});


app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "upgrade-insecure-requests");
  next();
});

app.use((req, res, next) => {
  if (req.protocol === 'http') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

const helmet = require('helmet');
app.use(helmet());

const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const headerContactRoutes = require("./routes/headerContactRoutes");
const socialContactRoutes = require("./routes/SocialContactRoute");
const testimonialRoutes = require("./routes/testimonialRoutes");
const infrastructureRoutes = require("./routes/infrastructureRoute");
const carrousalRoutes = require('./routes/carrousalRoutes');
const homeSliderRoutes = require('./routes/homeSliderRoutes');
const uploadCVRoutes = require('./routes/uploadCVRoutes');
const contactPersonRoutes = require('./routes/contactPersonRoutes');
const officeRoutes = require('./routes/officeRoutes');
const carousalFormRoutes = require('./routes/carousalFormRoutes');
const requestCallbackFormRoutes = require('./routes/requestCallbackFormRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');
const getInTouchRoutes = require('./routes/getInTouchRoutes');
const productNameRoutes = require('./routes/productNameRoutes');
const productDetailsRoutes = require('./routes/productDetailsRoutes');
const technicalDataRoutes = require('./routes/technicalDataRoutes');
const optionsDataRoutes = require('./routes/optionsDataRoutes');
const materialDataRoutes = require('./routes/materialDataRoutes');
const productAggregateRoutes = require('./routes/productAggregateRoutes');
const blogDetailRoutes = require('./routes/blogDetailRoutes');
const newsRoutes = require('./routes/newsRoutes');
const teamRoutes = require('./routes/teamRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ApplicationRoutes = require('./routes/ApplicationDataRoutes');
const productImagesRouter = require('./routes/productImagesRoutes')
app.use('/team', teamRoutes);
app.use('/news', newsRoutes);
app.use('/events', eventRoutes);
app.use('/blogdetails', blogDetailRoutes);
app.use('/productdetails', productDetailsRoutes);
app.use('/productname', productNameRoutes);
app.use('/getintouch', getInTouchRoutes);
app.use('/subscribe', subscribeRoutes);
app.use('/requestcallbackform', requestCallbackFormRoutes);
app.use('/carousal-form', carousalFormRoutes);
app.use('/office', officeRoutes);
app.use('/contactperson', contactPersonRoutes);
app.use("/auth", authRoutes);
app.use("/header-contact", headerContactRoutes);
app.use("/social-contact", socialContactRoutes);
app.use("/testimonials", testimonialRoutes);
app.use("/infrastructure", infrastructureRoutes);
app.use('/carrousal', carrousalRoutes);
app.use('/homeslider', homeSliderRoutes);
app.use('/uploadcv', uploadCVRoutes);
app.use('/technicalData', technicalDataRoutes);
app.use('/optionsData', optionsDataRoutes);
app.use('/applicationData',ApplicationRoutes);
app.use('/materialData', materialDataRoutes);
app.use('/productAggregate', productAggregateRoutes);
app.use('/productImages', productImagesRouter);
// Global Error Handling Middleware
// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return apiResponse.ErrorResponse(res, err.message);
//   } else if (err) {
//     return apiResponse.ErrorResponse(res, err.message);
//   }
//   next();
// });

// Test DB connection
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");
    await sequelize.sync(); // Ensure the database and model are in sync
  } catch (err) { 
    console.error("Error: " + err);
  }
};

// Initialize the application
const init = async () => {
  await testDbConnection();
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
};

init();

app.get("/", (req, res) => {
  res.send("server start");
});
