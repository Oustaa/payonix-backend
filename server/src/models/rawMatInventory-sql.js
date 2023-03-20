const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

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
    allowNull: true,
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
    defaultValue: rmi_quantity.value / rmi_estimated_nbr_prod.value,
  },
  rmi_rawMat_price_prod: {
    type: DataTypes.FLOAT,
  },
});

module.exports = RowMaterialInventory;
