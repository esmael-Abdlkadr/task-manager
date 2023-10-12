const Task = require("../model/task");
const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();

// create tasks.
router.post("/tasks", auth, async (req, res) => {
  try {
    // const newTask = new Task(req.body);
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    // save task to DB.
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "can't  create  new task" });
  }
});
// fetching  all tasks.
router.get("/tasks", auth, async (req, res) => {
  try {
    // filter by the oner default value is false.
    const filter = { owner: req.user._id };
    if (req.query.completed) {
      filter.completed = req.query.completed === "true";
    }

    const tasks = await Task.find(filter);
    if (!tasks) {
      return res.status(500).json({ error: "no task is found" });
    }
    res.json({ tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});
// fetch  single task
router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    // const task = await Task.findById(taskId);
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({ error: "task isn't found" });
    }
    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal  server error" });
  }
});

// Update task
router.patch("/tasks/:id", auth, async (req, res) => {
  const allowedUpdates = ["description", "completed"];
  const updates = Object.keys(req.body);

  // Check if all updates are allowed
  const isValid = updates.every((update) => allowedUpdates.includes(update));
  if (!isValid) {
    return res.status(400).json({ error: "Invalid updates" });
  }

  try {
    const _id = req.params.id;
    // Find the task by ID and owner
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    // Update task properties
    updates.forEach((update) => (task[update] = req.body[update]));

    // Save the updated task
    await task.save();

    // Respond with the updated task
    res.json({ task });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
});

// delete task.
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;

    const task = await Task.findOneAndDelete({
      _id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(400).json({ error: "error while deleting task" });
    }
    res.json({ msg: "task deleted sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "task isn't found  to delete" });
  }
});
module.exports = router;
