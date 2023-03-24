const router = require("../utils/createRouter")();

const {
  getRawMatBase,
  getRawMatInventory,
  getRawMatStock,
  getRawMatType,
  postRawMatBase,
  postRawMatInventory,
  postRawMatStock,
  postRawMatType,
  putEstematedNbrProd,
} = require("../controllers/rawMaterial.controller");

router.get("/bases", getRawMatBase);
router.post("/bases", postRawMatBase);
router.get("/types", getRawMatType);
router.post("/types", postRawMatType);
router.get("/stock", getRawMatStock);
router.post("/stock", postRawMatStock);
router.get("/inventory", getRawMatInventory);
router.post("/inventory", postRawMatInventory);
router.put("/inventory/:id", putEstematedNbrProd);

module.exports = router;
