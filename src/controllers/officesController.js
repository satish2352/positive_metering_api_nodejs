// recordsController.js
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const recordModel = require("../models/officeModal");
const multer = require("multer");
const env = require("dotenv").config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads/Offices");
    // Check if the upload directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      // file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      file.originalname
    );
  },
});

const upload = multer({ storage: storage });

function getOfficesRecord(req, res) {
  try {
    recordModel.getAllRecords((err, results) => {
      console.log("results", results);
      if (err) {
        console.error("Error fetching records:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const modifiedResults = results.map((item) => {
        // Add a new property called 'modified' with value true
        return {
          id: item.id,
          title: item.title,
          address: item.address,
          phone: item.phone,
          email: item.email,
          imageUrl: `${process.env.serverURL}Offices/${item.imageUrl}`,
        };
      });
      console.log("modifiedResults", modifiedResults);
      // Send the modified data as response
      res.json(modifiedResults);
    });
  } catch (error) {
    console.error("Error in getOfficesRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function createOfficesRecord(req, res) {
  try {
    const recordData = req.body;
    const imgFile = req.files["imageUrl"][0];

    recordData.imageUrl = imgFile.originalname;
    recordModel.createRecord(recordData, (err, result) => {
      if (err) {
        console.error("Error creating record:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res
        .status(201)
        .json({ message: "Record created successfully", result: recordData });
    });
  } catch (error) {
    console.error("Error in createOfficesRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function updateOfficesRecord(req, res) {
  try {
    const { id } = req.params;
    const recordData = req.body;

    // Check if a new image file is uploaded
    if (req.files && req.files["imageUrl"]) {
      const imgFile = req.files["imageUrl"][0];
      recordData.imageUrl = imgFile.originalname;
    }

    recordModel.updateRecord(id, recordData, (err, result) => {
      if (err) {
        console.error("Error updating record:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "Record updated successfully" });
    });
  } catch (error) {
    console.error("Error in updateOfficesRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function deleteOfficesRecord(req, res) {
  try {
    const { id } = req.params;
    recordModel.deleteRecord(id, (err, result) => {
      if (err) {
        console.error("Error deleting record:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.send("Record deleted successfully");
    });
  } catch (error) {
    console.error("Error in deleteOfficesRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getOfficesRecord,
  createOfficesRecord,
  updateOfficesRecord,
  deleteOfficesRecord,
  upload,
};
