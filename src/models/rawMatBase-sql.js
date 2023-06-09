const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const RowMaterialBase = sequelize.define("RowMaterialBase", {
  rmb_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  rmb_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rmd_added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = RowMaterialBase;
