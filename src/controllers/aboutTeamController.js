// recordsController.js
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const recordModel = require("../models/aboutTeamModal");
const multer = require("multer");
const env = require("dotenv").config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads/AboutTeam");
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

function getAboutTeamRecord(req, res) {
  try {
    recordModel.getAllRecords((err, results) => {
      if (err) {
        console.error("Error fetching records:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const modifiedResults = results.map((item) => {
        // Add a new property called 'modified' with value true
        return {
          id: item.id,
          name: item.name,
          designation: item.designation,
          description: item.description,
          imageUrl1: `${process.env.serverURL}AboutTeam/${item.imageUrl1}`,
          imageUrl2: `${process.env.serverURL}AboutTeam/${item.imageUrl2}`,
        };
      });

      // Send the modified data as response
      res.json(modifiedResults);
    });
  } catch (error) {
    console.error("Error in getAboutTeamRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function createAboutTeamRecord(req, res) {
  try {
    const recordData = req.body;
    const imgFile1 = req.files["imageUrl1"][0];
    const imgFile2 = req.files["imageUrl2"][0];

    recordData.imageUrl1 = imgFile1.originalname;
    recordData.imageUrl2 = imgFile2.originalname;
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
    console.error("Error in createAboutTeamRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// function updateAboutTeamRecord(req, res) {
//   try {
//     const { id } = req.params;
//     const recordData = req.body;

//     // Check if a new image file is uploaded
//     if (req.files && req.files["imageUrl1"]) {
//       const imgFile1 = req.files["imageUrl1"][0];
//       const imgFile2 = req.files["imageUrl2"][0];
//       recordData.imageUrl1 = imgFile1.originalname;
//       recordData.imageUrl2 = imgFile2.originalname;
//     }

//     recordModel.updateRecord(id, recordData, (err, result) => {
//       if (err) {
//         console.error("Error updating record:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//       res.json({ message: "Record updated successfully" });
//     });
//   } catch (error) {
//     console.error("Error in updateAboutTeamRecord:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

function updateAboutTeamRecord(req, res) {
  try {
    const { id } = req.params;
    const recordData = req.body;

    // Check if new image files are uploaded
    if (req.files) {
      if (req.files["imageUrl1"] && req.files["imageUrl1"].length > 0) {
        const imgFile1 = req.files["imageUrl1"][0];
        recordData.imageUrl1 = imgFile1.originalname;
      }

      if (req.files["imageUrl2"] && req.files["imageUrl2"].length > 0) {
        const imgFile2 = req.files["imageUrl2"][0];
        recordData.imageUrl2 = imgFile2.originalname;
      }
    }

    recordModel.updateRecord(id, recordData, (err, result) => {
      if (err) {
        console.error("Error updating record:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "Record updated successfully" });
    });
  } catch (error) {
    console.error("Error in updateAboutTeamRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function deleteAboutTeamRecord(req, res) {
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
    console.error("Error in deleteAboutTeamRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getAboutTeamRecord,
  createAboutTeamRecord,
  updateAboutTeamRecord,
  deleteAboutTeamRecord,
  upload,
};
