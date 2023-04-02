const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const Product = sequelize.define("Product", {
  p_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  p_availibality: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  p_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  p_added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  p_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  p_raw_mat_base_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
module.exports = Product;
