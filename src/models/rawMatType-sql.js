const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const RowMaterialType = sequelize.define("RowMaterialType", {
  rmt_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  rmt_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rmt_reorder_point: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rmt_description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rmt_availability: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rmt_command_launched: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rmt_raw_mat_base_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = RowMaterialType;
