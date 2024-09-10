const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 8000;
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
app.use('/api/team', teamRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/blogdetails', blogDetailRoutes);
app.use('/api/productdetails', productDetailsRoutes);
app.use('/api/productname', productNameRoutes);
app.use('/api/getintouch', getInTouchRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/requestcallbackform', requestCallbackFormRoutes);
app.use('/api/carousal-form', carousalFormRoutes);
app.use('/api/office', officeRoutes);
app.use('/api/contactperson', contactPersonRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/header-contact", headerContactRoutes);
app.use("/api/social-contact", socialContactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/infrastructure", infrastructureRoutes);
app.use('/api/carrousal', carrousalRoutes);
app.use('/api/homeslider', homeSliderRoutes);
app.use('/api/uploadcv', uploadCVRoutes);
app.use('/api/technicalData', technicalDataRoutes);
app.use('/api/optionsData', optionsDataRoutes);
app.use('/api/applicationData',ApplicationRoutes);
app.use('/api/materialData', materialDataRoutes);
app.use('/api/productAggregate', productAggregateRoutes);
app.use('/api/productImages', productImagesRouter);
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
