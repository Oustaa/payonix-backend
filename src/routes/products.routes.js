const router = require("../utils/createRouter")();

const { authorization } = require("../middlewares/auth");

const { storeImage } = require("../middlewares/storeImage");
const { errorHandler } = require("../middlewares/errorHandler");

const {
  getProducts,
  getProductsInventory,
  getProductsVariety,
  postProduct,
  postProductInventory,
  postProductVariety,
  putProductImage,
  putProductVariety,
} = require("../controllers/product.controller");

// /products
router.get("/", authorization, getProducts);
router.post("/", authorization, storeImage, errorHandler, postProduct);
router.put("/:id", authorization, storeImage, errorHandler, putProductImage);

// /products/inventory
router.get("/inventory", authorization, getProductsInventory);
router.post("/inventory", authorization, postProductInventory);

// /products/variety
router.get("/variety", authorization, getProductsVariety);
router.post("/variety", authorization, storeImage, postProductVariety);
router.put(
  "/variety/:id",
  authorization,
  storeImage,
  errorHandler,
  putProductVariety
);

module.exports = router;
