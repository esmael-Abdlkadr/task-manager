const Task = require("../model/task");
const express = require("express");
const router = new express.Router();

// create tasks.
router.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    // save task to DB.
    const saveTask = await newTask.save();
    res.status(201).json({ saveTask });
  } catch (err) {
    res.status(400).json({ error: "can't  create  new task" });
  }
});
// fetching  all tasks.
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    if (!tasks) {
      return res.status(500).json({ error: "no task is found" });
    }
    res.json({ tasks });
  } catch {
    res.status(500).json({ error: "internal server error" });
  }
});
// fetch  single task
router.get("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "task isn't found" });
    }
    res.json({ task });
  } catch {
    res.status(500).json({ error: "internal  server error" });
  }
});
// update task.
router.patch("/tasks/:id", async (req, res) => {
  const allowedUpdates = ["description", "completed"];
  const updates = Object.keys(req.body);
  const isValid = updates.every((update) => {
    allowedUpdates.includes(update);
  });
  if (!isValid) {
    return res.status(400).json({ error: "error  while updating task" });
  }

  try {
    const taskUpdate = await Task.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!taskUpdate) {
      return res.status(404).json({ error: "task isn't  found" });
    }
    res.json({ taskUpdate });
  } catch {
    res.status(500).json({ error: "internal server error" });
  }
});
// delete task.
router.delete("/tasks/:id", async (req, res) => {
  try {
    const taskDelete = await Task.findByIdAndDelete(req.params.id);
    if (!taskDelete) {
      return res.status(400).json({ error: "error while deleting task" });
    }
    res.json({ taskDelete });
  } catch {
    res.status(404).json({ error: "task isn't found  to delete" });
  }
});
module.exports = router;
