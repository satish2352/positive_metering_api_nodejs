const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Team = require('../models/Team');
const apiResponse = require('../helper/apiResponse');
const { validationResult } = require('express-validator');

// Add a new team member
exports.addTeamMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.ErrorResponse(res, errors.array().map(err => err.msg).join(', '));
  }

  const transaction = await sequelize.transaction();

  try {
    const { name, designation, description } = req.body;
    const img = req.file ? req.file.path : null;

    // ✅ Find max position_no
    const maxPosition = await Team.max('position_no', {
      where: { isDelete: false },
      transaction,
    });

    const newPosition = (maxPosition || 0) + 1; // If null, use 1

    // ✅ Create the new member at the last position
    const newMember = await Team.create({
      img,
      name,
      designation,
      description,
      position_no: newPosition,
      isActive: true,
      isDelete: false,
    }, { transaction });

    await transaction.commit();

    return apiResponse.successResponseWithData(
      res,
      'Team member added successfully at the end',
      newMember
    );
  } catch (error) {
    await transaction.rollback();
    console.error('Add team member failed', error);
    return apiResponse.ErrorResponse(res, 'Add team member failed');
  }
};



// Update an existing team member
exports.updateTeamMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.ErrorResponse(res, errors.array().map(err => err.msg).join(', '));
  }

  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { name, designation, description, position_no } = req.body;
    const img = req.file ? req.file.path : null;

    // ✅ Step 1: Fetch current team member
    const member = await Team.findOne({
      where: { id, isDelete: false },
      transaction,
    });

    if (!member) {
      await transaction.rollback();
      return apiResponse.ErrorResponse(res, 'Team member not found');
    }

    const oldPosition = member.position_no;
    const newPosition = parseInt(position_no);

    // ✅ Step 2: If position is changed, shift others accordingly
    if (oldPosition !== newPosition) {
      if (newPosition > oldPosition) {
        // Moving down: shift affected rows up
        await Team.update(
          { position_no: Sequelize.literal('position_no - 1') },
          {
            where: {
              position_no: {
                [Sequelize.Op.gt]: oldPosition,
                [Sequelize.Op.lte]: newPosition
              },
              id: { [Sequelize.Op.ne]: id },
              isDelete: false
            },
            transaction
          }
        );
      } else {
        // Moving up: shift affected rows down
        await Team.update(
          { position_no: Sequelize.literal('position_no + 1') },
          {
            where: {
              position_no: {
                [Sequelize.Op.gte]: newPosition,
                [Sequelize.Op.lt]: oldPosition
              },
              id: { [Sequelize.Op.ne]: id },
              isDelete: false
            },
            transaction
          }
        );
      }
    }

    // ✅ Step 3: Update the member
    await member.update({
      name,
      designation,
      description,
      position_no: newPosition,
      img: img || member.img
    }, { transaction });

    await transaction.commit();

    return apiResponse.successResponseWithData(
      res,
      'Team member updated successfully',
      member
    );
  } catch (error) {
    await transaction.rollback();
    console.error('Update team member failed', error);
    return apiResponse.ErrorResponse(res, 'Update team member failed');
  }
};

// Get all team members
exports.getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.findAll({ 
      where: { isDelete: false },
      order: [['position_no', 'ASC']] // Sort by position_no
    });

    const baseUrl = `${process.env.SERVER_PATH}`;
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

// Toggle the active status of a team member
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

// Toggle the delete status of a team member
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
