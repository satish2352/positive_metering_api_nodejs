const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NewsEvent = sequelize.define('News', {
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pdf: { // Add this field
    type: DataTypes.STRING,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shortDesc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  longDesc: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  slug: { // 👈 New field
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = NewsEvent;
