const express = require("express");
const { body } = require("express-validator");
const {
  getTestimonialsRecord,
  createTestimonialsRecord,
  updateTestimonialsRecord,
  deleteTestimonialsRecord,
} = require("../controllers/testimonialController");
const multer = require("multer");
const { upload } = require("../controllers/testimonialController");
const verifyToken = require("../JWT/auth");

const router = express.Router();

router.get("/find", verifyToken, async (req, res) => {
  try {
    await getTestimonialsRecord(req, res);
  } catch (error) {
    console.error("Error in getTestimonialsRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/getTestimonials", async (req, res) => {
  try {
    await getTestimonialsRecord(req, res);
  } catch (error) {
    console.error("Error in getTestimonialsRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/createTestimonials",
  verifyToken,
  upload.fields([{ name: "imageUrl", maxCount: 1 }]),
  [body("title").notEmpty().withMessage("title cannot be empty")],
  [body("review").notEmpty().withMessage("review cannot be empty")],
  [body("star").notEmpty().withMessage("star cannot be empty")],
  async (req, res) => {
    try {
      await createTestimonialsRecord(req, res);
    } catch (error) {
      console.error("Error in createTestimonialsRecord:", error);
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
      await updateTestimonialsRecord(req, res);
    } catch (error) {
      console.error("Error in updateTestimonialsRecord:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await deleteTestimonialsRecord(req, res);
  } catch (error) {
    console.error("Error in deleteTestimonialsRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
