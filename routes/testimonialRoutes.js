const express = require('express');
const authenticateToken = require('../middleware/auth');
const { validateTestimonial, validateTestimonialId } = require('../validations/testimonialValidation');
const {
  addTestimonial,
  updateTestimonial,
  getTestimonials,
  isActiveStatus,
  isDeleteStatus
} = require('../controllers/testimonialController');

const router = express.Router();

router.post('/create-testimonials', authenticateToken, validateTestimonial, addTestimonial);
router.put('/update-testimonials/:id', authenticateToken, validateTestimonial, validateTestimonialId, updateTestimonial);
router.get('/get-testimonials', getTestimonials);
router.get('/find-testimonials', authenticateToken, getTestimonials);
router.put('/isactive-testimonial/:id', authenticateToken, validateTestimonialId, isActiveStatus);
router.delete('/isdelete-testimonial/:id', authenticateToken, validateTestimonialId, isDeleteStatus);

module.exports = router;
