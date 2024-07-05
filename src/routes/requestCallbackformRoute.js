const express = require("express");
const { body } = require("express-validator");
const {
    getrequestCallbackformRecord,
    createrequestCallbackformRecord,
    updaterequestCallbackformRecord,
    deleterequestCallbackformRecord,
} = require("../controllers/requestCallbackformController");
const verifyToken = require("../JWT/auth");

const router = express.Router();

router.get("/findequestCallbackform", verifyToken, async (req, res) => {
    try {
        await getrequestCallbackformRecord(req, res);
    } catch (error) {
        console.error("Error in getequestCallbackformRecord:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.get("/getequestCallbackform", async (req, res) => {
    try {
        await getrequestCallbackformRecord(req, res);
    } catch (error) {
        console.error("Error in getequestCallbackformRecord:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/createrequestCallbackform', verifyToken,
    [
        body('name').notEmpty().withMessage('name cannot be empty'),
        body('email').notEmpty().withMessage('email cannot be empty'),
        body('mobile').notEmpty().withMessage('mobile cannot be empty'),
        body('message').notEmpty().withMessage('message cannot be empty'),
       
          ],
    async (req, res) => {
        try {
            await createrequestCallbackformRecord(req, res);
        } catch (error) {
            console.error("Error in createequestCallbackformRecord:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.put("/put/:id", verifyToken,
    
    async (req, res) => {
        try {
            await updaterequestCallbackformRecord(req, res);
        } catch (error) {
            console.error("Error in updateequestCallbackformRecord:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

router.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
        await deleterequestCallbackformRecord(req, res);
    } catch (error) {
        console.error("Error in deleteequestCallbackformRecord:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
