const { body, param } = require('express-validator');

const validateTestimonial = [
  body('title').notEmpty().withMessage('Title is required'),
  body('review').notEmpty().withMessage('Review is required'),
  body('star').isInt({ min: 1, max: 5 }).withMessage('Star rating must be between 1 and 5')
];

const validateTestimonialId = [
  param('id').isInt().withMessage('ID must be an integer')
];

module.exports = { validateTestimonial, validateTestimonialId };
