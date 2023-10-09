const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const errorMessage = {
  invalidEmail: "invalid email address",
  invalidPassword: "password can not contain password",
  invalidAge: "age  must  be positive",
};
const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value) {
      // check if  the  email is  valid or  not
      if (!validator.isEmail(value)) {
        throw new Error(errorMessage.invalidEmail);
      }
    },
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 1) {
        throw new Error(errorMessage.invalidAge);
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.trim().toLowerCase().includes("password")) {
        throw new Error(errorMessage.invalidPassword);
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
// virtual  property.
userSchema.virtual("task", {
  ref: "Task",
  // localField=where local data is stored
  localField: "_id",
  // forigntField=is name of field  on the  task  ,  that  used  to  create relationship
  foreignField: "owner",
});

// get specific  information.
// NB. toJSON= run always evenif we don't explicitly  call it.
userSchema.methods.toJSON = async function () {
  const user = this;
  // get row object that contain user data.
  const userObject = user.toObject();
  // delete  password and tokens from the object.
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};
// generate tokens.
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    "thisismernstacktaskmanagerapp"
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
// creating userCredentials.
userSchema.statics.findByCredentials = async (email, password) => {
  // check if user is found  and search  it based on email adress.
  const user = await User.findOne({ email });
  //  check if user is found.
  if (!user) {
    throw new Error("Unable to login. User not found.");
  }

  // If a user is found, check if the provided password matches.
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login. Incorrect password.");
  }

  return user;
};

// pre- middleware.
userSchema.pre("save", async function (next) {
  const user = this;
  // check if password is modified.
  if (user.isModified("password")) {
    try {
      user.password = await bcrypt.hash(user.password, 8);
    } catch (error) {
      return next(error); // Pass the error to the next middleware
    }
  }

  next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;
