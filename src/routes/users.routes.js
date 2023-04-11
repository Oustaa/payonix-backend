const router = require("../utils/createRouter")();

const { authorization } = require("../middlewares/auth");
const { getUsers, createUser } = require("../controllers/users.controller");

router.get("/", authorization, getUsers);
router.post("/", authorization, createUser);

module.exports = router;
