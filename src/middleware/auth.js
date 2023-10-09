const User = require("../model/user");
const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log("Received token:", token);
    // Verify the token using the secret key
    const decoded = jwt.verify(token, "thisismernstacktaskmanagerapp");
    console.log("Decoded user data:", decoded);
    // tokens.token=   Find the user associated with the token
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      // No user found, send a 401 Unauthorized response
      return res.status(401).json({ error: "User not authenticated." });
    }
    // Store the token and user information in the request object
    req.token = token;
    req.user = user;
    // Call the next middleware or route handler
    next();
  } catch (e) {
    res.status(401).json({ error: "User not authenticated." });
  }
};
module.exports = auth;
