const express = require('express');
const { upload } = require('../middleware/multer');
const {
  addTeamMember,
  updateTeamMember,
  getTeamMembers,
  isActiveStatus,
  isDeleteStatus,
} = require('../controllers/teamController');
const authenticateToken = require('../middleware/auth');
const {
  validateTeamMember,
  validateTeamMemberId,
} = require('../validations/teamValidation');

const router = express.Router();

router.post('/create-teammember', upload.single('img'), authenticateToken, validateTeamMember, addTeamMember);
router.put('/update-teammember/:id', upload.single('img'), authenticateToken, validateTeamMember, validateTeamMemberId, updateTeamMember);
router.get('/get-teammembers', getTeamMembers);
router.patch('/isactive-teammember/:id', authenticateToken, validateTeamMemberId, isActiveStatus);
router.patch('/isdelete-teammember/:id', authenticateToken, validateTeamMemberId, isDeleteStatus);

module.exports = router;
