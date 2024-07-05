const express = require("express");
const { body } = require("express-validator");
const {
  getOfficesRecord,
  createOfficesRecord,
  updateOfficesRecord,
  deleteOfficesRecord,
} = require("../controllers/officesController");
const multer = require("multer");
const { upload } = require("../controllers/officesController");
const verifyToken = require("../JWT/auth");

const router = express.Router();

router.get("/find", verifyToken, async (req, res) => {
  try {
    await getOfficesRecord(req, res);
  } catch (error) {
    console.error("Error in getofficesRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/getoffices", async (req, res) => {
  try {
    await getOfficesRecord(req, res);
  } catch (error) {
    console.error("Error in getofficesRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/createoffices",
  verifyToken,
  upload.fields([{ name: "imageUrl", maxCount: 1 }]),
  [body("title").notEmpty().withMessage("title cannot be empty")],
  [body("address").notEmpty().withMessage("address cannot be empty")],
  [body("phone").notEmpty().withMessage("phone cannot be empty")],
  [body("email").notEmpty().withMessage("email cannot be empty")],
  async (req, res) => {
    try {
      await createOfficesRecord(req, res);
    } catch (error) {
      console.error("Error in createofficesRecord:", error);
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
      await updateOfficesRecord(req, res);
    } catch (error) {
      console.error("Error in updateofficesRecord:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await deleteOfficesRecord(req, res);
  } catch (error) {
    console.error("Error in deleteofficesRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
