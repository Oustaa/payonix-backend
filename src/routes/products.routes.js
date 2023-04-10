const router = require("../utils/createRouter")();

const { authorization } = require("../middlewares/auth");

const { storeImage } = require("../middlewares/storeImage");
const { errorHandler } = require("../middlewares/errorHandler");

const {
  getProducts,
  getProductsInventory,
  getProductsCategories,
  postProduct,
  postProductInventory,
  postProductCategory,
  putProductVariety,
} = require("../controllers/product.controller");

// /products
router.get("/", authorization, getProducts);
router.post("/", authorization, storeImage, errorHandler, postProduct);

// /products/inventory
router.get("/inventory", authorization, getProductsInventory);
router.post("/inventory", authorization, postProductInventory);

// /products/variety
router.get("/category", authorization, getProductsCategories);
router.post("/category", authorization, postProductCategory);
router.put(
  "/variety/:id",
  authorization,
  storeImage,
  errorHandler,
  putProductVariety
);

module.exports = router;
