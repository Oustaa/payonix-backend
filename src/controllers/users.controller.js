const User = require("../models/user-sql");
const bcrypt = require("bcrypt");

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

async function createUser(req, res) {
  const userInfo = req.body;

  if (req.user?.u_role !== "admin")
    return res
      .status(403)
      .json({ error_message: "must be logged in as admin" });

  if (
    !userInfo.u_name ||
    !userInfo.u_email ||
    !userInfo.u_password ||
    !userInfo.u_role
  )
    return res.status(400).json({
      error_message: `missing required field`,
      missing_field: [
        !userInfo.u_name && "u_name",
        !userInfo.u_email && "u_email",
        !userInfo.u_password && "u_password",
        !userInfo.u_role && "u_role",
      ],
    });

  const hashPassword = await bcrypt.hash(req.body.u_password, 10);

  try {
    const user = await User.findOne({ where: { u_email: req.body.u_email } });

    if (user) {
      return res.status(409).json({
        u_email: 1,
        error_message: "can't create an account with the provided email.",
      });
    }

    const savedUser = await User.create({
      ...userInfo,
      u_password: hashPassword,
    });
    return res.status(201).json(savedUser);
  } catch (err) {
    if (err.code === 11000)
      return res.status(300).json({
        existed_account: 1,
        error_message: `account already exists, try logging in`,
      });
    else if (err.name === "ValidationError") {
      return res.status(400).json({
        error_message: `missing required fields`,
      });
    } else return res.status(500).json(err);
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;

  if (!id)
    return res
      .status(204)
      .json({ error_message: "No user ID have been provided" });

  try {
    const deletedCount = await User.destroy({
      where: { u_id: id },
    });

    // check if deleting count is 1
    if (deletedCount >= 1)
      return res.status(200).json({
        message: `User with the ID: ${id} was deleted successfuly`,
        deletionCount: deletedCount,
      });
    return res.status(400).json({
      error_message: `User with the ID: ${id} was not deleted.`,
      deletionCount: deletedCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

module.exports = { getUsers, createUser, deleteUser };
