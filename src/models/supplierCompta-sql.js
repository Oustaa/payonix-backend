const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sql.connect");

const ArtisanCompta = sequelize.define("SuppliersCompta", {
  sc_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  sc_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  sc_amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sc_note: {
    type: DataTypes.TEXT,
    allowNull: null,
  },
  sc_supplier_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ArtisanCompta;
