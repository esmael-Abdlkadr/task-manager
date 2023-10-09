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
    const tasks = await Task.find({ owner: req.user._id });
    if (!tasks) {
      return res.status(500).json({ error: "no task is found" });
    }
    res.json({ tasks });
  } catch {
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
// update task.
router.patch("/tasks/:id", async (req, res) => {
  const allowedUpdates = ["description", "completed"];
  const updates = Object.keys(req.body);
  const isValid = updates.every((update) => allowedUpdates.includes(update));
  if (!isValid) {
    return res.status(400).json({ error: "error  while updating task" });
  }

  try {
    // const taskUpdate = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    const taskUpdate = await Task.findById(req.params.id);
    if (!taskUpdate) {
      return res.status(404).json({ error: "task isn't  found" });
    }
    updates.forEach((update) => (taskUpdate[update] = req.body[update]));
    await taskUpdate.save();

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
