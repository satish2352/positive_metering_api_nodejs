const express = require("express");
const { body } = require("express-validator");
const {
  getheadercontactnoRecord,
  createheadercontactnoRecord,
  updateheadercontactnoRecord,
  deleteheadercontactnoRecord,
} = require("../controllers/headercontactnoController");
const verifyToken = require("../JWT/auth");

const router = express.Router();

router.get("/find", verifyToken, async (req, res) => {
    try {
        await getheadercontactnoRecord(req, res);
    } catch (error) {
        console.error("Error in getheadercontactnoRecord:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.get("/getHeaderContact", async (req, res) => {
    try {
        await getheadercontactnoRecord(req, res);
    } catch (error) {
        console.error("Error in getheadercontactnoRecord:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/createHeaderContact', verifyToken,
    [
        body('phone1').notEmpty().withMessage('phone1 cannot be empty'),
        body('phone2').notEmpty().withMessage('phone2 cannot be empty'),
       
          ],
    async (req, res) => {
        try {
            await createheadercontactnoRecord(req, res);
        } catch (error) {
            console.error("Error in createheadercontactnoRecord:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.put("/put/:id", verifyToken,
    
    async (req, res) => {
        try {
            await updateheadercontactnoRecord(req, res);
        } catch (error) {
            console.error("Error in updateheadercontactnoRecord:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

router.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
        await deleteheadercontactnoRecord(req, res);
    } catch (error) {
        console.error("Error in deleteheadercontactnoRecord:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
