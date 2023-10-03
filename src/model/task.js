const mongoose = require("mongoose");
const validator = require("validator");
// create task model
const Task = mongoose.model("task", {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
  },
});
module.exports = Task;
