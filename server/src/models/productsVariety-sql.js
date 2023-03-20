const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const ProductVariety = sequelize.define("ProductVariety", {
  pv_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  pv_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pv_description: {
    type: DataTypes.STRING,
  },
  pv_image: {
    type: DataTypes.STRING,
    allowNull: false,
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
});

module.exports = ProductVariety;
