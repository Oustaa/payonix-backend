const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const ArtisanCompta = sequelize.define("ArtisanCompta", {
  ac_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  ac_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ac_amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ac_note: {
    type: DataTypes.TEXT,
  },
  ac_artisan_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ArtisanCompta;
