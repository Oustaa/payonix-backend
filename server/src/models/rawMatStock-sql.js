const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const RowMaterialStock = sequelize.define("RowMaterialStock", {
  rms_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  rms_date_stock: {
    type: DataTypes.DATE,
    allowNull: DataTypes.NOW,
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
    defaultValue: rms_unit_price.value * rms_quantity.value,
  },
  rms_availability: {
    type: DataTypes.INTEGER,
  },
  rms_price_prod: {
    type: DataTypes.FLOAT,
  },
});

module.exports = RowMaterialStock;
