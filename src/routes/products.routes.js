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
  deleteProduct,
  deleteProductCategory,
} = require("../controllers/product.controller");

// /products
router.get("/", authorization, getProducts);
router.post("/", authorization, storeImage, errorHandler, postProduct);
router.delete("/:id", authorization, errorHandler, deleteProduct);

// /products/inventory
router.get("/inventory", authorization, getProductsInventory);
router.post("/inventory", authorization, postProductInventory);

// /products/category
router.get("/category", authorization, getProductsCategories);
router.post("/category", authorization, postProductCategory);
router.delete("/category/:id", authorization, deleteProductCategory);
router.put("/category/:id", authorization, errorHandler, putProductVariety);

module.exports = router;
