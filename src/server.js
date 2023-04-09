const { createTables } = require("./models/index");
const { connect } = require("./database/sql.connect");

const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const cookieParser = require("cookie-parser");
const storeImage = require("./utils/storeImages");
// const readFile = require("./utils/readCSV");

const sqlModule = require("./models/product-sql");

const artisansRouter = require("./routes/artisans.routes");
const supplierRouter = require("./routes/supplier.routes");
const productsRouter = require("./routes/products.routes");
const rawMaterialsRouter = require("./routes/rawMat.routes");
const authRouter = require("./routes/auth.routes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://payonix.onrender.com"],
    credentials: true,
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use((req, res, next) => {
  console.log(`url: ${req.url}, method: ${req.method}`);
  console.log(`cookies: ${JSON.stringify(req.cookies)}`);
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/artisans", artisansRouter);
app.use("/api/suppliers", supplierRouter);
app.use("/api/rawMaterials", rawMaterialsRouter);

const PORT = 8000;

function startServer() {
  connect(async () => {
    // add true parameter to force recreation of all tables
    await createTables();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

startServer();
