const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const Product = sequelize.define("Product", {
  p_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  p_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  p_availibality: {
    type: DataTypes.INTEGER,
  },
  p_origin: {
    type: DataTypes.INTEGER,
  },
  p_added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  p_image: {
    type: DataTypes.STRING,
  },
});

module.exports = Product;
