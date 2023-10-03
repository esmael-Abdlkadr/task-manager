const express = require("express");
require("./db/mongoose");

const userRouter = require("./router/user");
const taskRouter = require("./router/task");
const app = express();

const port = process.env.PORT || 3000;
// a middleware  parse incoming  JSON data  from HTTP request  in to  JS object.

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => console.log(` server is  running on port ${port}!`));
