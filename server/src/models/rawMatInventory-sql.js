const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const RowMaterialInventory = sequelize.define("RowMaterialInventory", {
  rmi_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  rmi_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  rmi_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rmi_estimated_nbr_prod: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  rmi_number_prods_recived: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rmi_rawMat_prod: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  rmi_rawMat_price_prod: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  rmi_artisan_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rmi_raw_mat_stock_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = RowMaterialInventory;
