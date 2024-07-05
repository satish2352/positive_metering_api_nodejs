const express = require("express");
const { body } = require("express-validator");
const {
  getheroFormRecord,
  createheroFormRecord,
  updateheroFormRecord,
  deleteheroFormRecord,
} = require("../controllers/heroFormController");
const verifyToken = require("../JWT/auth");

const router = express.Router();

router.get("/findheroform", verifyToken, async (req, res) => {
    try {
        await getheroFormRecord(req, res);
    } catch (error) {
        console.error("Error in getheroFormRecord:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.get("/getheroForm", async (req, res) => {
    try {
        await getheroFormRecord(req, res);
    } catch (error) {
        console.error("Error in getheroFormRecord:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/createheroForm', verifyToken,
    [
        body('name').notEmpty().withMessage('name cannot be empty'),
        body('email').notEmpty().withMessage('email cannot be empty'),
        body('mobile').notEmpty().withMessage('mobile cannot be empty'),
        body('message').notEmpty().withMessage('message cannot be empty'),
       
          ],
    async (req, res) => {
        try {
            await createheroFormRecord(req, res);
        } catch (error) {
            console.error("Error in createheroFormRecord:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.put("/put/:id", verifyToken,
    
    async (req, res) => {
        try {
            await updateheroFormRecord(req, res);
        } catch (error) {
            console.error("Error in updateheroFormRecord:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

router.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
        await deleteheroFormRecord(req, res);
    } catch (error) {
        console.error("Error in deleteheroFormRecord:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
