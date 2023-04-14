const { createTables } = require("./models/index");
const { connect } = require("./database/sql.connect");

const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const cookieParser = require("cookie-parser");
const storeImage = require("./utils/storeImages");
// const readFile = require("./utils/readCSV");

const sqlModule = require("./models/productCategory-sql");

const artisansRouter = require("./routes/artisans.routes");
const supplierRouter = require("./routes/supplier.routes");
const productsRouter = require("./routes/products.routes");
const rawMaterialsRouter = require("./routes/rawMat.routes");
const usersRouter = require("./routes/users.routes");
const authRouter = require("./routes/auth.routes");

const app = express();

app.use((req, res, next) => {
  console.log(`url: ${req.url}, method: ${req.method}`);
  console.log(`cookies: ${JSON.stringify(req.cookies)}`);
  next();
});

app.set("trust proxy", 1);

console.log(process.env.ALLOWED_ORIGIN);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api", express.static(path.join(__dirname, "..", "public")));

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/artisans", artisansRouter);
app.use("/api/suppliers", supplierRouter);
app.use("/api/rawMaterials", rawMaterialsRouter);
app.use("/api/users", usersRouter);

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
