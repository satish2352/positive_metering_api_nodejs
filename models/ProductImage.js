// models/ProductImages.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductImages = sequelize.define('ProductImages', {
  img: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ProductDetailId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = ProductImages;
