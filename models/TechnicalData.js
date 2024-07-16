// models/TechnicalData.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TechnicalData = sequelize.define('TechnicalData', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ProductDetails',
      key: 'id'
    }
  },
  technicalDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = TechnicalData;
