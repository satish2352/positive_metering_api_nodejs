const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const headerContactRoutes = require('./routes/headerContactRoutes')
const testimonialRoutes = require('./routes/testimonialRoutes');
const app = express();
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/auth', authRoutes);
app.use('/header-contact', headerContactRoutes);
app.use('/testimonials', testimonialRoutes);

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
    console.log('Database connected...');
    await sequelize.sync(); // Ensure the database and model are in sync
  } catch (err) {
    console.error('Error: ' + err);
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