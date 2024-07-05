const express = require("express");
const { body } = require("express-validator");
const {
  getAboutTeamRecord,
  createAboutTeamRecord,
  updateAboutTeamRecord,
  deleteAboutTeamRecord,
} = require("../controllers/aboutTeamController");
const multer = require("multer");
const { upload } = require("../controllers/aboutTeamController");
const verifyToken = require("../JWT/auth");

const router = express.Router();

router.get("/find", verifyToken, async (req, res) => {
  try {
    await getAboutTeamRecord(req, res);
  } catch (error) {
    console.error("Error in getAboutTeamRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/getAboutTeam", async (req, res) => {
  try {
    await getAboutTeamRecord(req, res);
  } catch (error) {
    console.error("Error in getAboutTeamRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/createAboutTeam",
  verifyToken,
  upload.fields([
    { name: "imageUrl1", maxCount: 1 },
    { name: "imageUrl2", maxCount: 1 },
  ]),
  [
    body("name").notEmpty().withMessage("Name cannot be empty"),
    body("designation").notEmpty().withMessage("designation cannot be empty"),
    body("description").notEmpty().withMessage("description cannot be empty"),
  ],
  async (req, res) => {
    try {
      await createAboutTeamRecord(req, res);
    } catch (error) {
      console.error("Error in createAboutTeamRecord:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// router.put(
//   "/update/:id",
//   verifyToken,
//   upload.fields([
//     { name: "imageUrl1", maxCount: 1 },
//     { name: "imageUrl2", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       await updateAboutTeamRecord(req, res);
//     } catch (error) {
//       console.error("Error in updateAboutTeamRecord:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }
// );

router.put(
  "/update/:id",
  verifyToken,
  upload.fields([
    { name: "imageUrl1", maxCount: 1 },
    { name: "imageUrl2", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      await updateAboutTeamRecord(req, res);
    } catch (error) {
      console.error("Error in updateAboutTeamRecord:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);


router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await deleteAboutTeamRecord(req, res);
  } catch (error) {
    console.error("Error in deleteAboutTeamRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
