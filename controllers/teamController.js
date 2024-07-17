const Team = require('../models/Team');
const apiResponse = require('../helper/apiResponse');
const { validationResult } = require('express-validator');

exports.addTeamMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.ErrorResponse(res, errors.array().map(err => err.msg).join(', '));
  }

  try {
    const { name, designation, description, position_no } = req.body;
    const img = req.file ? req.file.path : null;

    const teamMember = await Team.create({
      img,
      name,
      designation,
      description,
      position_no,
      isActive: true,
      isDelete: false,
    });

    return apiResponse.successResponseWithData(
      res,
      'Team member added successfully',
      teamMember
    );
  } catch (error) {
    console.error('Add team member failed', error);
    return apiResponse.ErrorResponse(res, 'Add team member failed');
  }
};

exports.updateTeamMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.ErrorResponse(res, errors.array().map(err => err.msg).join(', '));
  }

  try {
    const { id } = req.params;
    const { name, designation, description, position_no } = req.body;
    const img = req.file ? req.file.path : null;

    const teamMember = await Team.findByPk(id);
    if (!teamMember) {
      return apiResponse.notFoundResponse(res, 'Team member not found');
    }

    teamMember.img = img || teamMember.img;
    teamMember.name = name;
    teamMember.designation = designation;
    teamMember.description = description;
    teamMember.position_no = position_no;
    await teamMember.save();

    return apiResponse.successResponseWithData(
      res,
      'Team member updated successfully',
      teamMember
    );
  } catch (error) {
    console.error('Update team member failed', error);
    return apiResponse.ErrorResponse(res, 'Update team member failed');
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.findAll({ 
      where: { isDelete: false },
      order: [['position_no', 'ASC']] // Sort by position_no
    });

    const baseUrl = `${req.protocol}://${req.get('host')}/`;
    const teamMembersWithBaseUrl = teamMembers.map(member => ({
      ...member.toJSON(),
      img: member.img ? baseUrl + member.img.replace(/\\/g, '/') : null,
    }));

    return apiResponse.successResponseWithData(
      res,
      'Team members retrieved successfully',
      teamMembersWithBaseUrl
    );
  } catch (error) {
    console.error('Get team members failed', error);
    return apiResponse.ErrorResponse(res, 'Get team members failed');
  }
};

exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await Team.findByPk(id);

    if (!teamMember) {
      return apiResponse.notFoundResponse(res, 'Team member not found');
    }

    teamMember.isActive = !teamMember.isActive;
    await teamMember.save();

    return apiResponse.successResponseWithData(
      res,
      'Team member active status updated successfully',
      teamMember
    );
  } catch (error) {
    console.error('Toggle team member active status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle team member active status failed');
  }
};

exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await Team.findByPk(id);

    if (!teamMember) {
      return apiResponse.notFoundResponse(res, 'Team member not found');
    }

    teamMember.isDelete = !teamMember.isDelete;
    await teamMember.save();

    return apiResponse.successResponseWithData(
      res,
      'Team member delete status updated successfully',
      teamMember
    );
  } catch (error) {
    console.error('Toggle team member delete status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle team member delete status failed');
  }
};