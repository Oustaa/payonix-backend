const router = require("../utils/createRouter")();

const { authorization } = require("../middlewares/auth");

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

router.get("/bases", authorization, getRawMatBase);
router.post("/bases", authorization, postRawMatBase);
router.get("/types", authorization, getRawMatType);
router.post("/types", authorization, postRawMatType);
router.get("/stock", authorization, getRawMatStock);
router.post("/stock", authorization, postRawMatStock);
router.get("/inventory", authorization, getRawMatInventory);
router.post("/inventory", authorization, postRawMatInventory);
router.put("/inventory/:id", authorization, putEstematedNbrProd);

module.exports = router;
