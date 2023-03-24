const router = require("../utils/createRouter")();

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
router.get("/", getProducts);
router.post("/", storeImage, errorHandler, postProduct);
router.put("/:id", storeImage, errorHandler, putProductImage);

// /products/inventory
router.get("/inventory", getProductsInventory);
router.post("/inventory", postProductInventory);

// /products/variety
router.get("/variety", getProductsVariety);
router.post("/variety", postProductVariety);
router.put("/variety/:id", storeImage, errorHandler, putProductVariety);

module.exports = router;
