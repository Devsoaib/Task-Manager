const taskModel = require("../models/taskModel");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    let { email } = req.user;
    const task = await new taskModel({
      title,
      description,
      status,
      email,
    }).save();
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: id };
    const task = await taskModel.deleteOne(query);
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "failed", message: "something broke" });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.params;
    const query = { _id: id };
    const task = await taskModel.updateOne(query, { status: status });
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.listTaskByStatus = async (req, res) => {
  try {
    let status = req.params.status;
    let { email } = req.user;
    let tasks = await taskModel.aggregate([
      { $match: { status: status, email: email } },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          createdDate: {
            $dateToString: {
              date: "$createdDate",
              format: "%d-%m-%Y",
            },
          },
        },
      },
    ]);

    if (tasks.length > 0) {
      res.status(200).json({ status: "success", data: tasks });
    } else {
      res.status(200).json({ status: "success", data: "no tasks found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.taskStatusCount = async (req, res) => {
  try {
    let { email } = req.user;
    const taskCount = await taskModel.aggregate([
      { $match: { email: email } },
      { $group: { _id: "$status", sum: { $count: {} } } },
    ]);

    res.status(200).json({ status: "success", data: taskCount });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
