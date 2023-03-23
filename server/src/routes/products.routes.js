const router = require("../utils/createRouter")();

const {
  getProducts,
  getProductsInventory,
  getProductsVariety,
  postProduct,
  postProductInventory,
  postProductVariety,
} = require("../controllers/product.controller");

router.get("/", getProducts);
router.post("/", postProduct);
router.get("/inventory", getProductsInventory);
router.post("/inventory", postProductInventory);
router.get("/variety", getProductsVariety);
router.post("/variety", postProductVariety);

module.exports = router;
