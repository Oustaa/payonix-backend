const router = require("../utils/createRouter")();

const { authorization } = require("../middlewares/auth");

const {
  getSupplier,
  postSupplier,
  putSupplierInfo,
  getSupplierCompta,
  postSupplierCompta,
  deleteSupplier,
  deleteSupplierCompta,
} = require("../controllers/supplier.controller");

router.get("/", authorization, getSupplier);
router.post("/", authorization, postSupplier);
router.put("/:id", authorization, putSupplierInfo);
router.delete("/:id", authorization, deleteSupplier);

router.get("/comptas", authorization, getSupplierCompta);
router.post("/comptas", authorization, postSupplierCompta);
router.delete("/comptas/:id", authorization, deleteSupplierCompta);

module.exports = router;
