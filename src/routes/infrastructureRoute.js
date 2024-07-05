const express = require("express");
const { body } = require("express-validator");
const {
  getInfrastructureRecord,
  createInfrastructureRecord,
  updateInfrastructureRecord,
  deleteInfrastructureRecord,
} = require("../controllers/infrastructureController");
const multer = require("multer");
const { upload } = require("../controllers/infrastructureController");
const verifyToken = require("../JWT/auth");

const router = express.Router();

router.get("/find", verifyToken, async (req, res) => {
  try {
    await getInfrastructureRecord(req, res);
  } catch (error) {
    console.error("Error in getInfrastructureRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/getInfrastructure", async (req, res) => {
  try {
    await getInfrastructureRecord(req, res);
  } catch (error) {
    console.error("Error in getInfrastructureRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/createInfrastructure",
  verifyToken,
  upload.fields([{ name: "imageUrl", maxCount: 1 }]),
  [body("title").notEmpty().withMessage("title cannot be empty")],
  [body("description").notEmpty().withMessage("description cannot be empty")],
  async (req, res) => {
    try {
      await createInfrastructureRecord(req, res);
    } catch (error) {
      console.error("Error in createInfrastructureRecord:", error);
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
      await updateInfrastructureRecord(req, res);
    } catch (error) {
      console.error("Error in updateInfrastructureRecord:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await deleteInfrastructureRecord(req, res);
  } catch (error) {
    console.error("Error in deleteInfrastructureRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
