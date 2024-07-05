const express = require("express");
const { body } = require("express-validator");
const {
    gethomeSliderRecord,
    createhomeSliderRecord,
    updatehomeSliderRecord,
    deletehomeSliderRecord,
} = require("../controllers/homeSliderController");
const multer = require("multer");
const { upload } = require("../controllers/homeSliderController");
const verifyToken = require("../JWT/auth");

const router = express.Router();

router.get("/find", verifyToken, async (req, res) => {
  try {
    await gethomeSliderRecord(req, res);
  } catch (error) {
    console.error("Error in gethomeSliderRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/getHomeSlider", async (req, res) => {
  try {
    await gethomeSliderRecord(req, res);
  } catch (error) {
    console.error("Error in gethomeSliderRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/createHomeSlider",
  verifyToken,
  upload.fields([{ name: "imageUrl", maxCount: 1 }]),
//   [body("title").notEmpty().withMessage("Name cannot be empty")],
  async (req, res) => {
    try {
      await createhomeSliderRecord(req, res);
    } catch (error) {
      console.error("Error in createhomeSliderRecord:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/update/:id",
  verifyToken,
  upload.fields([{ name: "imageUrl", maxCount: 1 }]),
  async (req, res) => {
    try {
      await updatehomeSliderRecord(req, res);
    } catch (error) {
      console.error("Error in updatehomeSliderRecord:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await deletehomeSliderRecord(req, res);
  } catch (error) {
    console.error("Error in deletehomeSliderRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;