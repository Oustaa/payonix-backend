const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const storeImage = require("./utils/storeImages");

const artisansRouter = require("./routes/artisans.routes");
const productsRouter = require("./routes/products.routes");
const rawMaterialsRouter = require("./routes/rawMat.routes");
const authRouter = require("./routes/auth.routes");

const app = express();

app.use((req, res, next) => {
  console.log(`url: ${req.url}, method: ${req.method}`);
  next();
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public", "images")));

app.use("/products", productsRouter);
app.use("/artisans", artisansRouter);
app.use("/rawMaterials", rawMaterialsRouter);
app.use("/auth", authRouter);

app.post("/upload", storeImage.single("file"), (req, res) => {
  console.log(req.file.path);
  res.status(200).json({
    message: "File uploaded successfully",
    image_url: req.file.path,
  });
});

app.get("/images/:filename", (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, "..", "public", "images", filename));
});

module.exports = app;
