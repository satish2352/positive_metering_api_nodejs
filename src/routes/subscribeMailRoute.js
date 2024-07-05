const express = require("express");
const { body } = require("express-validator");
const {
  getsubscribeMailRecord,
  createsubscribeMailRecord,
  updatesubscribeMailRecord,
  deletesubscribeMailRecord,
} = require("../controllers/subscribeMailController");
const verifyToken = require("../JWT/auth");

const router = express.Router();

router.get("/find", verifyToken, async (req, res) => {
  try {
    await getsubscribeMailRecord(req, res);
  } catch (error) {
    console.error("Error in getsubscribeMailRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/getsubscribeMail", async (req, res) => {
  try {
    await getsubscribeMailRecord(req, res);
  } catch (error) {
    console.error("Error in getsubscribeMailRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/createsubscribeMail",
  verifyToken,
  [body("email").notEmpty().withMessage("email cannot be empty")],
  async (req, res) => {
    try {
      await createsubscribeMailRecord(req, res);
    } catch (error) {
      console.error("Error in createsubscribeMailRecord:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/put/:id",
  verifyToken,

  async (req, res) => {
    try {
      await updatesubscribeMailRecord(req, res);
    } catch (error) {
      console.error("Error in updgetsubscribeMailRecord:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await deletesubscribeMailRecord(req, res);
  } catch (error) {
    console.error("Error in delgetsubscribeMailRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
