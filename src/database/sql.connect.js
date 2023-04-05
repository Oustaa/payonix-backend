require("dotenv").config();
const Sequelize = require("sequelize");

const { DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_TYPE } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD || null, {
  host: DB_HOST,
  dialect: DB_TYPE,
});

function connect(cb) {
  sequelize
    .authenticate()
    .then(() => {
      cb();
      console.log("Connection has been established successfully.");
    })
    .catch((err) => console.error("Unable to connect to the database:", err));
}

module.exports = { connect, sequelize };
