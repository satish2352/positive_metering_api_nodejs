const db = require('../../db');

function getAllRecords(callback) {
    try {
        db.query('SELECT * FROM headercontactno', callback);
    } catch (error) {
        callback(error, null);
    }
}

function createRecord(recordData, callback) {
    try {
        db.query('INSERT INTO headercontactno SET ?', recordData, callback);
    } catch (error) {
        callback(error, null);
    }
}


function updateRecord(id, recordData, callback) {
    db.query('UPDATE headercontactno SET ? WHERE id = ?', [recordData, id], (err, result) => {
        if (err) {
            callback(err, null); // Pass error to callback
            return;
        }
        if (result.affectedRows === 0) { // Check if no rows were affected
            callback(new Error(`Record with id ${id} not found`), null);
            return;
        }
        callback(null, result); // Success case
    });
}

function deleteRecord(id, callback) {
    try {
        db.query('DELETE FROM headercontactno WHERE id = ?', id, callback);
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
