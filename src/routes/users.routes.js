const router = require("../utils/createRouter")();

const { authorization } = require("../middlewares/auth");
const {
  getUsers,
  createUser,
  deleteUser,
} = require("../controllers/users.controller");

router.get("/", authorization, getUsers);
router.post("/", authorization, createUser);
router.delete("/:id", authorization, deleteUser);

module.exports = router;
