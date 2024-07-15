const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Carrousal = sequelize.define(
  "Carrousal",
  {
    img: {
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
  },
  {
    timestamps: true,
  }
);

module.exports = Carrousal;
