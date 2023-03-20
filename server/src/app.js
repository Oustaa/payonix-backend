const express = require("express");

const User = require("./models/artisan-sql");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const users = User.findAll();
  return res.json(users);
});

app.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

module.exports = app;
