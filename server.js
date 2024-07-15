const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 8000;
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const headerContactRoutes = require("./routes/headerContactRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const infrastructureRoutes = require("./routes/infrastructureRoute");
const carrousalRoutes = require('./routes/carrousalRoutes');
const homeSliderRoutes = require('./routes/homeSliderRoutes');
const uploadCVRoutes = require('./routes/uploadCVRoutes');
const contactPersonRoutes = require('./routes/contactPersonRoutes');

app.use('/contactperson', contactPersonRoutes);
app.use("/auth", authRoutes);
app.use("/header-contact", headerContactRoutes);
app.use("/testimonials", testimonialRoutes);
app.use("/infrastructure", infrastructureRoutes);
app.use('/carrousal', carrousalRoutes);
app.use('/homeslider', homeSliderRoutes);
app.use('/uploadcv', uploadCVRoutes);
// Global Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return apiResponse.ErrorResponse(res, err.message);
  } else if (err) {
    return apiResponse.ErrorResponse(res, err.message);
  }
  next();
});

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
