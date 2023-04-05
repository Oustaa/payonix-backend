const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const cookieParser = require("cookie-parser");
const storeImage = require("./utils/storeImages");

const artisansRouter = require("./routes/artisans.routes");
const productsRouter = require("./routes/products.routes");
const rawMaterialsRouter = require("./routes/rawMat.routes");
const authRouter = require("./routes/auth.routes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "*"],
    credentials: true,
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use((req, res, next) => {
  console.log(`url: ${req.url}, method: ${req.method}`);
  console.log(req.cookies.access_token);
  next();
});

app.use("/api/products", productsRouter);
app.use("/api/artisans", artisansRouter);
app.use("/api/rawMaterials", rawMaterialsRouter);
app.use("/api/auth", authRouter);

app.post("/upload", storeImage.single("file"), (req, res) => {
  console.log(req.file.path);
  res.status(200).json({
    message: "File uploaded successfully",
    image_url: req.file.path,
  });
});

// app.get("/images/:filename", (req, res) => {
//   const { filename } = req.params;
//   res.set({ "Access-Control-Allow-Origin": "*" });
//   res.sendFile(path.join(__dirname, "..", "public", "images", filename));
// });

// app.get("/*", (req, res) => {
//   return res.sendFile(path.join(__dirname, "..", "public", "index.html"));
// });
module.exports = app;
