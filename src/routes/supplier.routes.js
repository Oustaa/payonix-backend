const router = require("../utils/createRouter")();

const { authorization } = require("../middlewares/auth");

const {
  getSupplier,
  postSupplier,
  putSupplierInfo,
  getSupplierCompta,
  getComptaBySupplier,
  postSupplierCompta,
} = require("../controllers/supplier.controller");

router.get("/", authorization, getSupplier);
router.post("/", authorization, postSupplier);
router.put("/:id", authorization, putSupplierInfo);
router.get("/comptas", authorization, getSupplierCompta);
router.get("/:id/compta", authorization, getComptaBySupplier);
router.post("/comptas", authorization, postSupplierCompta);

module.exports = router;
