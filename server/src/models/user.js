const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const User = sequelize.define("User", {
  a_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
});

module.exports = User;
