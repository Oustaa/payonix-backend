const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const Artisan = sequelize.define("Artisan", {
  a_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  a_name: {
    type: DataTypes.STRING,
    allowNull: false,
    lowercase: true,
  },
  a_phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  a_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  a_total: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Artisan;
