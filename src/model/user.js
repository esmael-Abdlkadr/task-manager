const mongoose = require("mongoose");
const validator = require("validator");
// create user model.
const User = mongoose.model("user", {
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,

    validate(value) {
      // check if  the  email is  valid or  not
      if (!validator.isEmail(value)) {
        throw new Error("please   enter  valid email");
      }
    },
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 1) {
        throw new Error("age  must  be positive ");
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
        throw new Error("password can not contain password");
      }
    },
  },
});
module.exports = User;
