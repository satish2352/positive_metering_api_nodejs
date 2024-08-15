const Contact = require('../models/CarousalForms');
const apiResponse = require('../helper/apiResponse');
const nodemailer = require('nodemailer');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.addContact = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    // Create the new contact in the database
    const contact = await Contact.create({ name, email, mobile, message });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_SENT_TO, // Replace with your email
      subject: 'New Contact Form Submission',
      text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nMobile: ${mobile}\nMessage: ${message}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Failed to send email:', error);
        // Still return a success response even if the email fails
        return apiResponse.successResponseWithData(res, 'Contact added successfully, but email notification failed', contact);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Return success response
    return apiResponse.successResponseWithData(res, 'Contact added successfully', contact);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const fields = error.errors.map((err) => err.path);
      let message = 'Validation error: ';

      if (fields.includes('email')) {
        message += 'Email already exists. ';
      }
      if (fields.includes('mobile')) {
        message += 'Mobile number already exists.';
      }

      return apiResponse.validationErrorWithData(res, message.trim());
    }

    console.error('Add contact failed', error);
    return apiResponse.ErrorResponse(res, 'Add contact failed');
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({ where: { isDelete: false } });
    return apiResponse.successResponseWithData(res, 'Contacts retrieved successfully', contacts);
  } catch (error) {
    console.error('Get contacts failed', error);
    return apiResponse.ErrorResponse(res, 'Get contacts failed');
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, message } = req.body;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return apiResponse.notFoundResponse(res, 'Contact not found');
    }

    contact.name = name;
    contact.email = email;
    contact.mobile = mobile;
    contact.message = message;

    await contact.save();
    return apiResponse.successResponseWithData(res, 'Contact updated successfully', contact);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const fields = error.errors.map((err) => err.path);
      let message = 'Validation error: ';

      if (fields.includes('email')) {
        message += 'Email already exists. ';
      }
      if (fields.includes('mobile')) {
        message += 'Mobile number already exists.';
      }

      return apiResponse.validationErrorWithData(res, message.trim());
    }

    console.error('Update contact failed', error);
    return apiResponse.ErrorResponse(res, 'Update contact failed');
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return apiResponse.notFoundResponse(res, 'Contact not found');
    }

    contact.isDelete = true;
    await contact.save();

    return apiResponse.successResponseWithData(res, 'Contact deleted successfully', contact);
  } catch (error) {
    console.error('Delete contact failed', error);
    return apiResponse.ErrorResponse(res, 'Delete contact failed');
  }
};
