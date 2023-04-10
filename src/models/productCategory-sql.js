const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const ProductCategory = sequelize.define("ProductCategory", {
  pc_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  pc_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pc_added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});
module.exports = ProductCategory;
