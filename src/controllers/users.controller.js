const User = require("../models/user-sql");

async function getUsers(req, res) {
  if (req.user?.u_role !== "admin")
    return res
      .status(403)
      .json({ error_message: "must be logged in as admin" });
  try {
    const users = await User.findAll({
      attributes: { exclude: ["u_password"] },
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
      error: error,
    });
  }
}

module.exports = { getUsers };
