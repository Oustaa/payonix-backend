const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const ProductVariety = sequelize.define("ProductVariety", {
  pv_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  pv_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  pv_description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pv_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pv_reorder_point: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  pv_availibility: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  pv_command_lanched: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  pv_product_id: {
    type: DataTypes.STRING,
  },
});

module.exports = ProductVariety;
