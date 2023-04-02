const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const Supplier = sequelize.define("Supplier", {
  s_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  s_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  s_phone: {
    type: DataTypes.STRING,
  },
  s_address: {
    type: DataTypes.STRING,
  },
  s_total: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Supplier;
