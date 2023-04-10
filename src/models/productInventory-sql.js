const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

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
    defaultValue: 0,
  },
  pi_artisan_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pi_raw_mat_inv_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pi_prod_id: {
    type: DataTypes.STRING,
  },
});

module.exports = ProductInventory;
