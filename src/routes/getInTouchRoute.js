const express = require("express");
const { body } = require("express-validator");
const {
    getInTouchRecord,
    creategetInTouchRecord,
    updateGetInTouchRecord,
    deleteGetInTouchRecord,
} = require("../controllers/getInTouchController");
const { upload } = require("../controllers/getInTouchController");
const verifyToken = require("../JWT/auth");

const router = express.Router();

router.get("/find", verifyToken, async (req, res) => {
    try {
        await getInTouchRecord(req, res);
    } catch (error) {
        console.error("Error in getInTouchRecord:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.get("/getInTouch", async (req, res) => {
    try {
        await getInTouchRecord(req, res);
    } catch (error) {
        console.error("Error in getInTouchRecord:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/createGetInTouch', verifyToken,
    [
        body('name').notEmpty().withMessage('Name cannot be empty'),
        body('email').notEmpty().withMessage('email cannot be empty'),
        body('phone').notEmpty().withMessage('phone cannot be empty'),
        body('subject').notEmpty().withMessage('subject cannot be empty'),
        body('message').notEmpty().withMessage('message cannot be empty'),
          ],
    async (req, res) => {
        try {
            await creategetInTouchRecord(req, res);
        } catch (error) {
            console.error("Error in creategetInTouchRecord:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.put("/update/:id", verifyToken,
    async (req, res) => {
        try {
            await updateGetInTouchRecord(req, res);
        } catch (error) {
            console.error("Error in updateGetInTouchRecord:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

router.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
        await deleteGetInTouchRecord(req, res);
    } catch (error) {
        console.error("Error in deleteGetInTouchRecord:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
