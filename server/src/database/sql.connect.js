const Sequelize = require("sequelize");

const sequelize = new Sequelize("payonix", "Ousta", "Ous192837465 @", {
  host: "localhost",
  dialect: "mysql",
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
