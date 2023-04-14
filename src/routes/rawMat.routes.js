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
  putRawMatBase,
  putRawMatInventory,
  putRawMatStock,
  putRawMatType,
  putEstematedNbrProd,
  deleteRawMatBase,
  deleteRawMatType,
  deleteRawMatInventory,
  deleteRawMatStock,
} = require("../controllers/rawMaterial.controller");

router.get("/bases", authorization, getRawMatBase);
router.post("/bases", authorization, postRawMatBase);
router.delete("/bases/:id", authorization, deleteRawMatBase);
router.put("/bases/:id", authorization, putRawMatBase);

router.get("/types", authorization, getRawMatType);
router.post("/types", authorization, postRawMatType);
router.delete("/types/:id", authorization, deleteRawMatType);
router.put("/types/:id", authorization, putRawMatType);

router.get("/stock", authorization, getRawMatStock);
router.post("/stock", authorization, postRawMatStock);
router.delete("/stock/:id", authorization, deleteRawMatStock);

router.get("/inventory", authorization, getRawMatInventory);
router.post("/inventory", authorization, postRawMatInventory);
router.put("/inventory/:id", authorization, putEstematedNbrProd);
router.delete("/inventory/:id", authorization, deleteRawMatInventory);

module.exports = router;
