const db = require('../../db');

function getAllRecords(callback) {
    try {
        db.query('SELECT * FROM getInTouch', callback);
    } catch (error) {
        callback(error, null);
    }
}


function createRecord(recordData, callback) {
    try {
        db.query('INSERT INTO getInTouch SET ?', recordData, callback);
    } catch (error) {
        callback(error, null);
    }
}


function updateRecord(id, recordData, callback) {
    try {
        db.query('UPDATE getInTouch SET ? WHERE id = ?', [recordData, id], callback);
    } catch (error) {
        callback(error, null);
    }
}

function deleteRecord(id, callback) {
    try {
        db.query('DELETE FROM getInTouch WHERE id = ?', id, callback);
    } catch (error) {
        callback(error, null);
    }
}

module.exports = {
    getAllRecords,
    createRecord,
    updateRecord,
    deleteRecord
};
