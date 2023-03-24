const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const User = sequelize.define("User", {
  u_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  u_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  u_phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  u_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  u_email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  u_password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  u_role: {
    type: DataTypes.STRING,
    defaultValue: "user",
  },
});

module.exports = User;
