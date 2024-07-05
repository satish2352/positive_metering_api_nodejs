// recordsController.js
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const recordModel = require("../models/headercontactnoModel");
const multer = require("multer");
const env = require("dotenv").config();

function getheadercontactnoRecord(req, res) {
  try {
    recordModel.getAllRecords((err, results) => {
      if (err) {
        console.error("Error fetching records:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      // const modifiedResults = results.map((item) => {
      //   return {
      //     id: item.id,
      //     name: item.name,
      //     headercontactno: item.headercontactno,
      //     subject: item.subject,
      //     message: item.message,
      //     email: item.email,
      //   };
      // });

      // Send the modified data as response
      res.json(results);
    });
  } catch (error) {
    console.error("Error in getheadercontactnoRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function createheadercontactnoRecord(req, res) {
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
    console.error("Error in createheadercontactnoRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function updateheadercontactnoRecord(req, res) {
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
    console.error("Error in updateheadercontactnoRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function deleteheadercontactnoRecord(req, res) {
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
    console.error("Error in deleteheadercontactnoRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getheadercontactnoRecord,
  createheadercontactnoRecord,
  updateheadercontactnoRecord,
  deleteheadercontactnoRecord,
};
