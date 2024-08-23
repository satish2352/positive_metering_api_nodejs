const UploadCV = require('../models/UploadCV');
const apiResponse = require('../helper/apiResponse');
const sendEmail = require('../middleware/nodemailer');

exports.addUploadCV = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const cv = req.file ? req.file.path : null;

    const uploadCV = await UploadCV.create({ name, email, phone, subject, message, cv, isActive: true, isDelete: false });

    // Set email options for the sendEmail middleware
    req.emailOptions = {
      to: process.env.EMAIL_SENT_TO,
      subject: 'New Job Application',
      text: `A new CV has been uploaded:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}\nCV:${req.protocol}://${req.get('host')}/${cv}`,
    };

    // Send the email
    await sendEmail(req, res, (err) => {
      if (err) {
        return apiResponse.ErrorResponse(res, 'Failed to send email');
      }

      // If the email is sent successfully, return the success response
      return apiResponse.successResponseWithData(res, 'CV uploaded successfully', uploadCV);
    });

  } catch (error) {
    console.error('Upload CV failed', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      const fields = error.errors.map((err) => err.path);
      let message = 'Validation error: ';

      if (fields.includes('email')) {
        message += 'Email already exists. ';
      }
      if (fields.includes('phone')) {
        message += 'Phone number already exists. ';
      }

      return apiResponse.validationErrorWithData(res, message.trim());
    }

    return apiResponse.ErrorResponse(res, 'Upload CV failed');
  }
};

exports.updateUploadCV = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, subject, message } = req.body;
    const cv = req.file ? req.file.path : null;

    const uploadCV = await UploadCV.findByPk(id);
    if (!uploadCV) {
      return apiResponse.notFoundResponse(res, 'CV not found');
    }

    uploadCV.name = name;
    uploadCV.email = email;
    uploadCV.phone = phone;
    uploadCV.subject = subject;
    uploadCV.message = message;
    uploadCV.cv = cv || uploadCV.cv;
    await uploadCV.save();

    return apiResponse.successResponseWithData(res, 'CV updated successfully', uploadCV);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const fields = error.errors.map((err) => err.path);
      let message = 'Validation error: ';
      
      if (fields.includes('email')) {
        message += 'Email already exists. ';
      }
      if (fields.includes('phone')) {
        message += 'Phone number already exists. ';
      }

      return apiResponse.validationErrorWithData(res, message.trim());
    }

    console.error('Update CV failed', error);
    return apiResponse.ErrorResponse(res, 'Update CV failed');
  }
};

exports.getUploadCVs = async (req, res) => {
  try {
    const uploadCVs = await UploadCV.findAll({ where: { isDelete: false } });

    const baseUrl = `${req.protocol}://${req.get('host')}/`;
    const uploadCVsWithBaseUrl = uploadCVs.map(cv => {
      return {
        ...cv.toJSON(),
        cv: cv.cv ? baseUrl + cv.cv.replace(/\\/g, '/') : null
      };
    });

    return apiResponse.successResponseWithData(res, 'CVs retrieved successfully', uploadCVsWithBaseUrl);
  } catch (error) {
    console.error('Get CVs failed', error);
    return apiResponse.ErrorResponse(res, 'Get CVs failed');
  }
};

exports.toggleCVStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const uploadCV = await UploadCV.findByPk(id);

    if (!uploadCV) {
      return apiResponse.notFoundResponse(res, 'CV not found');
    }

    uploadCV.isActive = !uploadCV.isActive;
    await uploadCV.save();

    return apiResponse.successResponseWithData(res, 'CV status updated successfully', uploadCV);
  } catch (error) {
    console.error('Toggle CV status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle CV status failed');
  }
};

exports.toggleCVDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const uploadCV = await UploadCV.findByPk(id);

    if (!uploadCV) {
      return apiResponse.notFoundResponse(res, 'CV not found');
    }

    uploadCV.isDelete = !uploadCV.isDelete;
    await uploadCV.save();

    return apiResponse.successResponseWithData(res, 'CV delete status updated successfully', uploadCV);
  } catch (error) {
    console.error('Toggle CV delete status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle CV delete status failed');
  }
};
