require("./db");
const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const env = require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Routes
try {

  const getInTouchRoute = require("./src/routes/getInTouchRoute")
  app.use("/getInTouch", getInTouchRoute)

  const headercontactnoRoute = require("./src/routes/headercontactnoRoute")
  app.use("/headercontactno", headercontactnoRoute)

  const heroFormRoute = require("./src/routes/heroFormRoute")
  app.use("/heroForm", heroFormRoute)

  const requestCallbackFormRoute = require("./src/routes/requestCallbackformRoute")
  app.use("/requestCallbackForm", requestCallbackFormRoute)

  const contactSalesCardRoute = require("./src/routes/contactSalesCardRoute")
  app.use("/contactSalesCard", contactSalesCardRoute)

  const subscribeMailRoute = require("./src/routes/subscribeMailRoute")
  app.use("/subscribeMail", subscribeMailRoute)

  const homeSliderRoute = require("./src/routes/homeSliderRoute")
  app.use("/homeSlider", homeSliderRoute)

  const testimonialsRoute = require("./src/routes/testimonialRoute")
  app.use("/testimonials", testimonialsRoute)

  const officesRoute = require("./src/routes/officesRoute")
  app.use("/offices", officesRoute)

  const infrastructureRoute = require("./src/routes/infrastructureRoute")
  app.use("/infrastructure", infrastructureRoute)

  const teamRoute = require("./src/routes/AboutTeamRoute")
  app.use("/team", teamRoute)

  const loginRoutes = require("./src/routes/userRoutes");
  app.use("/auth", loginRoutes);

} catch (error) {
  console.error("Error while loading routes:", error);
}

app.get("/", (req, res) => {
  res.send(`Server is running on port no. ${process.env.APP_PORT}`);
});

// Start server
try {
  app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port no. ${process.env.APP_PORT}`);
  });
} catch (error) {
  console.error("Error while starting server:", error);
}
