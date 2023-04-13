const router = require("../utils/createRouter")();

const { authorization } = require("../middlewares/auth");

const { storeImage } = require("../middlewares/storeImage");

const {
  getProducts,
  getProductsInventory,
  getProductsCategories,
  postProduct,
  postProductInventory,
  postProductCategory,
  deleteProduct,
  deleteProductCategory,
  deleteProductInventory,
  updateProduct,
  updateProductCategory,
  updateProductInventory,
} = require("../controllers/product.controller");

// /products
router.get("/", authorization, getProducts);
router.post("/", authorization, storeImage, postProduct);
router.delete("/:id", authorization, deleteProduct);
router.put("/:id", authorization, storeImage, updateProduct);

// /products/inventory
router.get("/inventory", authorization, getProductsInventory);
router.post("/inventory", authorization, postProductInventory);
router.delete("/inventory/:id", authorization, deleteProductInventory);
router.put("/inventory/:id", authorization, updateProductInventory);

// /products/category
router.get("/category", authorization, getProductsCategories);
router.post("/category", authorization, postProductCategory);
router.delete("/category/:id", authorization, deleteProductCategory);
router.put("/category/:id", authorization, updateProductCategory);

module.exports = router;
