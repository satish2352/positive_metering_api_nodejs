const express = require("express");
const { body } = require("express-validator");
const {
  contactSalesCardRecord,
  createcontactSalesCardRecord,
  updatecontactSalesCardRecord,
  deletecontactSalesCardRecord,
} = require("../controllers/contactSalesCardController");
const verifyToken = require("../JWT/auth");

const router = express.Router();

router.get("/find", verifyToken, async (req, res) => {
  try {
    await contactSalesCardRecord(req, res);
  } catch (error) {
    console.error("Error in contactSalesCardRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/getcontactSalesCard", async (req, res) => {
  try {
    await contactSalesCardRecord(req, res);
  } catch (error) {
    console.error("Error in contactSalesCardRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/createcontactSalesCard",
  verifyToken,
  [
    body("title").notEmpty().withMessage("title cannot be empty"),
    body("name").notEmpty().withMessage("name cannot be empty"),
    body("phone").notEmpty().withMessage("phone cannot be empty"),
    body("email").notEmpty().withMessage("email cannot be empty"),
  ],
  async (req, res) => {
    try {
      await createcontactSalesCardRecord(req, res);
    } catch (error) {
      console.error("Error in createcontactSalesCardRecord:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    await updatecontactSalesCardRecord(req, res);
  } catch (error) {
    console.error("Error in updatecontactSalesCardRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await deletecontactSalesCardRecord(req, res);
  } catch (error) {
    console.error("Error in deletecontactSalesCardRecord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
