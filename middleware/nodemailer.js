// middleware/emailMiddleware.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  }
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
    console.error('Failed to send email:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
};

module.exports = sendEmail;
