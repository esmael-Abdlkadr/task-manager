const mongoose = require("../db/mongoose");
const User = require("../model/user");
const Task = require("../model/task");
// counting-user .
const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
};
updateAgeAndCount("651b35170210462c8065b699", 2).then((count) => {
  console.log(count);
});
// delete and count.
