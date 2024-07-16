const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductDetails = sequelize.define('ProductDetails', {
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  application: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = ProductDetails;
