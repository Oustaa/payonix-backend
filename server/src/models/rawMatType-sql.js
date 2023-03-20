const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const RowMaterialType = sequelize.define("RowMaterialType", {
  rmt_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  rmt_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rmt_reorder_point: {
    type: DataTypes.INTEGER,
  },
  rmt_availability: {
    type: DataTypes.INTEGER,
  },
  rmt_command_launched: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = RowMaterialType;
