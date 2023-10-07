const User = require("../model/user");
const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");

// create user.
// description=>
router.post("/users/signup", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const saveUser = await newUser.save();
    // generate user token.
    const token = await saveUser.generateAuthToken();
    res.status(201).json({ saveUser, token });
  } catch (err) {
    // handling   validation errors.
    if (err.name === "ValidationError") {
      const validationErrors = {};
      Object.keys(err.errors).forEach((key) => {
        validationErrors[key] = err.errors[key].message;
      });
      return res.status(400).json({ error: validationErrors });
    } else {
      console.log(err);
      return res.status(500).json({ error: "internal server error" });
    }
  }
});

// user-login.
router.post("/users/login", async (req, res) => {
  try {
    // Find user by credentials.
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    // Generate and send a JSON web token (JWT).
    const token = await user.generateAuthToken();
    // Respond with user and token.
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({
      error: "unable to login, your password or userName is  incorrect.",
    });
  }
});

// fetch  all users.
// description=>  to get response  from  the requests  first the next() have to be called  from the auth middleware
router.get("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.find({});
    // if (!user) {
    //   return res.json({ error: "your user DB is empty" });
    // }
    // res.json({ user });
    res.send(req.user);
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
// Update user
router.patch("/users/:id", async (req, res) => {
  const allowedUpdates = ["name", "email", "password", "age"];
  const updates = Object.keys(req.body);
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).json({ error: "Invalid updates" });
  }

  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal server error" });
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
