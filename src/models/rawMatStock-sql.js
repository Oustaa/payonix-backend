const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const RowMaterialStock = sequelize.define("RowMaterialStock", {
  rms_id: {
    type: DataTypes.STRING,
  },
  rms_date_stock: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  rms_description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rms_quantity: {
    type: DataTypes.INTEGER,
  },
  rms_unit_price: {
    type: DataTypes.FLOAT,
  },
  rms_amount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  rms_availability: {
    type: DataTypes.INTEGER,
  },
  rms_price_prod: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  rms_supplier_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rms_raw_mat_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = RowMaterialStock;
