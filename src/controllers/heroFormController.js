// recordsController.js
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const recordModel = require("../models/heroFormModal");
const multer = require("multer");
const env = require("dotenv").config();

function getheroFormRecord(req, res) {
  try {
    recordModel.getAllRecords((err, results) => {
      if (err) {
        console.error("Error fetching records:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error in getheroFormRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function createheroFormRecord(req, res) {
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
    console.error("Error in createheroFormRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function updateheroFormRecord(req, res) {
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
    console.error("Error in updateheroFormRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function deleteheroFormRecord(req, res) {
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
    console.error("Error in deleteheroFormRecord:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getheroFormRecord,
  createheroFormRecord,
  updateheroFormRecord,
  deleteheroFormRecord,
};
