const User = require("../model/user");
const express = require("express");
const router = new express.Router();

// create user
router.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const saveUser = await newUser.save();
    res.status(201).json({ saveUser });
  } catch (err) {
    res.status(400).json({ error: "can't create new user" });
  }
});
// fetch  all users.
router.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    if (!user) {
      return res.json({ error: "your user DB is empty" });
    }
    res.json({ user });
  } catch {
    res.status(500).json({ error: "internal server error" });
  }
});
// fetching one user with id.
router.get("/users/:id", async (req, res) => {
  try {
    // to access   the  route  parameters  and extract id .
    const userId = req.params.id;
    // acessing  single  items.
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
  }
});
// update user.
router.patch("/users/:id", async (req, res) => {
  const allowedUpdates = ["name", "email", "password", "age"];
  const updates = Object.keys(req.body);
  const isValid = updates.every((update) => allowedUpdates.includes(update));
  if (!isValid) {
    return res.status(400).json({ error: "invalid updates " });
  }

  try {
    const userId = req.params.id;
    const userUpdated = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!userUpdated) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json({ userUpdated });
  } catch {
    res.status(500).json({ error: "internal server error" });
  }
});
// delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const userDeleted = await User.findByIdAndDelete(req.params.id);
    if (!userDeleted) {
      return res.status(400).json({ error: "unable to delete user" });
    }
    res.json({ userDeleted });
  } catch {
    res.status(404).json({ error: "user not found" });
  }
});
module.exports = router;
