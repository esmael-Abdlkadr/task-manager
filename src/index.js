const express = require("express");
require("./db/mongoose");

const Task = require("./model/task");
const User = require("./model/user");
const app = express();
const port = process.env.PORT || 3000;
// a middleware  parse incoming  JSON data  from HTTP request  in to  JS object.
app.use(express.json());
/****USERS.***** */
// create user
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const saveUser = await newUser.save();
    res.status(201).json({ saveUser });
  } catch (err) {
    res.status(400).json({ error: "can't create new user" });
  }
});
// fetch  all users.
app.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    if (!user) {
      return res.json({ error: "your user DB is empty" });
    }
    res.json({ user });
  } catch {
    res.status(500).json({ error: "internal server error" });
  }
});
// fetching one user with id.
app.get("/users/:id", async (req, res) => {
  try {
    // to access   the  route  parameters  and extract id .
    const userId = req.params.id;
    // acessing  single  items.
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
  }
});
// update user.
app.patch("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userUpdated = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!userUpdated) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json({ userUpdated });
  } catch {
    res.status(500).json({ error: "internal server error" });
  }
});

//*********TASKS************* */
// create tasks.
app.post("/tasks", async (req, res) => {
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
app.get("/tasks", async (req, res) => {
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
app.get("/tasks/:id", async (req, res) => {
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
app.listen(port, () => console.log(` server is  running on port ${port}!`));
