const express = require('express');
const { upload, validateImageSize } = require('../middleware/multer');
const { validateTestimonial, validateTestimonialId } = require('../validations/testimonialValidation');
const {
  addTestimonial,
  updateTestimonial,
  getTestimonials,
  isActiveStatus,
  isDeleteStatus
} = require('../controllers/testimonialController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/create-testimonials', upload.single('img'), authenticateToken, validateTestimonial, addTestimonial);
router.put('/update-testimonials/:id', upload.single('img'), authenticateToken, validateTestimonial, validateTestimonialId, updateTestimonial);
router.get('/get-testimonials', getTestimonials);
router.get('/find-testimonials', authenticateToken, getTestimonials);
router.patch('/isactive-testimonial/:id', authenticateToken, validateTestimonialId, isActiveStatus);
router.patch('/isdelete-testimonial/:id', authenticateToken, validateTestimonialId, isDeleteStatus);

module.exports = router;
