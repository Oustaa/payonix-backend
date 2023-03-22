const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const storeImage = require("./utils/storeImages");

const artisansRouter = require("./routes/artisans.routes");
const productsRouter = require("./routes/products.routes");
const rawMaterialsRouter = require("./routes/rawMat.routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/products", productsRouter);
app.use("/artisans", artisansRouter);
app.use("/rawMaterials", rawMaterialsRouter);

// shouled be deleted and add the storeImage.single("file") middleware to whereever
app.post("/upload", storeImage.single("file"), (req, res) => {});

module.exports = app;
