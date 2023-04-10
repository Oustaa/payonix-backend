const artisan = require("./artisan-sql");
const artisanCompta = require("./artisanCompta-sql");
const productCategory = require("./productCategory-sql");
const productInventory = require("./productInventory-sql");
const products = require("./products-sql");
const rawMatBase = require("./rawMatBase-sql");
const rawMatInventory = require("./rawMatInventory-sql");
const rawMatStock = require("./rawMatStock-sql");
const rawMatType = require("./rawMatType-sql");
const supplier = require("./supplier-sql");
const supplierCompta = require("./supplierCompta-sql");
const user = require("./user-sql");

async function createTables(force = false) {
  await artisan.sync({ force });
  await artisanCompta.sync({ force });
  await productCategory.sync({ force });
  await productInventory.sync({ force });
  await products.sync({ force });
  await rawMatBase.sync({ force });
  await rawMatType.sync({ force });
  await rawMatInventory.sync({ force });
  await rawMatStock.sync({ force });
  await supplier.sync({ force });
  await supplierCompta.sync({ force });
  await user.sync({ force });
}

module.exports = { createTables };
