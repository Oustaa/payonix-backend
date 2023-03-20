const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const ProductInventory = sequelize.define("ProductInventory", {
  pi_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  pi_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  pi_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pi_unit_price: {
    type: DataTypes.FLOAT,
  },
  pi_amount: {
    type: DataTypes.FLOAT,
    defaultValue: pi_unit_price.value * pi_quantity.value,
  },
});

module.exports = ProductInventory;
