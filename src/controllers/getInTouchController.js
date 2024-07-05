// recordsController.js
const path = require("path");
const fs = require("fs");
const recordModel = require("../models/getInTouchModal");
const multer = require("multer");
const env = require("dotenv").config();

function getInTouchRecord(req, res) {
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
          contact: item.contact,
          subject: item.subject,
          message: item.message,
          email: item.email,
        };
      });

      // Send the modified data as response
      res.json(modifiedResults);
    });
  } catch (error) {
    console.error("Error in getgetInTouchRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function creategetInTouchRecord(req, res) {
  try {
    const recordData = req.body;

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
    console.error("Error in creategetInTouchRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function updateGetInTouchRecord(req, res) {
  try {
    const { id } = req.params;
    const recordData = req.body;

 
    recordModel.updateRecord(id, recordData, (err, result) => {
      if (err) {
        console.error("Error updating record:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "Record updated successfully" });
    });
  } catch (error) {
    console.error("Error in updategetInTouchRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function deleteGetInTouchRecord(req, res) {
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
    console.error("Error in deletegetInTouchRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getInTouchRecord,
  creategetInTouchRecord,
  updateGetInTouchRecord,
  deleteGetInTouchRecord,
};
