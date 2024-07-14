const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HeaderContact = sequelize.define("HeaderContact", {
  phone1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = HeaderContact;
