// recordsController.js
const path = require("path");
const fs = require("fs");
const recordModel = require("../models/contactSalesCardModal");
const multer = require("multer");
const env = require("dotenv").config();

function contactSalesCardRecord(req, res) {
  try {
    recordModel.getAllRecords((err, results) => {
      if (err) {
        console.error("Error fetching records:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Send the modified data as response
      res.json(results);
    });
  } catch (error) {
    console.error("Error in getcontactSalesCardRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function createcontactSalesCardRecord(req, res) {
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
    console.error("Error in createcontactSalesCardRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function updatecontactSalesCardRecord(req, res) {
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
    console.error("Error in updatecontactSalesCardRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function deletecontactSalesCardRecord(req, res) {
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
    console.error("Error in deletecontactSalesCardRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  contactSalesCardRecord,
  createcontactSalesCardRecord,
  updatecontactSalesCardRecord,
  deletecontactSalesCardRecord,
};
