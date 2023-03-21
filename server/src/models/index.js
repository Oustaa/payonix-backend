const artisan = require("./artisan-sql");
const artisanCompta = require("./artisanCompta-sql");
const product = require("./product-sql");
const productInventory = require("./productInventory-sql");
const productsVariety = require("./productsVariety-sql");
const rawMatBas = require("./rawMatBas-sql");
const rawMatInventory = require("./rawMatInventory-sql");
const rawMatStock = require("./rawMatStock-sql");
const rawMatType = require("./rawMatType-sql");
const supplier = require("./supplier-sql");

async function createTables(force = false) {
  await artisan.sync({ force });
  await artisanCompta.sync({ force });
  await product.sync({ force });
  await productInventory.sync({ force });
  await productsVariety.sync({ force });
  await rawMatBas.sync({ force });
  await rawMatInventory.sync({ force });
  await rawMatStock.sync({ force });
  await rawMatType.sync({ force });
  await supplier.sync({ force });
}

module.exports = { createTables };
