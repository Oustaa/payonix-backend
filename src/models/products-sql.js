const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const Product = sequelize.define("Product", {
  p_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  p_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  p_description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  p_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  p_category: {
    type: DataTypes.STRING,
  },
  p_reorder_point: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  p_availibility: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  p_command_lanched: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Product;
