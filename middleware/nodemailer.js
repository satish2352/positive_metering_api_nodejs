// middleware/emailMiddleware.js
const nodemailer = require('nodemailer');

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables for security
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware to send an email
const sendEmail = async (req, res, next) => {
  const { to, subject, text } = req.emailOptions;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log('Email sent successfully');
    next();
  } catch (error) {
    console.error('Failed to send email', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};

module.exports = sendEmail;
