const User = require("../model/user");
const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisismernstacktaskmanagerapp");
    // tokens.token=  used to look for user token in the tokens array.
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      res.status(400).json({ error: "user not found." });
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: "user not authenticated." });
  }
};
module.exports = auth;
