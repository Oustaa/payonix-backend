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
} = require("../controllers/rawMaterial.controller");

router.get("/bases", getRawMatBase);
router.get("/inventory", getRawMatInventory);
router.get("/stock", getRawMatStock);
router.get("/types", getRawMatType);
router.post("/bases", postRawMatBase);
router.post("/inventory", postRawMatInventory);
router.post("/stock", postRawMatStock);
router.post("/types", postRawMatType);

module.exports = router;
