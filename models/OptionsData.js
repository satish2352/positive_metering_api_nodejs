// models/OptionsData.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OptionsData = sequelize.define('OptionsData', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ProductDetails',
      key: 'id'
    }
  },
  optionsDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = OptionsData;