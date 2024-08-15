const express = require('express');
const { validateContact, validateContactId } = require('../validations/contactValidation');
const {
  addContact,
  getContacts,
  updateContact,
  deleteContact,
} = require('../controllers/carousalFormController');
const authenticateToken = require('../middleware/auth');
const sendEmail = require('../middleware/nodemailer');

const router = express.Router();

router.post('/addcarousalform', validateContact, addContact, sendEmail);
router.get('/find-carousalform', authenticateToken, authenticateToken, getContacts);
router.put('/update/:id', authenticateToken, validateContactId, validateContact, updateContact);
router.delete('/delete/:id', authenticateToken, validateContactId, deleteContact);

module.exports = router;
