const mongoose = require("mongoose");
const validator = require("validator");
// create task model
const TaskSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
    },
    owner: {
      // store  the user ID
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // This references the User model
    },
  },
  {
    timestamps: true,
  }
);
const Task = mongoose.model("task", TaskSchema);
module.exports = Task;
