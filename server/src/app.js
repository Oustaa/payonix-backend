const express = require("express");

const artisansRouter = require("./routes/artisans.routes");
const productsRouter = require("./routes/products.routes");
const rawMaterialsRouter = require("./routes/rawMat.routes");

const app = express();

app.use(express.json());

app.use("/products", productsRouter);
app.use("/artisans", artisansRouter);
app.use("/rawMaterials", rawMaterialsRouter);

module.exports = app;
