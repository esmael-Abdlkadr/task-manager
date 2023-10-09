const User = require("../model/user");
const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");

// create user.
router.post("/users/signup", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const saveUser = await newUser.save();
    // generate user token.
    const token = await saveUser.generateAuthToken();
    // Get the public profile of the user (excluding password and tokens)
    const publicProfile = await saveUser.toJSON();
    res.status(201).json({ user: publicProfile, token });
  } catch (error) {
    // handling   validation errors.
    if (error.name === "ValidationError") {
      const validationErrors = {};
      Object.keys(err.errors).forEach((key) => {
        validationErrors[key] = err.errors[key].message;
      });
      return res.status(400).json({ error: validationErrors });
    } else {
      console.log(error);
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
    // Get the public profile of the user (excluding password and tokens)
    const publicProfile = await user.toJSON();
    // Respond with user and token.
    res.json({ user: publicProfile, token });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "Unable to login. Check your email and password." });
  }
});
// LOGOUT.
router.post("/users/logout", auth, async (req, res) => {
  try {
    // Remove the current token from the user's tokens array.
    req.user.tokens = req.user.tokens.filter((token) => {
      // this  will return true when the token we are  lookig  for isn't used  for   uthentication
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).json({ message: "Logout sucessfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});
// LOGOUT-ALL-SESSIONS.
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    // Clear all tokens for the authenticated user
    req.user.tokens = [];
    // Save the user with an empty tokens array
    await req.user.save();
    res.status(200).json({ message: "Logout from all sessions sucessfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});
/// Fetch the user's profile.
router.get("/users/me", auth, async (req, res) => {
  try {
    // Get the public profile of the user (excluding password and tokens)
    const publicProfile = await req.user.toJSON();

    res.json({ user: publicProfile });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "internal server error" });
  }
});
// Fetch one user by ID.
// router.get("/users/:id", async (req, res) => {
//   try {
//     // to access   the  route  parameters  and extract id .
//     const userId = req.params.id;
//     // acessing  single  items.
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "user not found" });
//     }
//     // Get the public profile of the user (excluding password and tokens)
//     const publicProfile = await user.toJSON();
//     res.json({ user: publicProfile });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "internal server error" });
//   }
// });
// Update user
router.patch("/users/me", auth, async (req, res) => {
  const allowedUpdates = ["name", "email", "password", "age"];
  const updates = Object.keys(req.body);
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).json({ error: "Invalid updates" });
  }

  try {
    // Update the authenticated user's data using mongoose updateOne()
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    // Save the updated user
    await req.user.save();
    // Get the public profile of the user (excluding password and tokens)
    const publicProfile = await req.user.toJSON();
    res.status(200).json({ user: publicProfile });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
});

// delete user

router.delete("/users/me", auth, async (req, res) => {
  try {
    // Remove the authenticated user from the DB using mongoose deleteOne()
    await User.deleteOne({ _id: req.user._id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
